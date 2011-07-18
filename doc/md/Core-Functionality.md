## Core Functionality

### jStat( [array][start, stop, count[, func]] )

Create a new jStat object from either an existing array, or pass in values to generate a sequence.

### .rows()

Returns the number of rows in the jStat object

### .cols()

Returns the number of columns in the jStat object

### .dimensions()

Returns and object with the dimensions of the jStat object

### .row( index )

Returns a specified row as a vector

### .col( index )

Returns the specified column as a vector

### .diag()

Returns the diagonal of the matrix

### .antidiag()

Returns the anti-diagonal of the matrix

### .map( func )

Map a function to a matrix or vector

### .alter( func )

Destructively alter an object

### .sum( [callback] )

### .min( [callback] )

### .max( [callback] )

### .mean( [callback] )

### .median( [callback] )

### .mode( [callback] )

### .range( [callback] )

### .variance( [callback] )

### .stdev( [callback] )

### .meandev( [callback] )

### .meddev( [callback] )

### .quartiles( [callback] )

### jStat.transpose( arr )

### jStat.map( arr, func, toAlter )

### jStat.alter( arr, func )

### jStat.create( rows, cols, func )

### jStat.zeros( rows, cols )

### jStat.ones( rows, cols )

### jStat.rand( rows, cols )

### jStat.identity( rows, cols )

### jStat.seq( min, max, length, func )

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
