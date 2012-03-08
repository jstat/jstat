## Vector Instance Functionality

### add( arg )

Add value to all entries.

    jStat([[1,2,3]]).add( 2 ) === [[3,4,5]];

### subtract( arg )

Subtract all entries by value.

    jStat([[4,5,6]]).subtract( 2 ) === [[2,3,4]];

### divide( arg )

Divide all entries by value.

    jStat([[2,4,6]]).divide( 2 ) === [[1,2,3]];

### multiply( arg )

Multiply all entries by value.

    jStat([[1,2,3]]).multiply( 2 ) === [[2,4,6]];

### dot( arg )

Take dot product.

### pow( arg )

Raise all entries by value.

    jStat([[1,2,3]]).pow( 2 ) === [[1,4,9]];

### abs()

Return the absolute values of all entries.

    jStat([[1,-2,-3]]).abs() === [[1,2,3]];

### clear()

Set all values to 0. This is destructive.

### norm()

Compulte the norm of a vector.

### angle( arg )

Compute the angle between two vectors.

### symmetric()

Tests if a matrix is symmetric.

    jStat([[1,2],[2,1]]).symmetric() === true

### sum( [[bool][,callback]][callback] )

Return the sum of a vector, or of matrix columns.
If pass boolean true as first argument, then return sum of entire object.

### sumsqrd( [[bool][,callback]][callback] )

Return the sum sqared of a vector, or of matrix columns.
If pass boolean true as first argument, then return sum of entire object.

### sumsqerr( [[bool][,callback]][callback] )

Return the sum sqared error of a vector, or of matrix columns.
If pass boolean true as first argument, then return sum of entire object.

### product( [[bool][,callback]][callback] )

Return the product of a vector, or of matrix columns.
If pass boolean true as first argument, then return product of entire object.

### min( [[bool][,callback]][callback] )

Return the minimum value of a vector, or of matrix columns.
If pass boolean true as first argument, then return min of entire object.

### max( [[bool][,callback]][callback] )

Return the maximum value of a vector, or of matrix columns.
If pass boolean true as first argument, then return max of entire object.

### mean( [[bool][,callback]][callback] )

Return the mean value of a vector, or of matrix columns.
If pass boolean true as first argument, then return mean of entire object.

### meansqerr( [[bool][,callback]][callback] )

Return the mean square erro value of a vector, or of matrix columns.
If pass boolean true as first argument, then return mean of entire object.

### geomean( [[bool][,callback]][callback] )

Return the geometric mean of a vector, or of matrix columns.
If pass boolean true as first argument, then return mean of entire object.

### median( [[bool][,callback]][callback] )

Return the median value of a vector, or of matrix columns.
If pass boolean true as first argument, then return median of entire object.

### mode( [[bool][,callback]][callback] )

Return the mode of a vector, or of matrix columns.
If pass boolean true as first argument, then return mode of entire object.

### range( [[bool][,callback]][callback] )

Return the mode of a vector, or of matrix columns.
If pass boolean true as first argument, then return range of entire object.

### variance( [[bool][,callback]][callback] )

Return the variance of a vector, or of matrix columns.
If pass boolean true as first argument, then return variance of entire object.

### stdev( [[bool][,callback]][callback] )

Return the standard deviation of a vector, or of matrix columns.
If pass boolean true as first argument, then return standard deviation of entire object.

### meandev( [callback] )

Return the mean deviation of a vector, or of matrix columns.
If pass boolean true as first argument, then return mean deviation of entire object.

### meddev( [callback] )

Return the median deviation of a vector, or of matrix columns.
If pass boolean true as first argument, then return median deviation of entire object.

### quartiles( [callback] )

Return the quartiles of a vector, or of matrix columns.
If pass boolean true as first argument, then return quartiles of entire object.

## Core Static Functionality

### jStat.add( arr, arg )

### jStat.divide( arr, arg )

### jStat.multiply( arr, arg )

### jStat.subtract( arr, arg )

### jStat.dot( arr, arg )

### jStat.pow( arr, arg )

### jStat.abs( arr )

### jStat.clear( arr )

### jStat.norm( arr[,p] )

Calculate the p-norm of a vector. `p` will default to 2 if unspecified.

### jStat.angle( arr, arg )

### jStat.symmetric( arr )

### jStat.sum( arr )

### jStat.min( arr )

### jStat.max( arr )

### jStat.mean( arr )

### jStat.median( arr )

### jStat.mode( arr )

### jStat.range( arr )

### jStat.variance( arr[, flag] )

Population variance of an array. If `flag == true` then will calculate the sample variance.

### jStat.stdev( arr[, flag] )

Population standard deviation of an array. If `flag == true` then will calculate the sample standard deviation.

### jStat.meandev( arr )

### jStat.meddev( arr )

### jStat.quartiles( arr )

### jStat.covariance( arr1, arr2 )

### jStat.corrcoeff( arr1, arr2 )
