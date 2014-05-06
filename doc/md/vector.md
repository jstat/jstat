## Vector Functionality

### sum()

**sum( array )**

Return the sum of a vector.

    jStat.sum([1,2,3]) === 6

**fn.sum( [bool][,callback] )**

Return the sum of a vector or matrix columns.

    jStat( 1, 5, 5 ).sum() === 15
    jStat([[1,2],[3,4]]).sum() === [ 4, 6 ]

If callback is passed then will pass result as first argument.

    jStat( 1, 5, 5 ).sum(function( result ) {
        // result === 15
    });

If pass boolean true as first argument, then return sum of entire matrix.

    jStat([[1,2],[3,4]]).sum( true ) === 10

And the two can be combined.

    jStat[[1,2],[3,4]]).sum(true,function( result ) {
        // result === 10
    });

### sumsqrd()

**sumsqrd( array )**

Return the sum squared of a vector.

    jStat.sumsqrd([1,2,3]) === 14

**fn.sumsqrd( [bool][,callback] )**

Return the sum squared of a vector or matrix columns.

    jStat( 1, 5, 5 ).sumsqrd() === 55
    jStat([[1,2],[3,4]]).sumsqrd() === [ 10, 20 ]

If callback is passed then will pass result as first argument.

    jStat( 1, 5, 5 ).sumsqrd(function( result ) {
        // result === 55
    });

If pass boolean true as first argument, then return sum squared of entire matrix.

    jStat([[1,2],[3,4]]).sumsqrd( true ) === 650

And the two can be combined.

    jStat[[1,2],[3,4]]).sumsqrd(true,function( result ) {
        // result === 650
    });

### sumsqerr()

**sumsqerr( array )**

Return the sum of squared errors of prediction of a vector.

    jStat.sumsqerr([1,2,3]) === 2

**fn.sumsqerr( [bool][,callback] )**

Return the sum of squared errors of prediction of a vector or matrix columns.

    jStat( 1, 5, 5 ).sumsqerr() === 10
    jStat([[1,2],[3,4]]).sumsqerr() === [ 2, 2 ]

If callback is passed then will pass result as first argument.

    jStat( 1, 5, 5 ).sumsqerr(function( result ) {
        // result === 55
    });

If pass boolean true as first argument, then return sum of squared errors of entire matrix.

    jStat([[1,2],[3,4]]).sumsqerr( true ) === 0

And the two can be combined.

    jStat[[1,2],[3,4]]).sumsqerr(true,function( result ) {
        // result === 0
    });

### product()

**product( array )**

Return the product of a vector.

    jStat.product([1,2,3]) === 6

**fn.product( [bool][,callback] )**

Return the product of a vector or matrix columns.

    jStat( 1, 5, 5 ).product() === 120
    jStat([[1,2],[3,4]]).product() === [ 3, 8 ]

If callback is passed then will pass result as first argument.

    jStat( 1, 5, 5 ).product(function( result ) {
        // result === 120
    });

If pass boolean true as first argument, then return sumsqerr of entire matrix.

    jStat([[1,2],[3,4]]).product( true ) === 24

And the two can be combined.

    jStat[[1,2],[3,4]]).product(true,function( result ) {
        // result === 24
    });

### min()

**min( array )**

Return the minimum value of a vector.

    jStat.min([1,2,3]) === 1

**fn.min( [bool][,callback] )**

Return the minimum value of a vector or matrix columns.

    jStat( 1, 5, 5 ).min() === 1
    jStat([[1,2],[3,4]]).min() === [ 1, 2 ]

If callback is passed then will pass result as first argument.

    jStat( 1, 5, 5 ).min(function( result ) {
        // result === 1
    });

If pass boolean true as first argument, then return minimum of entire matrix.

    jStat([[1,2],[3,4]]).min( true ) === 1

And the two can be combined.

    jStat[[1,2],[3,4]]).min(true,function( result ) {
        // result === 1
    });

### max()

**max( array )**

Return the maximum value of a vector.

    jStat.max([1,2,3]) === 3

**fn.max( [bool][,callback] )**

Return the maximum value of a vector or matrix columns.

    jStat( 1, 5, 5 ).max() === 5
    jStat([[1,2],[3,4]]).max() === [ 3, 4 ]

If callback is passed then will pass result as first argument.

    jStat( 1, 5, 5 ).max(function( result ) {
        // result === 5
    });

If pass boolean true as first argument, then return maximum of entire matrix.

    jStat([[1,2],[3,4]]).max( true ) === 4

