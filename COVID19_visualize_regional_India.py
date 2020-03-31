import matplotlib.pyplot as chart 
import pandas as data
from datetime import datetime

def get_rate(series):
	'''Returns the first-order derivative of the provided series w.r.t. the sampling frequency.'''
	
	rate = []
	prev_val = 0
	for i in series:
		rate.append(i - prev_val)
		prev_val = i
	return(rate)


def plot_growth(df, figure, title):
	'''Plots the contents of the dataframe (df) onto the figure.'''

	figure.suptitle('COVID-19 Growth\n{}\n{}'.format(title.upper(), datetime.now().strftime('%d %B %Y')), fontsize=14, fontweight='bold')
	
	cases = figure.add_subplot(4, 1, 1)
	cases.title.set_text('COVID-19 Growth Pattern')
	cases.set_xlabel('Date')
	cases.set_ylabel('Cases')

	cases_log = figure.add_subplot(4, 1, 2)
	cases_log.title.set_text('COVID-19 Logarithmic Growth Pattern')
	cases_log.set_xlabel('Date')
	cases_log.set_ylabel('Cases')
	cases_log.set_yscale('log')

	growth_rate = figure.add_subplot(4, 1, 3)
	growth_rate.title.set_text('COVID-19 Growth Rate Pattern')
	growth_rate.set_xlabel('Date')
	growth_rate.set_ylabel('Cases per day')

	growth_rate_log = figure.add_subplot(4, 1, 4)
	growth_rate_log.title.set_text('COVID-19 Logarithmic Growth Rate Pattern')
	growth_rate_log.set_xlabel('Date')
	growth_rate_log.set_ylabel('Cases per day')
	growth_rate_log.set_yscale('log')

	lines = cases.plot(df['Date'], df['Confirmed'], 'yellow', df['Date'], df['Recovered/Migrated'], 'green', df['Date'], df['Deceased'], 'red')
	cases.legend(lines, ('Confirmed', 'Recovered/Migrated', 'Dead'))
	
	lines = cases_log.plot(df['Date'], df['Confirmed'], 'yellow', df['Date'], df['Recovered/Migrated'], 'green', df['Date'], df['Deceased'], 'red')
	cases_log.legend(lines, ('Confirmed', 'Recovered/Migrated', 'Dead'))

	lines = growth_rate.plot(df['Date'], get_rate(df['Confirmed']), 'yellow', df['Date'], get_rate(df['Recovered/Migrated']), 'green', df['Date'], get_rate(df['Deceased']), 'red')
	growth_rate.legend(lines, ('Confirmed', 'Recovered/Migrated', 'Dead'))

	lines = growth_rate_log.plot(df['Date'], get_rate(df['Confirmed']), 'yellow', df['Date'], get_rate(df['Recovered/Migrated']), 'green', df['Date'], get_rate(df['Deceased']), 'red')
	growth_rate_log.legend(lines, ('Confirmed', 'Recovered/Migrated', 'Dead'))

	figure.tight_layout(pad = 3.0, rect = [0, 0, 1, 0.94])
	chart.show()

if __name__ == "__main__":
	print("\t\tCOVID-19 Growth Visualization\n\t\t\tINDIA-Regional\n")
	state = input("Plot COVID-19 Growth trends for (enter the name of the state/UT or enter \'National\' for national trends):\n").lower()
	if(state == "national"):
		state = "national total"
	COVID19_growth = chart.figure(figsize = (28, 14), dpi = 75, facecolor = 'white')

	COVID19_Bharat_df = data.read_csv("https://raw.githubusercontent.com/coder-amey/COVID-19-India_Data/master/time-series/India_regional_aggregated.csv", parse_dates = ['Date'], dayfirst = True)
	COVID19_Bharat_df['Region'] = COVID19_Bharat_df['Region'].str.lower()
	df = COVID19_Bharat_df.loc[(COVID19_Bharat_df['Region'] == state)]

	try:
		tally = df.iloc[-1]
	except(IndexError):
		print("Invalid Region. Please correct the name of the state/UT.")
		quit()

	print("\nGenerating trends...")
	print("Current Tally:\t{}\nConfirmed: {}\tRecovered/Migrated: {}\tDeceased: {}".format(state.title(), tally['Confirmed'], tally['Recovered/Migrated'], tally['Deceased']))
	print("Mortality rate: {}%".format(str.format('{0:.3f}', 100 * tally['Deceased'] / tally['Confirmed'])))
	plot_growth(df, COVID19_growth, state)