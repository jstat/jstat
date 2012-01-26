/**
 * jStat - JavaScript Statistical Library
 * Copyright (c) 2011
 * This document is licensed as free software under the terms of the
 * MIT License: http://www.opensource.org/licenses/mit-license.php */
this.j$ = this.jStat = (function( Math, undefined ) {

	// for quick reference
var slice = Array.prototype.slice,
	toString = Object.prototype.toString,

	// ascending/descending functions for sort
	ascNum = function( a, b ) { return a - b; },

	// calculate correction for IEEE error
	calcRdx = function( n, m ) {
		var val = n > m ? n : m;
		return Math.pow( 10, 17 - ~~( Math.log((( val > 0 ) ? val : -val )) * Math.LOG10E ));
	},

	// test if array
	isArray = Array.isArray || function( arg ) {
		return toString.call( arg ) === "[object Array]";
	},

	// test if function
	isFunction = function( arg ) {
		return toString.call( arg ) === "[object Function]";
	};

// implement bind if browser doesn't natively support it
if ( !Function.prototype.bind ) {
	Function.prototype.bind = function( obj ) {
		var args = slice.call( arguments, 1 ),
			self = this,
			nop = function() {},
			bound = function() {
				return self.apply( this instanceof nop ? this : ( obj || {} ),
					args.concat( slice.call( arguments ))
				);
			};
		bound.prototype = this.prototype;
		return bound;
	};
}

// global function
function jStat() {
	return new jStat.fn.init( arguments );
}

// extend jStat prototype
jStat.fn = jStat.prototype = {
	constructor : jStat,
	init : function( args ) {
		// if first argument is an array, must be vector or matrix
		if ( isArray( args[0] )) {
			// check if matrix
			if ( isArray( args[0][0] )) {
				for ( var i = 0; i < args[0].length; i++ ) {
					this[i] = args[0][i];
				}
				this.length = args[0].length;
			// so must be vector
			} else {
				this[0] = args[0];
				this.length = 1;
			}
		// if first argument is number, assume creation of sequence
		} else if ( !isNaN( args[0] )) {
			this[0] = jStat.seq.apply( null, args );
			this.length = 1;
		}
		return this;
	},

	// default length
	length : 0,

	// return clean array
	toArray : function() {
		return ( this.length > 1 ) ?
			slice.call( this )
		: slice.call( this )[0];
	},

	// only to be used internally
	push : [].push,
	sort : [].sort,
	splice : [].splice
};

// for later instantiation
jStat.fn.init.prototype = jStat.fn;

// utility functions
jStat.utils = {
	calcRdx : calcRdx,
	isArray : isArray,
	isFunction : isFunction
};

// create method for easy extension
jStat.extend = function( obj ) {
	var args = slice.call( arguments ),
		i = 1, j;
	if ( args.length === 1 ) {
		for ( j in obj ) {
			jStat[j] = obj[j];
		}
		return this;
	}
	for ( ; i < args.length; i++ ) {
		for ( j in args[i] ) obj[j] = args[i][j];
	}
	return obj;
};

// static methods
jStat.extend({

	// transpose a matrix or array
	transpose : function( arr ) {
		if ( !isArray( arr[0] )) arr = [ arr ];
		var rows = arr.length,
			cols = arr[0].length,
			obj = [],
			i = 0, j;
		for ( ; i < cols; i++ ) {
			obj.push([]);
			for ( j = 0; j < rows; j++ ) {
				obj[i].push( arr[j][i] );
			}
		}
		return obj;
	},

	// map a function to an array or array of arrays
	// toAlter is an internal variable
	map : function( arr, func, toAlter ) {
		if ( !isArray( arr[0] )) arr = [ arr ];
		var row = 0,
			nrow = arr.length,
			ncol = arr[0].length,
			res = toAlter ? arr : [],
			col;
		for ( ; row < nrow; row++ ) {
			// if the row doesn't exist, create it
			if ( !res[row] ) res[row] = [];
			for ( col = 0; col < ncol; col++ )
				res[row][col] = func( arr[row][col], row, col );
		}
		return res.length === 1 ? res[0] : res;
	},

	// destructively alter an array
	alter : function( arr, func ) {
		return jStat.map( arr, func, true );
	},

	// generate a rows x cols matrix according to the supplied function
	create : function ( rows, cols, func ) {
		if ( isFunction( cols )) {
			func = cols;
			cols = rows;
		}
		var res = [], i, j;
		for ( i = 0; i < rows; i++ ) {
			res[i]  = [];
			for ( j = 0; j < cols; j++ ) {
				res[i].push( func( i, j ));
			}
		}
		return res;
	},

	// generate a rows x cols matrix of zeros
	zeros : function( rows, cols ) {
		if ( isNaN( cols )) cols = rows;
		return jStat.create( rows, cols, function() { return 0; });
	},

	// generate a rows x cols matrix of ones
	ones : function( rows, cols ) {
		if ( isNaN( cols )) cols = rows;
		return jStat.create( rows, cols, function() { return 1; });
	},

	// generate a rows x cols matrix of uniformly random numbers
	rand : function( rows, cols ) {
		if ( isNaN( cols )) cols = rows;
		return jStat.create( rows, cols, function() { return Math.random(); });
	},

	// generate an identity matrix of size row x cols
	identity : function( rows, cols ) {
		if ( isNaN( cols )) cols = rows;
		return jStat.create( rows, cols, function( i, j ) { return ( i === j ) ? 1 : 0; });
	},

	// generate sequence
	seq : function( min, max, length, func ) {
		if ( !isFunction( func )) func = false;
		var arr = [],
			hival = calcRdx( min, max ),
			step = ( max * hival - min * hival ) / (( length - 1 ) * hival ),
			current = min,
			cnt = 0;
		// current is assigned using a technique to compensate for IEEE error
		for ( ; current <= max; cnt++, current = ( min * hival + step * hival * cnt ) / hival )
			arr.push(( func ? func( current, cnt ) : current ));
		return arr;
	},

	// add a vector/matrix to a vector/matrix or scalar
	add : function( arr, arg ) {
		// check if arg is a vector or scalar
		if ( isArray( arg )) {
			if ( !isArray( arg[0] )) arg = [ arg ];
			return jStat.map( arr, function( value, row, col ) { return value + arg[row][col]; });
		}
		return jStat.map( arr, function ( value ) { return value + arg; });
	},

	// TODO: Implement matrix division
	// matrix division
	divide : function( arr, arg ) {
		return isArray( arg ) ?
			false
		: jStat.map(arr, function ( value ) { return value / arg; });
	},

	// matrix multiplication
	multiply : function( arr, arg ) {
		var row, col, nrescols, sum,
			nrow = arr.length,
			ncol = arr[0].length,
			res = jStat.zeros( nrow, nrescols = ( isNaN( arg )) ? arg[0].length : ncol ),
			rescols = 0;
		if ( isArray( arg )) {
			for ( ; rescols < nrescols; rescols++ ) {
				for ( row = 0; row < nrow; row++ ) {
					sum = 0;
					for ( col = 0; col < ncol; col++ )
						sum += arr[row][col] * arg[col][rescols];
					res[row][rescols] = sum;
				}
			}
			return ( nrow === 1 && rescols === 1 ) ? res[0][0] : res;
		}
		return jStat.map( arr, function( value ) { return value * arg; });
	},

	// subtract a vector or scalar from the vector
	subtract : function( arr, arg ) {
		// check if arg is a vector or scalar
		if ( isArray( arg )) {
			if ( !isArray( arg[0] )) arg = [ arg ];
			return jStat.map( arr, function( value, row, col ) { return value - arg[row][col] || 0; });
		}
		return jStat.map( arr, function( value ) { return value - arg; });
	},

	// Returns the dot product of two matricies
	dot : function( arr, arg ) {
		if ( !isArray( arr[0] )) arr = [ arr ];
		if ( !isArray( arg[0] )) arg = [ arg ];
			// convert column to row vector
		var left = ( arr[0].length === 1 && arr.length !== 1 ) ? jStat.transpose( arr ) : arr,
			right = ( arg[0].length === 1 && arg.length !== 1 ) ? jStat.transpose( arg ) : arg,
			res = [],
			row = 0,
			nrow = left.length,
			ncol = left[0].length,
			sum, col;
		for ( ; row < nrow; row++ ) {
			res[row] = [];
			sum = 0;
			for ( col = 0; col < ncol; col++ )
				sum += left[row][col] * right[row][col];
			res[row] = sum;
		}
		return ( res.length === 1 ) ? res[0] : res;
	},

	// raise every element by a scalar
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

	// TODO: make compatible with matrices
	// computes the p-norm of the vector
	norm : function( arr, p ) {
		var nnorm = 0,
			i = 0;
		// check the p-value of the norm, and set for most common case
		if ( isNaN( p )) p = 2;
		// check if multi-dimensional array, and make vector correction
		if ( isArray( arr[0] )) arr = arr[0];
		// vector norm
		for (; i < arr.length; i++ ) {
			nnorm += Math.pow( Math.abs( arr[i] ), p );
		}
		return Math.pow( nnorm, 1 / p );
	},

	// TODO: make compatible with matrices
	// computes the angle between two vectors in rads
	angle : function( arr, arg ) {
		return Math.acos( jStat.dot( arr, arg ) / ( jStat.norm( arr ) * jStat.norm( arg )));
	},

	// Tests whether a matrix is symmetric
	symmetric : function( arr ) {
		var issymmetric = true,
			row = 0,
			size = arr.length, col;
		if ( arr.length !== arr[0].length ) return false;
		for ( ; row < size; row++ ) {
			for ( col = 0; col < size; col++ ) {
				if ( arr[col][row] !== arr[row][col] ) return false;
			}
		}
		return true;
	},

	/* array/vector specific methods */

	// sum of an array
	sum : function( arr ) {
		var sum = 0,
			i = arr.length;
		while ( --i >= 0 ) sum += arr[i];
		return sum;
	},

	// sum squared
	sumsqrd : function( arr ) {
		var sum = 0,
			i = arr.length;
		while ( --i >= 0 ) sum += arr[i] * arr[i];
		return sum;
	},

	// sum squared error
	sumsqerr : function( arr ) {
		var mean = jStat.mean( arr ),
			sum = 0,
			i = arr.length;
		while ( --i >= 0 ) sum += Math.pow( arr[i] - mean, 2 );
		return sum;
	},

	// product of an array
	product : function( arr ) {
		var prod = 1,
			i = arr.length;
		while ( --i >= 0 ) prod *= arr[i];
		return prod;
	},

	// minimum value of an array
	min : function( arr ) {
		var low = arr[0],
			i = 0;
		while ( ++i < arr.length )
			if ( arr[i] < low ) low = arr[i];
		return low;
	},

	// maximum value of an array
	max : function( arr ) {
		var high = arr[0],
			i = 0;
		while ( ++i < arr.length )
			if ( arr[i] > high ) high = arr[i];
		return high;
	},

	// mean value of an array
	mean : function( arr ) {
		return jStat.sum( arr ) / arr.length;
	},

	// mean squared error
	meansqerr : function( arr ) {
		return jStat.sumsqerr( arr ) / arr.length;
	},

	// geometric mean of an array
	geomean : function( arr ) {
		return Math.pow( jStat.product( arr ), 1 / arr.length );
	},

	// median of an array
	median : function( arr ) {
		var arrlen = arr.length,
			_arr = arr.slice().sort( ascNum );
		// check if array is even or odd, then return the appropriate
		return !( arrlen & 1 )
			? ( _arr[( arrlen / 2 ) - 1 ] + _arr[( arrlen / 2 )]) / 2
		: _arr[( arrlen / 2 ) | 0 ];
	},

	// cumulative sum of an array
	cumsum : function( arr ) {
		var cumsum = [arr[0]],
			arrLen = arr.length,
			i = 1;
		for (; i < arrLen; i++ ) {
			cumsum.push( cumsum[i-1] + arr[i]);
		}
		return cumsum;
	},

	// successive differences of an array
	diff : function( arr) {
		var diffs = [],
			arrLen = arr.length,
			i = 1;
		for ( i = 1; i < arrLen; i++ ) {
			diffs.push( arr[i] - arr[i-1]);
		}
		return diffs;
	},

	// mode of an array
	// if there are multiple modes of an array, just returns false
	// is this the appropriate way of handling it?
	mode : function( arr ) {
		var arrLen = arr.length,
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
		return _arr[ _arr.length - 1 ] - _arr[0];
	},

	// variance of an array
	// flag indicates population vs sample
	variance : function( arr, flag ) {
		var mean = jStat.mean( arr ),
			stSum = 0,
			i = arr.length - 1;
		for ( ; i >= 0; i-- ) {
			stSum += Math.pow(( arr[i] - mean ), 2 );
		}
		return stSum / ( arr.length - ( flag ? 1 : 0 ));
	},

	// standard deviation of an array
	// flag indicates population vs sample
	stdev : function( arr, flag ) {
		return Math.sqrt( jStat.variance( arr, flag ));
	},

	// mean deviation (mean absolute deviation) of an array
	meandev : function( arr ) {
		var devSum = 0,
			mean = jStat.mean( arr ),
			i = arr.length - 1;
		for ( ; i >= 0; i-- ) {
			devSum += Math.abs( arr[i] - mean );
		}
		return devSum / arr.length;
	},

	// median deviation (median absolute deviation) of an array
	meddev : function( arr ) {
		var devSum = 0,
			median = jStat.median( arr ),
			i = arr.length - 1;
		for ( ; i >= 0; i-- ) {
			devSum += Math.abs( arr[i] - median );
		}
		return devSum / arr.length;
	},

	// quartiles of an array
	quartiles : function( arr ) {
		var arrlen = arr.length,
			_arr = arr.slice().sort( ascNum );
		return [
			_arr[ Math.round(( arrlen ) / 4 ) - 1 ],
			_arr[ Math.round(( arrlen ) / 2 ) - 1 ],
			_arr[ Math.round(( arrlen ) * 3 / 4 ) - 1 ]
		];
	},

	// covariance of two arrays
	covariance : function( arr1, arr2 ) {
		var u = jStat.mean( arr1 ),
			v = jStat.mean( arr2 ),
			sq_dev = [],
			arr1Len = arr1.length,
			i = 0;
		for ( ; i < arr1Len; i++ ) {
			sq_dev[i] = ( arr1[i] - u ) * ( arr2[i] - v );
		}
		return jStat.sum( sq_dev ) / arr1Len;
	},

	// correlation coefficient of two arrays
	corrcoeff : function( arr1, arr2 ) {
		return jStat.covariance( arr1, arr2 ) / jStat.stdev( arr1, 1 ) / jStat.stdev( arr2, 1 );
	}
});


// extend jStat.fn with methods which don't require arguments and work on columns
(function( funcs ) {
	for ( var i = 0; i < funcs.length; i++ ) (function( passfunc ) {
		// if a matrix is passed, automatically assume operation should be done on the columns
		jStat.fn[ passfunc ] = function( fullbool, func ) {
			var arr = [],
				i = 0,
				tmpthis = this;
			// assignment reassignation depending on how parameters were passed in
			if ( isFunction( fullbool )) {
				func = fullbool;
				fullbool = false;
			}
			// check if a callback was passed with the function
			if ( func ) {
				setTimeout( function() {
					func.call( tmpthis, jStat.fn[ passfunc ].call( tmpthis, fullbool ));
				}, 15 );
				return this;
			}
			// check if matrix and run calculations
			if ( this.length > 1 ) {
				tmpthis = fullbool === true ? this : this.transpose();
				for ( ; i < tmpthis.length; i++ )
					arr[i] = jStat[ passfunc ]( tmpthis[i] );
				return fullbool === true ? jStat[ passfunc ]( arr ) : arr;
			}
			return jStat[ passfunc ]( this[0] );
		};
	})( funcs[i] );
})( 'sum sumsqrd sumsqerr product min max mean geomean median mode range variance stdev meandev meddev quartiles'.split( ' ' ));

// extend jStat.fn with methods that have no argument
(function( funcs ) {
	for ( var i = 0; i < funcs.length; i++ ) (function( passfunc ) {
		jStat.fn[ passfunc ] = function( func ) {
			var tmpthis = this,
				results;
			// check for callback
			if ( func ) {
				setTimeout( function() {
					func.call( tmpthis, jStat.fn[ passfunc ].call( tmpthis ));
				}, 15 );
				return this;
			}
			results = jStat[ passfunc ]( this );
			return isArray( results ) ? jStat( results ) : results;
		};
	})( funcs[i] );
})( 'transpose clear norm symmetric'.split( ' ' ));

// extend jStat.fn with methods that require one argument
(function( funcs ) {
	for ( var i = 0; i < funcs.length; i++ ) (function( passfunc ) {
		jStat.fn[ passfunc ] = function( arg, func ) {
			var tmpthis = this;
			// check for callback
			if ( func ) {
				setTimeout( function() {
					func.call( tmpthis, jStat.fn[ passfunc ].call( tmpthis, arg ));
				}, 15 );
				return this;
			}
			return jStat( jStat[ passfunc ]( this, arg ));
		};
	})( funcs[i] );
})( 'add divide multiply subtract dot pow abs angle'.split( ' ' ));

// extend jStat.fn with simple shortcut methods
(function( funcs ) {
	for ( var i = 0; i < funcs.length; i++ ) (function( passfunc ) {
		jStat.fn[ passfunc ] = function() {
			return jStat( jStat[ passfunc ].apply( null, arguments ));
		};
	})( funcs[i] );
})( 'create zeros ones rand identity'.split( ' ' ));

// extend jStat.fn
jStat.extend( jStat.fn, {

	// Returns the number of rows in the matrix
	rows : function() {
		return this.length || 1;
	},

	// Returns the number of columns in the matrix
	cols : function() {
		return this[0].length || 1;
	},

	// Returns the dimensions of the object { rows: i, cols: j }
	dimensions : function() {
		return {
			rows : this.rows(),
			cols : this.cols()
		};
	},

	// Returns a specified row as a vector
	row : function( index ) {
		return jStat( this[index] );
	},

	// Returns the specified column as a vector
	col : function( index ) {
		var column = [],
			i = 0;
		for ( ; i < this.length; i++ ) {
			column[i] = [ this[i][index] ];
		}
		return jStat( column );
	},

	// Returns the diagonal of the matrix
	diag : function() {
		var row = 0,
			nrow = this.rows(),
			res = [];
		for ( ; row < nrow; row++ ) {
			res[row] = [ this[row][row] ];
		}
		return jStat( res );
	},

	// Returns the anti-diagonal of the matrix
	antidiag : function() {
		var nrow = this.rows() - 1,
			res = [],
			i = 0;
		for ( ; nrow >= 0; nrow--, i++ ) {
			res[i] = [ this[i][nrow] ];
		}
		return jStat( res );
	},

	// map a function to a matrix or vector
	map : function( func, toAlter ) {
		return jStat( jStat.map( this, func, toAlter ));
	},

	// destructively alter an array
	alter : function( func ) {
		jStat.alter( this, func );
		return this;
	}
});

// exposing jStat
return jStat;

})( Math );