And the two can be combined.

    jStat[[1,2],[3,4]]).max(true,function( result ) {
        // result === 4
    });

### mean()

**mean( array )**

Return the mean of a vector.

    jStat.mean([1,2,3]) === 2

**fn.max( [bool,][callback] )**

Return the mean of a vector or matrix columns.

    jStat( 1, 5, 5 ).mean() === 3
    jStat([[1,2],[3,4]]).mean() === [ 2, 3 ]

If callback is passed then will pass result as first argument.

    jStat( 1, 5, 5 ).mean(function( result ) {
        // result === 3
    });

If pass boolean true as first argument, then return mean of entire matrix.

    jStat([[1,2],[3,4]]).mean( true ) === 2.5

And the two can be combined.

    jStat[[1,2],[3,4]]).mean(true,function( result ) {
        // result === 2.5
    });

### meansqerr()

**meansqerr( array )**

Return the mean squared error of a vector.

    jStat.meansqerr([1,2,3]) === 0.66666...

**fn.meansqerr( [bool][,callback] )**

Return the mean squared error of a vector or matrix columns.

    jStat( 1, 5, 5 ).meansqerr() === 2
    jStat([[1,2],[3,4]]).meansqerr() === [ 1, 1 ]

If callback is passed then will pass result as first argument.

    jStat( 1, 5, 5 ).meansqerr(function( result ) {
        // result === 2
    });

If pass boolean true as first argument, then return mean squared error of entire matrix.

    jStat([[1,2],[3,4]]).meansqerr( true ) === 0

And the two can be combined.

    jStat[[1,2],[3,4]]).meansqerr(true,function( result ) {
        // result === 0
    });

### geomean()

**geomean( array )**

Return the geometric mean of a vector.

    jStat.geomean([4,1,1/32]) === 0.5

**fn.geomean( [bool][,callback] )**

Return the geometric mean of a vector or matrix columns.

    jStat([4,1,1\32]).geomean() === 0.5
    jStat([[1,2],[3,4]]).geomean() === [ 1.732..., 2.828... ]

If callback is passed then will pass result as first argument.

    jStat([4,1,1\32]).geomean(function( result ) {
        // result === 0.5
    });

If pass boolean true as first argument, then return geometric mean of entire matrix.

    jStat([[1,2],[3,4]]).geomean( true ) === 2.213...

And the two can be combined.

    jStat[[1,2],[3,4]]).geomean(true,function( result ) {
        // result === 2.213...
    });

### median()

**median( array )**

Return the median of a vector.

    jStat.median([1,2,3]) === 2

**fn.median( [bool][,callback] )**

Return the median of a vector or matrix columns.

    jStat( 1, 5, 5 ).median() === 3
    jStat([[1,2],[3,4]]).median() === [ 2, 3 ]

If callback is passed then will pass result as first argument.

    jStat( 1, 5, 5 ).median(function( result ) {
        // result === 3
    });

If pass boolean true as first argument, then return median of entire matrix.

    jStat([[1,2],[3,4]]).median( true ) === 2.5

And the two can be combined.

    jStat[[1,2],[3,4]]).median(true,function( result ) {
        // result === 2.5
    });

### cumsum()

**cumsum( array )**

Return an array of partial sums in the sequence.

    jStat.cumsum([1,2,3]) === [1,3,6]

**fn.cumsum( [bool][,callback] )**

Return an array of partial sums for a vector or matrix columns.

    jStat( 1, 5, 5 ).cumsum() === [1,3,6,10,15]
    jStat([[1,2],[3,4]]).cumsum() === [[1,4],[2,6]]

If callback is passed then will pass result as first argument.

    jStat( 1, 5, 5 ).cumsum(function( result ) {
        // result === [1,3,6,10,15]
    });

If pass boolean true as first argument, then return cumulative sums of the matrix.

    jStat([[1,2],[3,4]]).cumsum( true ) === [[1,3],[3,7]]

And the two can be combined.

    jStat([[1,2],[3,4]]).cumsum(true,function( result ) {
        // result === ...
    });

### diff()

**diff( array )**

Return an array of the successive differences of the array.

    jStat.diff([1,2,2,3]) === [1,0,1]

**fn.diff( [bool][,callback] )**

Return an array of successive differences for a vector or matrix columns.

    jStat([1,2,2,3]).diff() === [1,0,1]
    jStat([[1,2],[3,4],[1,4]]).diff() === [[2,-2],[2,0]]

