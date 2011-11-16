## Core Instance Functionality

### jStat( [array][start, stop, count[, func]] )

Create a new jStat object from either an existing array, or pass in values to generate a sequence.
For example, create a new jStat matrix by doing the following:

    var matrix = jStat([[ 1, 2, 3 ],[ 4, 5, 6 ],[ 7, 8, 9 ]]);

Or create a vector from a sequence:

    var vector = jStat( 0, 1, 5 );
    // vector === [[ 0, 0.25, 0.5, 0.75, 1 ]]

By passing a function the sequence value can be manipulated:

    var vector = jStat( 0, 1, 5, function( x ) {
        return x * 2;
    });
    // vector === [[ 0, 0.5, 1, 1.5, 2 ]];

### rows()

Returns the number of rows in the jStat object.

    jStat([[1,2,3],[4,5,6]]).rows() === 2;

### cols()

Returns the number of columns in the jStat object.

    jStat([[1,2,3],[4,5,6]]).cols() === 3;

### dimensions()

Returns and object with the dimensions of the jStat object.

    jStat([[1,2,3],[4,5,6]]).dimensions() === { cols: 3, rows: 2 };

### row( index )

Returns a specified row as a vector.

    jStat([[1,2,3],[4,5,6]]).row( 0 ) === [[1,2,3]];

### col( index )

Returns the specified column as a column vector.

    jStat([1,2,3],[4,5,6]]).col( 0 ) === [[1],[4]];

### diag()

Returns the diagonal of the matrix.

    jStat([[1,2,3],[4,5,6],[7,8,9]]).diag() === [[1],[5],[9]];

### antidiag()

Returns the anti-diagonal of the matrix.

    jStat([[1,2,3],[4,5,6],[7,8,9]]).antidiag() === [[3],[5],[7]];

### transpose( [callback] )

Transpose a matrix.

    jStat([[1,2],[3,4]]).transpose() === [[1,3],[2,4]];

### map( func )

Map a function to all values and return a new object.

    var matrix = jStat([[1,2],[3,4]]),
        mapped = matrix.map( function( x ) {
            return x * 2;
        });
    // matrix === [[1,2],[3,4]]
    // mapped === [[2,4],[6,8]]

### alter( func )

Destructively alter an object.

    var matrix = jStat([[1,2],[3,4]]);
    matrix.alter( function( x ) {
        return x * 2;
    });
    // matrix === [[2,4],[6,8]]

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

### jStat.create( rows[,cols], func )

Generate a rows x cols matrix according to the supplied function.

### jStat.zeros( rows[,cols] )

Generate a rows x cols matrix of zeros.

### jStat.ones( rows[,cols] )

Generate a rows x cols matrix of ones.

### jStat.rand( rows[,cols] )

Generate a rows x cols matrix of uniformly random numbers.

### jStat.identity( rows[,cols] )

Generate an identity matrix of size row x cols.

### jStat.seq( min, max, length[,func] )

Generate an array sequence.

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

## jStat Utility Methods

### jStat.utils.calcRdx( num0, num1 )

Calculate the decimal shift for the IEEE calculation correction.

### jStat.utils.isArray( arg )

### jStat.utils.isFunction( arg )
