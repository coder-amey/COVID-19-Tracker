import numpy as maths

def lin_reg(*series):
	'''Fits the data (x, y) to the equation y = ax + b and returns (a, b)'''	
	if(len(series)) == 1:
		y = series[0]
		x = [index for index in range(len(y))]
	else:
		x, y = series

	x_ = maths.sum(x) / len(x)
	y_ = maths.sum(y) / len(y)
	xy_ = maths.dot(x - x_, y - y_)
	xx_ = maths.dot(x - x_, x - x_)

	a = xy_ / xx_
	b = y_ - (a * x_)
	return(a, b)

def exp_reg(y):
	'''Fits the data (y) to the equation y = b.(a^x) and returns (a, b)'''
	y = [y_ for y_ in y if y_ > 0]			#Clean non-zero values.
	if(len(y) == 0):		#If all entries in y are 0, then the required curve is the x-axis.
		return(0, 0)

	if(len(y) == 1):		#If there's only one entry in y, then the required curve is a line parallel to the x-axis: y = y[0]
		return(y[0], y[0])

	else:
		a, b = maths.exp(lin_reg(maths.log(y)))		#Fit the series to a linear model using a logarithmic scale.
		#y = b.(a^x)		=>		log(y) = x.log(a) + log(b)
		return(a, b)

def exp_predict(x, a, b):
	'''Returns a prediction for an exponenial series characterised by (a, b).'''
	return((a ** x) * b)
