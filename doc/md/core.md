## Core Instance Functionality

Core functionality include methods that generate/alter/analyse vectors or matrices.
Also includes several utilty methods that are used throughout the library.

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

The second argument passed to the function is the count (starting from 0).
Using this we can create a multidimensional array (useful for plotting data):

    var betaGraph = jStat( 0, 1, 11, function( x, cnt ) {
        return [ jStat.beta.pdf( x, alpha, beta ), cnt ];
    });

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

## jStat Utility Methods

### jStat.utils.calcRdx( num0, num1 )

Calculate the decimal shift for the IEEE calculation correction.

### jStat.utils.isArray( arg )

### jStat.utils.isFunction( arg )
