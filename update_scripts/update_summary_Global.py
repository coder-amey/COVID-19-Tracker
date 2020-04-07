import pandas as data
import os.path
import json
from datetime import datetime
from regression import *

data.options.mode.chained_assignment = None
samples = 5			#Points to be sampled for regression.
time_series = data.read_csv("https://raw.githubusercontent.com/datasets/covid-19/master/data/countries-aggregated.csv")		#Load the country-wise time-series.
df_global = data.read_csv("https://raw.githubusercontent.com/datasets/covid-19/master/data/worldwide-aggregated.csv")		#Load the global time-series.
#Reformat and combine the two series into a uniform format.
df_global["Country"] = "Global Total"
df_global = df_global.drop(columns = ["Increase rate"])
time_series = time_series.append(df_global)
time_series = time_series.rename(columns = {'Country': 'Region', 'Recovered': 'Recovered/Migrated', 'Deaths': 'Deceased'})

latest_tally = time_series.loc[time_series["Date"] == time_series.Date.unique()[-1]]		#Date of last update.
yest_tally = time_series.loc[time_series["Date"] == time_series.Date.unique()[-2]]		#Previous day's tally.
predictables = time_series.loc[time_series["Date"] == time_series.Date.unique()[-samples]]	#Regions with enough data for a prediction.

#Add new columns to track increments in each type of cases (initialized as current number of cases).
latest_tally["CNF_inc"] = latest_tally["Confirmed"].copy()
latest_tally["RCV_inc"] = latest_tally["Recovered/Migrated"].copy()
latest_tally["DCS_inc"] = latest_tally["Deceased"].copy()

#Add new columns to store predictions (initialized to "Insufficient Data").
latest_tally["CNF_pred"] = "Insufficient Data"
latest_tally["DCS_pred"] = "Insufficient Data"

#Subtract yesterday's tally from the respective cases from every region.
for region in yest_tally.Region.unique():
	window = latest_tally.Region == region
	window_yest = yest_tally.Region == region
	idx = latest_tally[window].index
	latest_tally.loc[idx, "CNF_inc"] = latest_tally[window].iat[0, 2] - yest_tally[window_yest].iat[0, 2]
	latest_tally.loc[idx, "RCV_inc"] = latest_tally[window].iat[0, 3] - yest_tally[window_yest].iat[0, 3]
	latest_tally.loc[idx, "DCS_inc"] = latest_tally[window].iat[0, 4] - yest_tally[window_yest].iat[0, 4]

#Calculate and store the predictions for each region.
for region in predictables.Region.unique():
	window = latest_tally.Region == region
	idx = latest_tally[window].index
	latest_tally.loc[idx, "CNF_pred"] = int(exp_predict(samples + 1, *exp_reg(time_series[time_series.Region == region].Confirmed.tolist()[-samples:])))
	latest_tally.loc[idx, "DCS_pred"] = int(exp_predict(samples + 1, *exp_reg(time_series[time_series.Region == region].Deceased.tolist()[-samples:])))

#Re-index, re-order and sort the columns.
latest_tally = latest_tally[["Region", "Confirmed", "CNF_inc", "Recovered/Migrated", "RCV_inc", "Deceased", "DCS_inc", "CNF_pred", "DCS_pred"]].sort_values(by = "Confirmed", ascending = False, ignore_index = True)
latest_tally = latest_tally.set_index("Region")

#Write the table in the JSON file.
base_dir = os.path.join(os.path.dirname(__file__), "../")		#Obtain the path to the base directory for absosulte addressing.
summary = json.loads(latest_tally.to_json(orient = 'split', index = True))
summary["update_time"] = datetime.now().strftime("%d %B %Y, %H:%M") + " IST"
with open(base_dir + 'data/Global_summary.json', 'w') as jfile:
	json.dump(summary, jfile)

