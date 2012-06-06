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

Adds arg to all of the elements in the array 

### jStat.divide( arr, arg )

Divides each element of the array by arg. 

### jStat.multiply( arr, arg )

Multiplies each element of the array by arg.

### jStat.subtract( arr, arg )

Subtracts each element of the array by arg.

### jStat.dot( arr, arg )

Returns the dot product of the two arguments

### jStat.pow( arr, arg )

Raises every element by a scaler power.

### jStat.abs( arr )

Returns the absolute value of the vector

### jStat.clear( arr )

Sets all values of the array to 0

### jStat.norm( arr[,p] )

Calculate the p-norm of a vector. `p` will default to 2 if unspecified.

### jStat.angle( arr, arg )

Computes the angle between two vectors

### jStat.symmetric( arr )

Returns a boolean where true denotes the matrix is symmetric

### jStat.sum( arr )

Returns the sum of all of the elements of the array.

### jStat.diff( arr )

Returns a value that is calculated by taking the successive differences of the array.

### jStat.sumsqrd( arr )

Returns the sum of each element squared in the vector (Sums x^2 for each x in the vector).

### jStat.sumsqerr( arr )

Returns the sum squared error (SSE) (Sums (x-m)^2 for each x in the vector where m is the mean of the vector).

### jStat.product( arr )

Returns the product of the array (Multiplies all of the elements together).

### jStat.min( arr )

Returns the minimum value of the array.

### jStat.max( arr )

Returns the maximum value of the array.

### jStat.mean( arr )

Returns the mean value of the array.

### jStat.median( arr )

Returns the median value of the array.

### jStat.mode( arr )

Returns the mode of the array.

### jStat.meansqerr( arr )

Returns the mean squared error of the array.

### jStat.geomean( arr )

Returns the geometric mean of the array.

### jStat.range( arr )

Returns an array with the minimum and maximum values of the array.

### jStat.variance( arr[, flag] )

Population variance of an array. If `flag == true` then will calculate the sample variance.

### jStat.stdev( arr[, flag] )

Population standard deviation of an array. If `flag == true` then will calculate the sample standard deviation.

### jStat.meandev( arr )

Returns the mean absolute deviation of the array.

### jStat.meddev( arr )

Returns the median absolute deviation of the array.

### jStat.quartiles( arr )

Returns the quartiles of the array.

### jStat.covariance( arr1, arr2 )

Returns the covariance of the two arrays.

### jStat.corrcoeff( arr1, arr2 )

Returns the correlation coefficient of the two arrays.