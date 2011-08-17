## Core Functionality

### jStat( [array][start, stop, count[, func]] )

Create a new jStat object from either an existing array, or pass in values to generate a sequence.

### rows()

Returns the number of rows in the jStat object.

### cols()

Returns the number of columns in the jStat object.

### dimensions()

Returns and object with the dimensions of the jStat object.

### row( index )

Returns a specified row as a vector.

### col( index )

Returns the specified column as a vector.

### diag()

Returns the diagonal of the matrix.

### antidiag()

Returns the anti-diagonal of the matrix.

### transpose( arr )

Transpose a Vector or Matrix.

### map( func )

Map a function to all values and return a new object.

### alter( func )

Destructively alter an object.

### add( arg [,callback] )

Add value to all entries.

### divide( arg [,callback] )

Divide all entries by value.

### multiply( arg [,callback] )

Multiply all entries by value.

### subtract( arg [,callback] )

Subtract all entries by value.

### dot( arg [,callback] )

Take dot product.

### pow( arg [,callback] )

Raise all entries by value.

### abs()

Return the absolute values of all entries.

### clear()

Set all values to 0.

### norm()

Compulte the norm of a vector.

### angle( arg )

Compute the angle between two vectors.

### symmetric()

Tests if a matrix is symmetric.

### sum( [bool,][callback] )

Return the sum of a Vector, or of Matrix columns.
If pass boolean true as first argument, then return sum of entire Matrix.

### min( [bool,][callback] )

Return the minimum value of a Vector, or of Matrix columns.
If pass boolean true as first argument, then return min of entire Matrix.

### max( [bool,][callback] )

Return the maximum value of a Vector, or of Matrix columns.
If pass boolean true as first argument, then return max of entire Matrix.

### mean( [bool,][callback] )

Return the mean value of a Vector, or of Matrix columns.
If pass boolean true as first argument, then return mean of entire Matrix.

### median( [bool,][callback] )

Return the median value of a Vector, or of Matrix columns.
If pass boolean true as first argument, then return median of entire Matrix.

### mode( [bool,][callback] )

Return the mode of a Vector, or of Matrix columns.
If pass boolean true as first argument, then return mode of entire Matrix.

### range( [bool,][callback] )

Return the mode of a Vector, or of Matrix columns.
If pass boolean true as first argument, then return range of entire Matrix.

### variance( [bool,][callback] )

Return the variance of a Vector, or of Matrix columns.
If pass boolean true as first argument, then return variance of entire Matrix.

### stdev( [bool,][callback] )

Return the standard deviation of a Vector, or of Matrix columns.
If pass boolean true as first argument, then return standard deviation of entire Matrix.

### meandev( [callback] )

Return the mean deviation of a Vector, or of Matrix columns.
If pass boolean true as first argument, then return mean deviation of entire Matrix.

### meddev( [callback] )

Return the median deviation of a Vector, or of Matrix columns.
If pass boolean true as first argument, then return median deviation of entire Matrix.

### quartiles( [callback] )

Return the quartiles of a Vector, or of Matrix columns.
If pass boolean true as first argument, then return quartiles of entire Matrix.

### jStat.create( rows, cols, func )

Generate a rows x cols matrix according to the supplied function.

### jStat.zeros( rows, cols )

Generate a rows x cols matrix of zeros.

### jStat.ones( rows, cols )

Generate a rows x cols matrix of ones.

### jStat.rand( rows, cols )

Generate a rows x cols matrix of uniformly random numbers.

### jStat.identity( rows, cols )

Generate an identity matrix of size row x cols.

### jStat.seq( min, max, length [,func] )

Generate a vector sequence.

### jStat.transpose( arr )

### jStat.map( arr, func )

### jStat.alter( arr, func )

### jStat.add( arr, arg )

### jStat.divide( arr, arg )

### jStat.multiply( arr, arg )

### jStat.subtract( arr, arg )

### jStat.dot( arr, arg )

### jStat.pow( arr, arg )

### jStat.abs( arr )

### jStat.clear( arr )

### jStat.norm( arr )

### jStat.angle( arr, arg )

### jStat.symmetric( arr )

### jStat.sum( arr )

### jStat.min( arr )

### jStat.max( arr )

### jStat.mean( arr )

### jStat.median( arr )

### jStat.mode( arr )

### jStat.range( arr )

### jStat.variance( arr )

### jStat.stdev( arr )

### jStat.meandev( arr )

### jStat.meddev( arr )

### jStat.quartiles( arr )

### jStat.covariance( arr1, arr2 )

### jStat.corrcoeff( arr1, arr2 )
