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

	// ascending/descending functions for sort
	ascNum = function( a, b ) {return a - b;},
	descNum = function( a, b ) {return b - a;},

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
	},

	// simple method to run functions in setTimeout
	callLater = function( func, context, values ) {
		setTimeout( function() {
			func.apply( context, values );
		}, 10 );
	};

jStat.fn = jStat.prototype = {
	constructor : jStat,
	init : function( args ) {
		// if first argument is an array, must be vector or matrix
		if ( isArray( args[0] )) {
			if ( isArray( args[0][0] )) {
				for ( var i = 0; i < args[0].length; i++ ) {
					this.push( args[0][i] );
				}
			} else {
				this.push( args[0] );
			}
		// if first argument is number, assume creation of sequence
		} else if ( !isNaN( args[0] )) {
			this.push( jStat.seq.apply( this, args ));
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
	if ( args.length === 1 ) {
		for ( i in obj ) {
			jStat[i] = obj[i];
		}
		return this;
	}
	for ( ; i < args.length; i++ ) {
		for ( j in args[i] ) obj[j] = args[i][j];
	}
	return obj;
};

// extend jStat.fn with single single parameter static methods
(function( funcs ) {
	for ( var i = 0; i < funcs.length; i++ ) (function( passfunc ) {
		jStat.fn[ passfunc ] = function( func ) {
			var arr = [], j = 0;
			if ( isFunction( func )) {
				for ( ; j < this.length; j++ ) {
					callLater( func, jStat( this[j] ), [ jStat[ passfunc ]( this[j][0] )]);
				}
				return this;
			} else {
				for ( ; j < this.length; j++ ) {
					arr.push( jStat[ passfunc ]( this[j] ));
				}
				return arr.length === 1 ? arr[0] : jStat[ passfunc ]( arr );
			}
		};
	})( funcs[i] );
})( 'sum min max mean median mode range variance stdev meandev meddev quartiles'.split(' '));

// extend jStat.fn
jStat.extend( jStat.fn, {

	// Returns the number of rows in the matrix
	rows: function() {
		return this.length || 1;
	},

	// Returns the number of columns in the matrix
	cols: function() {
		return this[0].length || 1;
	},

	// transpose a vector or matrix
	transpose : function() {
		var rows = this.length,
			cols = this[0].length,
			obj = [],
			i = 0, j;
		for ( ; i < cols; i++ ) {
			obj[i] = [];
			for ( j = 0; j < rows; j++ ) {
				obj[i][j] = this[j][i];
			}
		}
		return jStat( obj );
	},

	// map one matrix to another
	map : function( func ) {
		var row = 0,
			nrow = this.rows(),
			ncol = this.cols(),
			res = [],
			col;
		for ( ; row < nrow; row ++) {
			res[row] = [];
			for ( col = 0; col < ncol; col++ ) {
				res[row][col] = func( this[row][col], row, col );
			}
		}
		return jStat( res );
	},

	// alter a function to each element in the matrix
	alter : function( func ) {
		var row = 0,
		nrow = this.rows(),
		ncol = this.cols(),
		col; 
		for( ; row < nrow; row ++) {
			for( col = 0; col < ncol; col++ ) {
				this[row][col] = func( this[row][col], row, col );
			}
		}
		return this;
	},

	// add a vector or scalar to the vector
	add : function( k ) {
		if( isNaN( k ) ) {
			return this.map( function( value, row, col ) {return value + k[row][col];});
		} else {
			return this.map( function ( value ) {return value + k;} );
		}
	},

	// TODO: Implement matrix division
	// matrix division
	divide : function( k ) {
		if( isNaN( k ) ) {
			// unsupported operation
		} else {
			return this.map( function ( value ) {return value / k;} );
		}
	},

	// matrix multiplication
	multiply : function( k ) {
		var nrow, col, nrescols,
			row=this.rows(),
			ncol = this.cols(),
			sum = 0,
			res = jStat.zeros(nrow, nrescols = ( isNaN( k ) ) ? k.cols() : ncol),
			rescols = 0;
		if( isNaN(k) ) {
			for( ; rescols < nrescols; rescols++ ) {
				for( row = 0; row < nrow; row++ ) {
					sum = 0;
					for( col = 0; col < ncol; col++ ) {
						sum += this[row][col] * k[col][rescols];
					}
					res[row][rescols] = sum;
				}
			}
			return ( nrow == 1 && rescols == 1 ) ? res[0][0] : res;
		} else {
			return this.map( function ( value ) {return value * k;} );
		}
	},

	// subtract a vector or scalar from the vector
	subtract : function( k ) {
		if( isNaN( k ) ) {
			return this.map( function( value, row, col ) {return value - k[row][col];});
		} else {
			return this.map( function ( value ) {return value - k;});
		}
	},

	// Returns the dot product of two matricies
	dot : function( k ) {
		// convert column to row vector
		var left = ( this.cols() === 1 && this.rows() !== 1 ) ? this.transpose() : this,
			right = ( k.cols() === 1 && k.rows() !== 1 ) ? k.transpose() : k,
			res = [],
			row = 0,
			nrow = left.rows(),
			ncol = left.cols(),
			sum, col;
		for( ; row < nrow; row++ ) {
			res[row] = [];
			sum = 0;
			for( col = 0; col < ncol; col++ ) {
				sum += left[row][col] * right[row][col];
			}
			res[row] = sum;
		}
		return ( res.length === 1 ) ? res[0] : jStat( res );
	},

	// raise every element by a scalar or vector
	pow : function( k ) {
		return this.map( function( value ) {return Math.pow( value, k );} );
	},

	// generate the absolute values of the vector
	abs : function() {
		return this.map( function( value ) {return Math.abs( value );} );
	},

	// set all values to zero
	clear : function() {
		return this.alter( function() {return 0;} );
	},

	// Returns the dimensions of the object { rows: i, cols: j }
	dimensions : function() {
		return {rows: this.rows(), cols: this.cols()};
	},

	// Returns the sum of each column in the matrix
	sumx : function() {
		var col = 0,
			ncol = this.cols(),
			res = [],
			tmpthis = this.transpose();
		for( ; col < ncol; col++ ) {
			res[col] = jStat.sum( tmpthis[col] );
		}
		return ( ncol > 1 ) ? jStat( res ) : res[0];
	},

	// Returns the mean of each column in the matrix
	meanx : function() {
		var col = 0,
			ncol = this.cols(),
			nrow = this.rows(),
			res = [],
			tmpthis = this.transpose();
		for( ; col < ncol; col++ ) {
			res[col] = jStat.mean( tmpthis[col] );
		}
		return ( ncol > 1 ) ? jStat( res ) : res[0];
	},

	// Returns the standard deviation of each column in the matrix
	stdevx : function() {
		var col = 0,
			ncol = this.cols(),
			nrow = this.rows(),
			res = [],
			tmpthis = this.transpose();
		for( ; col < ncol; col++ ) {
			res[col] = jStat.stdev( tmpthis[col] );
		}
		return ( ncol > 1 ) ? jStat( res ) : res[0];
	},

	// Returns the variance of each column in the matrix
	variancex : function() {
		var col = 0,
			ncol = this.cols(),
			nrow = this.rows(),
			res = [],
			tmpthis = this.transpose();
		for( ; col < ncol; col++ ) {
			res[col] = jStat.variance( tmpthis[col] );
		}
		return ( ncol > 1 ) ? jStat( res ) : res[0];
	},

	// BUG: Does not work for matrices
	// computes the norm of the vector
	norm : function() {
		if( this.rows() > 1 && this.cols() > 1 ) {
			// matrix norm
		} else {
			// vector norm
			return Math.sqrt( this.dot( this ) );
		}
	},

	// BUG: Does not work for matrices
	// computes the angle between two vectors
	angle : function( k ) {
		 return Math.acos( this.dot( k ) / ( this.norm() * k.norm() ) );
	},


	// Tests whether a matrix is symmetric
	symmetric : function() {
		var issymmetric = true,
			row = 0,
			size = this.rows(), col;
		if( this.rows() !== this.cols() ) return false;
		for ( ; ( row < size ) && issymmetric; row++ ) {
			for ( col = 0; ( col < size ) && issymmetric; col++ ) {
				issymmetric = ( this[col][row] === this[row][col] );
			}
		}
		return issymmetric;
	},

	// Returns a specified row as a vector
	row: function( index ) {
	    return jStat( this[index] );
	},

	// Returns the specified column as a vector
	col: function( index ) {
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
		for( ; row < nrow; row ++ ) {
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
	}
});


// static methods //

jStat.extend({

	// creates a rows x cols matrix of zeros
	zeros : function( rows, cols ) {
		return jStat.create( rows, cols, function() {return 0;} );
	},

	// creates a rows x cols matrix of ones
	ones: function( rows, cols ) {
		return jStat.create( rows, cols, function() {return 1;} );
	},

	// Creates a rows x cols matrix of uniformly random numbers
	rand: function( rows, cols ) {
		return jStat.create( rows, cols, function() {return Math.random();} );
	},

	// Creates an identity matrix of size row x cols
	identity : function( rows, cols ) {
		return jStat.create( rows, cols, function( i, j ) {return ( i === j ) ? 1 : 0;} );
	},

	// creates a rows x cols matrix according to the supplied function
	create: function ( rows, cols, func ) {
		var i, j, res = [];
		for( i = 0; i < rows; i++ ) {
			res[i]  = [];
			for( j = 0; j < cols; j++ ) {
				res[i][j] = func( i, j );
			}
		}
		return jStat( res );
	},

	// generate sequence
	seq : function( min, max, length, func ) {
		var arr = [],
			step = ( max - min ) / ( length - 1 );
		// TODO: replace toFixed value to user configurable parameter
		for ( ; min <= max; min += step ) arr.push(+( func ? func.call( null, min ) : min ).toFixed(6));
		return jStat( arr );
	},

	// factorial of n
	factorial : function( n ) {
		var fval = 1;
		if ( n < 0 ) return NaN;
		if ( n != Math.floor( n ) ) return jStat.gammafn( n + 1 );
		for( ; n > 0; n-- ) {
			fval *= n;
		}
		return fval;
	},

	// combinations of n, m
	combination : function( n, m ) {
		return ( jStat.factorial( n ) / jStat.factorial( m ) ) / jStat.factorial( n - m );
	},

	// permutations of n, m
	permutation : function( n, m ) {
		return jStat.factorial( n ) / jStat.factorial( n - m );
	},

	// vector/matrix specific functionality //

	// sum of an array
	sum : function( arr ) {
		var sum = 0,
			i = arr.length;
		while ( --i >= 0 ) {
			sum += +arr[i];
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
		return jStat.sum( arr ) / arr.length;
	},

	// median of an array
	median : function( arr ) {
		var arrlen = arr.length,
			_arr = arr.slice().sort( ascNum );

		// check if array is even or odd, then return the appropriate
		return !( arrlen & 1 ) ? ( _arr[ ( arrlen / 2 ) - 1 ] + _arr[ ( arrlen / 2 ) ] ) / 2 : _arr[ Math.floor( arrlen / 2 ) ];
	},

	// mode of an array
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
	variance : function( arr ) {
		var mean = jStat.mean( arr ),
			stSum = 0,
			i = arr.length - 1;
		for( ; i >= 0; i-- ) {
			stSum += Math.pow( ( arr[i] - mean ), 2 );
		}
		return stSum / ( arr.length - 1 );
	},

	// standard deviation of an array
	stdev : function( arr ) {
		return Math.sqrt( jStat.variance( arr ) );
	},

	// mean deviation (mean absolute deviation) of an array
	meandev : function( arr ) {
		var devSum = 0,
			mean = jStat.mean( arr ),
			i = arr.length - 1;
		for ( ; i >= 0; i-- ) {
			devSum += Math.abs( arr[ i ] - mean );
		}
		return devSum / arr.length;
	},

	// median deviation (median absolute deviation) of an array
	meddev : function( arr ) {
		var devSum = 0,
			median = jStat.median( arr ),
			i = arr.length - 1;
		for ( ; i >= 0; i-- ) {
			devSum += Math.abs( arr[ i ] - median );
		}
		return devSum / arr.length;
	},

	// quartiles of an array
	quartiles : function( arr ) {
		var arrlen = arr.length,
			_arr = arr.slice().sort( ascNum );
		return [ _arr[ Math.round( ( arrlen ) / 4 ) - 1 ], _arr[ Math.round( ( arrlen ) / 2 ) - 1 ], _arr[ Math.round( ( arrlen ) * 3 / 4 ) - 1 ] ];
	},

	// covariance of two arrays
	covariance : function( arr1, arr2 ) {
		var u = jStat.mean( arr1 ),
			v = jStat.mean( arr2 ),
			sq_dev = [],
			arr1Len = arr1.length,
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