If callback is passed then will pass result as first argument.

    jStat([[1,2],[3,4],[1,4]]).diff(function( result ) {
        // result === [[2,-2],[2,0]]
    });

If pass boolean true as first argument, then return successive difference for the whole matrix.

    jStat([[1,2],[3,4],[1,4]]).diff(true) === [0,2]

And the two can be combined.

    jStat([[1,2],[3,4],[1,4]]).diff(true,function( result ) {
        // result === [0,2]
    });

### mode()

**mode( array )**

Return the mode of a vector.
If there are multiple modes then `mode()` will return all of them.

    jStat.mode([1,2,2,3]) === 2
    jStat.mode([1,2,3]) === [1,2,3]

**fn.mode( [bool][,callback] )**

Return the mode for a vector or matrix columns.

    jStat([1,2,2,3]).mode() === 2
    jStat([[1,2],[3,4],[1,4]]).mode() === [1,4]

If callback is passed then will pass result as first argument.

    jStat( 1, 5, 5 ).mode(function( result ) {
        // result === false
    });

If pass boolean true as first argument, then return mode of the matrix.

    jStat([[1,2],[1,2]]).mode( true ) === [[1,2],[1,2]]

And the two can be combined.

    jStat[[1,2],[1,2]]).mode(true,function( result ) {
        // result === false
    });

### range()

**range( array )**

Return the range of a vector

    jStat.range([1,2,3]) === 2

**fn.range( [bool][,callback] )**

Return the range for a vector or matrix columns.

    jStat([1,2,3]).range() === 2
    jStat([[1,2],[3,4]]).range() === [2,2]

If callback is passed then will pass result as first argument.

    jStat( 1, 5, 5 ).range(function( result ) {
        // result === 4
    });

If pass boolean true as first argument, then return range of the matrix.

    jStat([[1,2],[3,5]]).range( true ) === true

And the two can be combined.

    jStat[[1,2],[3,5]]).range(true,function( result ) {
        // result === 1
    });

### variance()

**variance( array[,flag])**

Return the variance of a vector.
By default, the sample variance is calculated.
Passing true as the flag indicates computes the population variance instead.

    jStat.variance([1,2,3,4]) === 1.25
    jStat.variance([1,2,3,4],true) === 1.66666...

**fn.variance( [bool][,callback] )**

Return the variance for a vector or matrix columns.

**Note:** Cannot pass flag to indicate between population or sample for matrices.
There is a feature request for this on [Issue #51](https://github.com/jstat/jstat/issues/51).

    jStat([1,2,3,4]).variance() === 1.25
    jStat([[1,2],[3,4]]).variance() === [1,1]

If callback is passed then will pass result as first argument.

    jStat( 1, 5, 5 ).variance(function( result ) {
        // result === 2
    });

If pass boolean true as first argument, then return variance of the matrix.

    jStat([[1,2],[3,5]]).variance( true ) === 0.140625

And the two can be combined.

    jStat[[1,2],[3,5]]).variance(true,function( result ) {
        // result === 0.140625
    });

### stdev()

**stdev( array[,flag])**

Return the standard deviation of a vector.
By defaut, the sample standard deviation is returned.
Passing true for the flag parameter returns the population standard deviation.

The 'sample' standard deviation is also called the 'corrected standard deviation', and is an unbiased estimator of the population standard deviation.
The population standard deviation is also the 'uncorrected standard deviation', and is a biased but minimum-mean-squared-error estimator.

    jStat.stdev([1,2,3,4]) === 1.118...
    jStat.stdev([1,2,3,4],true) === 1.290...

**fn.stdev( [bool][,callback] )**

Return the standard deviation for a vector or matrix columns.

**Note:** Cannot pass flag to indicate between population or sample for matrices.
There is a feature request for this on [Issue #51](https://github.com/jstat/jstat/issues/51).

    jStat([1,2,3,4]).stdev() === 1.118...
    jStat([1,2,3,4]).stdev(true) === 1.290...
    jStat([[1,2],[3,4]]).stdev() === [1,1]

If callback is passed then will pass result as first argument.

    jStat( 1, 4, 4 ).stdev(function( result ) {
        // result === 1.118...
    });
    jStat( 1, 4, 4 ).stdev(true,function( result ) {
        // result === 1.290...
    });

If pass boolean true as first argument, then return variance of the matrix.

    jStat([[1,2],[3,5]]).stdev( true ) === 0.25

And the two can be combined.

    jStat[[1,2],[3,5]]).stdev(true,function( result ) {
        // result === 0.25
    });

