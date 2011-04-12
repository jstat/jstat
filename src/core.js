/**
 * jStat - JavaScript Statistical Library
 * Copyright (c) 2011
 * This document is licensed as free software under the terms of the
 * MIT License: http://www.opensource.org/licenses/mit-license.php */
this.j$ = this.jStat = (function( Math, undefined ) {

// global function
var jStat = function() {
		return new jStat.fn.init( slice.call( arguments ));
	},

	// for quick reference
	slice = Array.prototype.slice,
	toString = Object.prototype.toString,

	// for code compression
	length = 'length',

	// ascending/descending functions for sort
	ascNum = function( a, b ) { return a - b; },
	descNum = function( a, b ) { return b - a; },

	// test if array
	isArray = function( arg ) {
		return toString.call( arg ) === "[object Array]";
	},

	// test if function
	isFunction = function( arg ) {
		return toString.call( arg ) === "[object Function]";
	},

	// test if object
	isObject = function( arg ) {
		return toString.call( arg ) === "[object Object]";
	};

jStat.fn = jStat.prototype = {
	constructor : jStat,
	init : function( args ) {

		// if first argument is an array, must be vector or matrix
		if ( isArray( args[0] )) {
			if ( isArray( args[0][0] )) {
				for ( var i = 0; i < args[0][length]; i++ ) {
					this.push( args[0][i] );
				}
			} else {
				this.push( args[0] );
			}

		// if first argument is number, assume creation of sequence
		} else if ( !isNaN( args[0] )) {
			this.push( jStat.seq.apply( null, args )[0] );
		}
		return this;
	},

	// default length
	length : 0,

	// return clean array
	toArray : function() {
		return slice.call( this, 0 );
	},

	// only to be used internally
	push : Array.prototype.push,
	sort : [].sort,
	splice : [].splice
};
jStat.fn.init.prototype = jStat.fn;

// create method for easy extension
jStat.extend = function( obj ) {
	var args = slice.call( arguments ),
	i = 1, j;
	if ( args[length] === 1 ) {
		for ( i in obj ) {
			jStat[i] = obj[i];
		}
		return this;
	}
	for ( ; i < args[length]; i++ ) {
		for ( j in args[i] ) obj[j] = args[i][j];
	}
	return obj;
};

// extend jStat.fn with methods which don't require arguments and work on columns
(function( funcs ) {
	for ( var i = 0; i < funcs[length]; i++ ) (function( passfunc ) {

		// if a matrix is passed, automatically assume operation should be done on the columns
		jStat.fn[ passfunc ] = function( fullbool ) {
			var arr = [],
				i = 0,
				tmpthis;

			if ( this[length] > 1 ) {
				tmpthis = this.transpose();
				for ( ; i < tmpthis[length]; i++ ) {
					arr[i] = jStat[ passfunc ]( tmpthis[i] );
				}
				if ( fullbool === true ) {
					arr = jStat[ passfunc ]( arr );
				}
			}

			return arr[length] > 1 ? jStat( arr ) : jStat[ passfunc ]( this[0] );
		};
	})( funcs[i] );
})( 'sum min max mean median mode range variance stdev meandev meddev quartiles'.split( ' ' ));

// extend jStat.fn with methods that have no argument
(function( funcs ) {
	for ( var i = 0; i < funcs[length]; i++ ) (function( passfunc ) {
		jStat.fn[ passfunc ] = function() {
			var results = jStat[ passfunc ]( this );
			return isArray( results ) ? jStat( results ) : results;
		};
	})( funcs[i] );
})( 'transpose clear norm symmetric'.split( ' ' ));

// extend jStat.fn with methods that require one argument
(function( funcs ) {
	for ( var i = 0; i < funcs[length]; i++ ) (function( passfunc ) {
		jStat.fn[ passfunc ] = function( arg ) {
			return jStat( jStat[ passfunc ]( this, arg ));
		};
	})( funcs[i] );
})( 'add divide multiply subtract dot pow abs angle'.split( ' ' ));

// extend jStat.fn
jStat.extend( jStat.fn, {

	// Returns the number of rows in the matrix
	rows: function() {
		return this[length] || 1;
	},

	// Returns the number of columns in the matrix
	cols: function() {
		return this[0][length] || 1;
	},

	// Returns the dimensions of the object { rows: i, cols: j }
	dimensions : function() {
		return {
			rows : this.rows(),
			cols : this.cols()
		};
	},

	// Returns a specified row as a vector
	row: function( index ) {
	    return jStat( this[index] );
	},

	// Returns the specified column as a vector
	col: function( index ) {
	    var column = [],
			i = 0;
	    for ( ; i < this[length]; i++ ) {
			column[i] = [ this[i][index] ];
	    }
	    return jStat( column );
	},

	// Returns the diagonal of the matrix
	diag : function() {
		var row = 0,
			nrow = this.rows(),
			res = [];
		for( ; row < nrow; row++ ) {
			res[row] = [ this[row][row] ];
		}
		return jStat( res );
	},

	// Returns the anti-diagonal of the matrix
	antidiag : function() {
		var nrow = this.rows() - 1,
			res = [],
			i = 0;
		for( ; nrow >= 0; nrow--, i++ ) {
			res[i] = [ this[i][nrow] ];
		}
		return jStat( res );
	},

	// map a function to a matrix or vector
	map : function( func, toAlter ) {
		return jStat( jStat.map( this, func, toAlter ));
	},

	// destructively alter an object
	alter : function( func ) {
		jStat.alter( this, func );
		return this;
	}
});


// static methods //

jStat.extend({

	// transpose a matrix or array
	transpose : function( arr ) {
		arr = isArray( arr[0] ) ? arr : [ arr ];
		var rows = arr[length],
			cols = arr[0][length],
			obj = [],
			i = 0, j;
		for ( ; i < cols; i++ ) {
			obj[i] = [];
			for ( j = 0; j < rows; j++ ) {
				obj[i][j] = arr[j][i];
			}
		}
		return obj;
	},

	// map a function to a matrix or vector
	map : function( arr, func, toAlter ) {
		arr = isArray( arr[0] ) ? arr : [ arr ];
		var row = 0,
			nrow = arr[length],
			ncol = arr[0][length],
			res = toAlter ? arr : [],
			col;
		for ( ; row < nrow; row++ ) {
			res[row] = res[row] || [];
			for ( col = 0; col < ncol; col++ ) {
				res[row][col] = func( arr[row][col], row, col );
			}
		}
		return res;
	},

	// destructively alter an array
	alter : function( arr, func ) {
		return jStat.map( arr, func, true );
	},

	// generate a rows x cols matrix according to the supplied function
	create: function ( rows, cols, func ) {
		var i, j, res = [];
		for( i = 0; i < rows; i++ ) {
			res[i]  = [];
			for( j = 0; j < cols; j++ ) {
				res[i][j] = func( i, j );
			}
		}
		return res;
	},

	// generate a rows x cols matrix of zeros
	zeros : function( rows, cols ) {
		return jStat.create( rows, cols, function() { return 0; });
	},

	// generate a rows x cols matrix of ones
	ones: function( rows, cols ) {
		return jStat.create( rows, cols, function() { return 1; });
	},

	// generate a rows x cols matrix of uniformly random numbers
	rand: function( rows, cols ) {
		return jStat.create( rows, cols, function() { return Math.random(); });
	},

	// generate an identity matrix of size row x cols
	identity : function( rows, cols ) {
		return jStat.create( rows, cols, function( i, j ) { return ( i === j ) ? 1 : 0; });
	},

	// generate sequence
	seq : function( min, max, length, func ) {
		var arr = [],
			step = ( max - min ) / ( length - 1 );
		// TODO: replace toFixed value to user configurable parameter
		for ( ; min <= max; min += step ) arr.push(+( func ? func.call( null, min ) : min ).toFixed(6));
		return arr;
	},

	// add a vector or scalar to the vector
	add : function( arr, arg ) {
		return isNaN( arg )
			? jStat.map( arr, function( value, row, col ) { return value + arg[row][col]; })
		: jStat.map(arr, function ( value ) { return value + arg; });
	},

	// TODO: Implement matrix division
	// matrix division
	divide : function( arr, arg ) {
		return isNaN( arg )
			? false
		: jStat.map(arr, function ( value ) { return value / arg; });
	},

	// matrix multiplication
	multiply : function( arr, arg ) {
		var row, col, nrescols, sum,
			nrow = arr[length],
			ncol = arr[0][length],
			res = jStat.zeros( nrow, nrescols = ( isNaN( arg )) ? arg[0][length] : ncol ),
			rescols = 0;
		if( isNaN( arg )) {
			for( ; rescols < nrescols; rescols++ ) {
				for( row = 0; row < nrow; row++ ) {
					sum = 0;
					for( col = 0; col < ncol; col++ ) {
						sum += arr[row][col] * arg[col][rescols];
					}
					res[row][rescols] = sum;
				}
			}
			return ( nrow === 1 && rescols === 1 ) ? res[0][0] : res;
		}
		return jStat.map( arr, function( value ) { return value * arg; });
	},

	// subtract a vector or scalar from the vector
	subtract : function( arr, arg ) {
		return isNaN( arg )
			? jStat.map( arr, function( value, row, col ) { return value - arg[row][col]; })
		: jStat.map( arr, function( value ) { return value - arg; });
	},

	// Returns the dot product of two matricies
	dot : function( arr, arg ) {
		arr = isArray( arr[0] ) ? arr : [ arr ];
		arg = isArray( arg[0] ) ? arg : [ arg ];

		// convert column to row vector
		var left = ( arr[0][length] === 1 && arr[length] !== 1 ) ? jStat.transpose( arr ) : arr,
			right = ( arg[0][length] === 1 && arg[length] !== 1 ) ? jStat.transpose( arg ) : arg,
			res = [],
			row = 0,
			nrow = left[length],
			ncol = left[0][length],
			sum, col;
		for( ; row < nrow; row++ ) {
			res[row] = [];
			sum = 0;
			for( col = 0; col < ncol; col++ ) {
				sum += left[row][col] * right[row][col];
			}
			res[row] = sum;
		}
		return ( res[length] === 1 ) ? res[0] : res;
	},

	// raise every element by a scalar or vector
	pow : function( arr, arg ) {
		return jStat.map( arr, function( value ) { return Math.pow( value, arg ); });
	},

	// generate the absolute values of the vector
	abs : function( arr ) {
		return jStat.map( arr, function( value ) { return Math.abs( value ); });
	},

	// set all values to zero
	clear : function( arr ) {
		return jStat.alter( arr, function() { return 0; });
	},

	// BUG: Does not work for matrices
	// computes the norm of the vector
	norm : function( arr ) {
		arr = isArray( arr[0] ) ? arr : [ arr ];
		if( arr[length] > 1 && arr[0][length] > 1 ) {
			// matrix norm
		} else {
			// vector norm
			return Math.sqrt( jStat.dot( arr, arr ) );
		}
	},

	// BUG: Does not work for matrices
	// computes the angle between two vectors
	angle : function( arr, arg ) {
		 return Math.acos( jStat.dot( arr, arg ) / ( jStat.norm( arr ) * jStat.norm( arg )));
	},

	// Tests whether a matrix is symmetric
	symmetric : function( arr ) {
		var issymmetric = true,
			row = 0,
			size = arr[length], col;
		if( arr[length] !== arr[0][length] ) return false;
		for ( ; row < size; row++ ) {
			for ( col = 0; col < size; col++ ) {
				if ( arr[col][row] !== arr[row][col] ) return false;
			}
		}
		return true;
	},

	// array/vector specific functions //

	// sum of an array
	sum : function( arr ) {
		var sum = 0,
			i = arr[length];
		while( --i >= 0 ) {
			sum += arr[i];
		}
		return sum;
	},

	// minimum value of an array
	min : function( arr ) {
		return Math.min.apply( null, arr );
	},

	// maximum value of an array
	max : function( arr ) {
		return Math.max.apply( null, arr );
	},

	// mean value of an array
	mean : function( arr ) {
		return jStat.sum( arr ) / arr[length];
	},

	// median of an array
	median : function( arr ) {
		var arrlen = arr[length],
			_arr = arr.slice().sort( ascNum );

		// check if array is even or odd, then return the appropriate
		return !( arrlen & 1 ) ? ( _arr[ ( arrlen / 2 ) - 1 ] + _arr[ ( arrlen / 2 ) ] ) / 2 : _arr[ Math.floor( arrlen / 2 ) ];
	},

	// mode of an array
	mode : function( arr ) {
		var arrLen = arr[length],
			_arr = arr.slice().sort( ascNum ),
			count = 1,
			maxCount = 0,
			numMaxCount = 0,
			i = 0,
			maxNum;
		for ( ; i < arrLen; i++ ) {
			if ( _arr[ i ] === _arr[ i + 1 ] ) {
				count++;
			} else {
				if ( count > maxCount ) {
					maxNum = _arr[i];
					maxCount = count;
					count = 1;
					numMaxCount = 0;
				} else {

					// are there multiple max counts
					if ( count === maxCount ) {
						numMaxCount++;

					// count is less than max count, so reset values
					} else {
						count = 1;
					}
				}
			}
		}

		return ( numMaxCount === 0 ) ? maxNum : false;
	},

	// range of an array
	range : function( arr ) {
		var _arr = arr.slice().sort( ascNum );
		return _arr[ _arr[length] - 1 ] - _arr[0];
	},

	// variance of an array
	variance : function( arr ) {
		var mean = jStat.mean( arr ),
			stSum = 0,
			i = arr[length] - 1;
		for( ; i >= 0; i-- ) {
			stSum += Math.pow(( arr[i] - mean ), 2 );
		}
		return stSum / ( arr[length] - 1 );
	},

	// standard deviation of an array
	stdev : function( arr ) {
		return Math.sqrt( jStat.variance( arr ));
	},

	// mean deviation (mean absolute deviation) of an array
	meandev : function( arr ) {
		var devSum = 0,
			mean = jStat.mean( arr ),
			i = arr[length] - 1;
		for ( ; i >= 0; i-- ) {
			devSum += Math.abs( arr[ i ] - mean );
		}
		return devSum / arr[length];
	},

	// median deviation (median absolute deviation) of an array
	meddev : function( arr ) {
		var devSum = 0,
			median = jStat.median( arr ),
			i = arr[length] - 1;
		for ( ; i >= 0; i-- ) {
			devSum += Math.abs( arr[ i ] - median );
		}
		return devSum / arr[length];
	},

	// quartiles of an array
	quartiles : function( arr ) {
		var arrlen = arr[length],
			_arr = arr.slice().sort( ascNum );
		return [ _arr[ Math.round( ( arrlen ) / 4 ) - 1 ], _arr[ Math.round( ( arrlen ) / 2 ) - 1 ], _arr[ Math.round( ( arrlen ) * 3 / 4 ) - 1 ] ];
	},

	// covariance of two arrays
	covariance : function( arr1, arr2 ) {
		var u = jStat.mean( arr1 ),
			v = jStat.mean( arr2 ),
			sq_dev = [],
			arr1Len = arr1[length],
			i = 0;
		for ( ; i < arr1Len; i++ ) {
			sq_dev[ i ] = ( arr1[ i ] - u ) * ( arr2[ i ] - v );
		}
		return jStat.sum( sq_dev ) / arr1Len;
	},

	// correlation coefficient of two arrays
	corrcoeff : function( arr1, arr2 ) {
		return jStat.covariance( arr1, arr2 ) / jStat.stdev( arr1 ) / jStat.stdev( arr2 );
	}
});

// exposing jStat
return jStat;

})( Math );
