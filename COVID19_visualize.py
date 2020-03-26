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

	lines = cases.plot(df['Date'], df['Confirmed'], 'yellow', df['Date'], df['Recovered'], 'green', df['Date'], df['Deaths'], 'red')
	cases.legend(lines, ('Confirmed', 'Recovered', 'Dead'))
	
	lines = cases_log.plot(df['Date'], df['Confirmed'], 'yellow', df['Date'], df['Recovered'], 'green', df['Date'], df['Deaths'], 'red')
	cases_log.legend(lines, ('Confirmed', 'Recovered', 'Dead'))

	lines = growth_rate.plot(df['Date'], get_rate(df['Confirmed']), 'yellow', df['Date'], get_rate(df['Recovered']), 'green', df['Date'], get_rate(df['Deaths']), 'red')
	growth_rate.legend(lines, ('Confirmed', 'Recovered', 'Dead'))

	lines = growth_rate_log.plot(df['Date'], get_rate(df['Confirmed']), 'yellow', df['Date'], get_rate(df['Recovered']), 'green', df['Date'], get_rate(df['Deaths']), 'red')
	growth_rate_log.legend(lines, ('Confirmed', 'Recovered', 'Dead'))

	figure.tight_layout(pad = 3.0, rect = [0, 0, 1, 0.94])
	chart.show()

if __name__ == "__main__":
	print("\t\tCOVID-19 Growth Visualization\n")
	country = input("Plot COVID-19 Growth trends for (enter the name of the country or enter \'Global\' for worldwide trends):\n").lower()
	COVID19_growth = chart.figure(figsize = (28, 14), dpi = 75, facecolor = 'white')

	if(country == "global"):
		COVID19_global_df = data.read_csv("https://raw.githubusercontent.com/datasets/covid-19/master/data/worldwide-aggregated.csv", parse_dates = ['Date'])
		df = COVID19_global_df
	
	else:
		COVID19_country_df = data.read_csv("https://raw.githubusercontent.com/datasets/covid-19/master/data/countries-aggregated.csv", parse_dates = ['Date'])
		COVID19_country_df['Country'] = COVID19_country_df['Country'].str.lower()
		df = COVID19_country_df.loc[(COVID19_country_df['Country'] == country)]
	
	try:
		tally = df.iloc[-1]
	except(IndexError):
			print("Invalid Country. Please correct the name of the country.")
			quit()

	print("\nGenerating trends...")
	print("Current Tally:\t{}\nConfirmed: {}\tRecovered: {}\tDead: {}".format(country.title(), tally['Confirmed'], tally['Recovered'], tally['Deaths']))
	print("Mortality rate: {}%".format(str.format('{0:.3f}', 100 * tally['Deaths'] / tally['Confirmed'])))
	plot_growth(df, COVID19_growth, country)
