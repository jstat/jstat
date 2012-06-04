## Core Functionality

Core functionality include methods that generate and analyse vectors or matrices.

### jStat()

The jStat object can function in several capacities, as demonstrated below.
In all cases, jStat will always return an instance of itself.

**jStat( array[, fn] )**

Create a new jStat object from either an existing array or jStat object.
For example, create a new jStat matrix by doing the following:

    var matrix = jStat([[ 1, 2, 3 ],[ 4, 5, 6 ],[ 7, 8, 9 ]]);

If an existing jStat object is passed as an argument then it will be cloned into a new object:

    var stat1 = jStat([[ 1, 2 ],[ 3, 4 ]]),
        stat2 = jStat( stat1 );


To transform the data on creation, pass a function as the final argument:

    jStat([[ 1, 2 ],[ 3, 4 ]], function( x ) {
        return x * 2;
    });

**jStat( start, stop, count[, fn ])**

To create a sequence then pass numeric values in the same form `jStat.seq()` would be used:

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

**jStat()**

A chainable shortcut in the API exists to allow for filling in the data after object creation.
So creating `jStat` objects from methods like `rand()` can be accomplished in one of the following ways:

    // pass the generated random 3x3 matrix to jStat
    jStat( jStat.rand( 3 ));
    // or create an empty instance that is filled in afterwards
    jStat().rand( 3 );


### rows()

Returns the count of rows in a matrix.

**rows( array )**

    var matrix = [[1,2,3],[4,5,6]];
    jStat.rows( matrix ) === 2;

**fn.rows( [callback] )**

    jStat( matrix ).rows() === 2;

Or pass a callback to run the calculation asynchronously and pass on the calculation.
This allows for continued chaining of methods to the jStat object.

    jStat( matrix ).rows(function( d ) {
        // d === 2
    });

### cols()

Returns the number of columns in a matrix.

**cols( array )**

    var matrix = [[1,2,3],[4,5,6]];
    jStat.cols( matrix ) === 3;

**fn.cols( [callback] )**

    jStat( matrix ).cols() === 3;

Or pass a callback to run the calculation asynchronously and pass on the calculation.
This allows for continued chaining of methods to the jStat object.

    jStat( matrix ).cols(function( d ) {
        // d === 3
    });

### dimensions()

Returns and object with the dimensions of a matrix.

**dimensions( array )**

    var matrix = [[1,2,3],[4,5,6]];
    jStat.dimensions( matrix ) === { cols: 3, rows: 2 };

**fn.dimensions( [callback] )**

    jStat( matrix ).dimensions() === { cols: 3, rows: 2 };

Or pass a callback to run the calculation asynchronously and pass on the calculation.
This allows for continued chaining of methods to the jStat object.

    jStat( matrix ).dimensions(function( d ) {
        // d === { cols: 3, rows: 2 }
    });

### row()

Returns a specified row of an array or jStat object as a vector.

    var matrix = [[1,2,3],[4,5,6]];
    jStat( matrix ).row( 0 ) === jStat([1,2,3]);
    jStat.row( matrix, 0 ) === [1,2,3];


### col( index )

Returns the specified column as a column vector.

    var matrix = [[1,2],[3,4]];
    jStat( matrix ).col( 0 ) === jStat([[1],[3]]);
    jStat.col( matrix, 0 ) === [[1],[3]];

### diag()

Returns the diagonal of the matrix.

    var matrix = [[1,2,3],[4,5,6],[7,8,9]];
    jStat( matrix ).diag() === jStat([[1],[5],[9]]);
    jStat.diag( matrix ) === [[1],[5],[9]];

### antidiag()

Returns the anti-diagonal of the matrix.

    var matrix = [[1,2,3],[4,5,6],[7,8,9]];
    jStat( matrix ).antidiag() === jStat([[3],[5],[7]]);
    jStat.antidiag( matrix ) === [[3],[5],[7]];

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

## jStat Utility Methods

Utilities that are used throughout the jStat library

### utils.calcRdx( num0, num1 )

Calculate the decimal shift for the IEEE calculation correction.

### utils.isArray( arg )

### utils.isFunction( arg )
