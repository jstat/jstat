## Statistical Tests

The test module includes methods that enact popular statistical tests.
The tests that are implemented are Z tests, T tests, and F tests.
Also included are methods for developing confidence intervals. Currently
regression is not included but it should be included soon (once matrix
inversion is fixed).

## Statistics Instance Functionality

### zscore( value[, flag])

Returns the z-score of the value taking the jStat object as the observed
values. Flag==true denotes use of sample standard deviation.

### ztest( value, sides[, flag])

Returns the p-value of the value taking the jStat object as the observed
values. Sides is an integer value 1 or 2 denoting a 1 or 2 sided z-test.
The test defaults to a 2 sided z-test if sides is not specified.Flag==true
denotes use of sample standard devaition.

### tscore( value)

Returns the t-score of the value taking the jStat object as the observed
values.

### ttest( value, sides)

Returns the p-value of the value taking the jStat object as the observed
values. Sides is an integer value 1 or 2 denoting a 1 or 2 sided t-test.
The test defaults to a 2 sided t-test if sides is not specified.

### anovafscore()

Returns the f-score of the ANOVA test on the arrays of the jStat object.

### anovaftest()

Returns the p-value of an ANOVA test on the arrays of the jStat object.

## Static Methods 

## Z Statistics

### jStat.zscore( value, mean, sd)

Returns the z-score of value given the mean and the standard deviation
of the test.

### jStat.zscore( value, array[, flag])

Returns the z-score of value given the data from array. Flag==true denotes
use of the sample standard deviation.

### jStat.ztest( value, mean, sd, sides)

Returns the p-value of a the z-test of value given the mean and standard
deviation of the test. Sides is an integer value 1 or 2 denoting a
one or two sided z-test. If sides is not specified the test defaults
to a two sided z-test.

### jStat.ztest( zscore, sides)

Returns the p-value of the z-score. Sides is an integer value 1 or 2
denoting a one or two sided z-test. If sides is not specified the test
defaults to a two sided z-test

### jStat.ztest( value, array, sides[, flag])

Returns the p-value of value given the data from the array. Sides is
an integer value 1 or 2 denoting a one or two sided z-test. If sides
is not specified the test defaults to a two sided z-test. flag==true
denotes the use of the sample standard deviation.

## T Statistics

### jStat.tscore( value, mean, sd, n)

Returns the t-score of the value given the mean, standard deviation,
and the sample size n.

### jStat.tscore( value, array)

Returns the t-score of value given the data from the array.

### jStat.ttest( value, mean, sd, n, sides)

Returns the p-value of value given the mean, standard deviation,
and the sample size n. Sides is an integer value 1 or 2 denoting
a one or two sided t-test. If sides is not specified the test
defaults to a two sided t-test.

### jStat.ttest( tscore, n, sides)

Returns the p-value of the t-score given the sample size n. Sides 
is an integer value 1 or 2 denoting a one or two sided t-test. 
If sides is not specified the test defaults to a two sided t-test. 

### jStat.ttest( value, array, sides)

Returns the p-value of the value given the data in the array.
Sides is an integer value 1 or 2 denoting a one or two sided 
t-test. If sides is not specified the test defaults to a two 
sided t-test.

## F Statistics

### jStat.anovafscore( array1, array2, ..., arrayn)

Returns the f-score of an ANOVA on the arrays.

### jStat.anovafscore( [array1,array2, ...,arrayn])

Returns the f-score of an ANOVA on the arrays.

### jStat.anovaftest( array1, array2, ...., arrayn)

Returns the p-value of the f-statistic from the ANOVA
test on the arrays.

### jStat.ftest( fscore, df1, df2)

Returns the p-value for the fscore with a numerator degress
of freedom df1 and the denominator degrees of freedom df2

## Confidence Intervals

### jStat.normalci( value, alpha, sd, n)

Returns a 1-alpha confidence interval for the value given
a normal distribution with a standard deviation sd and a
sample size n
  
### jStat.normalci( value, alpha, array)

Returns a 1-alpha confidence interval for the value given
a normal distribution in the data from the array.

### jStat.tci( value, alpha, sd, n)

Returns a 1-alpha confidence interval for the value given
the standard deviation and the sample size n.

### jStat.tci( value, alpha, array)

Returns a 1-alpha confidence interval for the value given
the data from the array.