### meandev()

**meandev( array )**

Return the mean absolute deviation of a vector.

    jStat.meandev([1,2,3,4]) === 1

**fn.meandev( [bool][,callback] )**

Return the mean absolute deviation for a vector or matrix columns.

    jStat([1,2,3,4]).meandev() === 1
    jStat([[1,2],[3,4]]).meandev() === [1,1]

If callback is passed then will pass result as first argument.

    jStat( 1, 4, 4 ).meandev(function( result ) {
        // result === 1
    });

If pass boolean true as first argument, then return mean absolute deviation of the matrix.

    jStat([[1,2],[3,5]]).meandev( true ) === 0.25

And the two can be combined.

    jStat[[1,2],[3,5]]).meandev(true,function( result ) {
        // result === 0.25
    });

### meddev()

**meddev( array )**

Return the median absolute deviation of a vector.

    jStat.meddev([1,2,3,4]) === 1

**fn.meddev( [bool][,callback] )**

Return the median absolute deviation for a vector or matrix columns.

    jStat([1,2,3,4]).meddev() === 1
    jStat([[1,2],[3,4]]).meddev() === [1,1]

If callback is passed then will pass result as first argument.

    jStat( 1, 4, 4 ).meddev(function( result ) {
        // result === 1
    });

If pass boolean true as first argument, then return median absolute deviation of the matrix.

    jStat([[1,2],[3,5]]).meddev( true ) === 0.25

And the two can be combined.

    jStat[[1,2],[3,5]]).meddev(true,function( result ) {
        // result === 0.25
    });

### coeffvar()

**coeffvar( array )**

Return the coefficient of variation of a vector.

    jStat.coeffvar([1,2,3,4]) === 0.447...

**fn.coeffvar( [bool][,callback] )**

Return the coefficient of variation for a vector or matrix columns.

    jStat([1,2,3,4]).coeffvar() === 0.447...
    jStat([[1,2],[3,4]]).coeffvar() === [0.5,0.333...]

If callback is passed then will pass result as first argument.

    jStat( 1, 4, 4 ).coeffvar(function( result ) {
        // result === 0.447...
    });

If pass boolean true as first argument, then return coefficient of variation of the matrix.

    jStat([[1,2],[3,5]]).coeffvar( true ) === 0.142...

And the two can be combined.

    jStat[[1,2],[3,5]]).coeffvar(true,function( result ) {
        // result === 0.142...
    });

### quartiles()

**quartiles( array )**

Return the quartiles of a vector.

    jStat.quartiles( jStat.seq(1,100,100)) === [25,50,75]

**fn.quartiles( [callback] )**

Return the quartiles for a vector or matrix columns.

    jStat(1,100,100).quartiles() === [25,50,75]
    jStat(1,100,100,function( x ) {
        return [x,x];
    }).quartiles() === [[25,50,75],[25,50,75]]

If callback is passed then will pass result as first argument.

    jStat(1,100,100).quartiles(function( result ) {
        // result === [25,50,75]
    });

### quantiles()

**quantiles( dataArray, quantilesArray, [alphap[, betap]] )**

Like quartiles, but calculate and return arbitrary quantiles of a vector
or matrix (column-by-column).

    jStat.quantiles([1, 2, 3, 4, 5, 6],
                    [0.25, 0.5, 0.75]) === [1.9375, 3.5, 5.0625]

Optional parameters alphap and betap govern the quantile estimation method.
For more details see the Wikipedia page on quantiles or scipy.stats.mstats.mquantiles
documentation.

### percentileOfScore()

**percentileOfScore( dataArray, score[, kind] )**

The percentile rank of score in a given array. Returns the percentage
of all values in the input array that are less than (if `kind == 'strict'`) or
less or equal than (if `kind == 'weak'`) score. Default is `'weak'`.

     jStat.percentileOfScore([1, 2, 3, 4, 5, 6], 3), 0.5, 'weak') === 0.5;

### covariance()

**covariance( array, array )**

Return the covariance of two vectors.

    var seq = jStat.seq( 0, 10, 11 );
    jStat.covariance( seq, seq ) === 11;

### corrcoeff()

**corrcoeff( array, array )**

Return the population correlation coefficient of two vectors (Pearson's Rho).

    var seq = jStat.seq( 0, 10, 11 );
    jStat.corrcoeff( seq, seq ) === 1;
