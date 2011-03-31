/**
 * jStat - JavaScript Statistical Library
 * Copyright (c) 2011
 * This document is licensed as free software under the terms of the
 * MIT License: http://www.opensource.org/licenses/mit-license.php */
(function( Math, _this, undefined ) {

// global function
var jstat = function() {
		return new jstat.fn.init( slice.call( arguments ));
	},

	// for quick reference
	slice = Array.prototype.slice,
	toString = Object.prototype.toString,

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

	// simple method to run functions in setTimeout
	callLater = function( func, context, values ) {
		setTimeout( function() {
			func.apply( context, values );
		}, 10 );
	};

jstat.fn = jstat.prototype = {
	constructor : jstat,
	init : function( args ) {
		// if first argument is an array, must be vector or matrix
		if ( isArray( args[0] )) {
			for ( var i = 0; i < args.length; i++ ) {
				this.push( isArray( args[i][0] ) ? args[i] : [ args[i] ] );
			};
		// if first argument is number, assume creation of sequence
		} else if ( !isNaN( args[0] )) {
			this.push( jstat.seq.apply( this, args ));
		};
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
jstat.fn.init.prototype = jstat.fn;

// TODO: there's got to be an easy way to combine these two
// create method for easy extension
jstat.extend = function( obj ) {
	for ( var i in obj ) {
		jstat[i] = obj[i];
	};
	return this;
};
jstat.fn.extend = function( obj ) {
	for ( var i in obj ) {
		jstat.fn[i] = obj[i];
	};
	return this;
};

// extend jstat.fn with applicable static methods
(function( funcs ) {
	funcs = funcs.split( ' ' );
	for ( var i = 0; i < funcs.length; i++ ) (function( passfunc ) {
		jstat.fn[ funcs[i] ] = function( func ) {
			var arr = [], i = 0;
			if ( isFunction( func )) {
				for ( ; i < this.length; i++ ) {
					callLater( func, jstat( this[i] ), [ jstat[ passfunc ]( this[i] )]);
				};
				return this;
			} else {
				for ( ; i < this.length; i++ ) {
					arr.push( jstat[ passfunc ]( this[i] ));
				};
				return arr.length === 1 ? arr[0] : arr;
			};
		};
	})( funcs[i] );
})( 'transpose sum min max mean median mode range variance stdev meandev meddev quartiles' );	

// extend jstat.fn
jstat.fn.extend({
	seq : function( start, count, func ) {
		this.push( jstat.seq( start, count, func ));
		return this;
	},

	// add a vector or scalar to the vector
	add : function( k ) {

	},

	// divide the vector by a scalar or vector
	divide : function( k ) {

	},

	// multiply the vector by a scalar or vector
	multiply : function( k ) {

	},

	// subtract a vector or scalar from the vector
	subtract : function( k ) {

	},

	// itterate over each object in the stack
	each : function( fn ) {

	},

	// raise every element by a scalar or vector
	pow : function( k ) {

	},

	// generate the absolute values of the vector
	abs : function() {

	},

	// computes the dot product
	dot : function( k ) {

	},

	// set all values to zero
	clear : function() {

	},

	// computes the norm of the vector
	norm : function() {

	},

	// computes the angle between two vectors
	angle : function( k ) {

	},

	rows: function() {
		return this[0].length || 1;
	},

	cols: function() {
		return this[0][0].length || 1;
	}
});


// static methods are beyone this line //

jstat.extend({

	// generate sequence
	seq : function( min, max, length, func ) {
		var arr = [],
			step = (max-min)/(length-1);
		// TODO: replace magic number with constant.
		for ( ; min <= max; min+=step ) arr.push(+( func ? func.call( this, min ) : min ).toFixed(6));
		return arr;
	},

	// transpose vector or matrix
	transpose : function( arr ) {
		if ( !isArray( arr[0] )) arr = slice.call( arguments );
		var ncol = arr.length,
			nrow = arr[0].length,
			t = [],
			i = -1, j;
		if ( nrow === 0 ) return t;
		while ( ++i < nrow ) {
			t[ i ] = [];
			j = -1;
			while ( ++j < ncol ) {
				t[ i ][ j ] = arr[ j ][ i ];
			};
		};
		return t.length === 1 ? t[0] : t;
	},

	// sum of an array
	sum : function( arr ) {
		var sum = 0,
			i = arr.length;
		while ( --i >= 0 ) {
			sum += arr[i];
		};
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
		return jstat.sum( arr ) / arr.length;
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
					};
				};
			};
		};

		return ( numMaxCount === 0 ) ? maxNum : false;
	},

	// range of an array
	range : function( arr ) {
		var _arr = arr.slice().sort( ascNum );
		return _arr[ _arr.length - 1 ] - _arr[0];
	},

	// variance of an array
	variance : function( arr ) {
		var mean = jstat.mean( arr ),
			stSum = 0,
			i = arr.length - 1;
		for( ; i >= 0; i-- ) {
			stSum += Math.pow( ( arr[i] - mean ), 2 );
		};
		return stSum / ( arr.length - 1 );
	},

	// standard deviation of an array
	stdev : function( arr ) {
		return Math.sqrt( jstat.variance( arr ) );
	},

	// mean deviation (mean absolute deviation) of an array
	meandev : function( arr ) {
		var devSum = 0,
			mean = jstat.mean( arr ),
			i = arr.length - 1;
		for ( ; i >= 0; i-- ) {
			devSum += Math.abs( arr[ i ] - mean );
		};
		return devSum / arr.length;
	},

	// median deviation (median absolute deviation) of an array
	meddev : function( arr ) {
		var devSum = 0,
			median = jstat.median( arr ),
			i = arr.length - 1;
		for ( ; i >= 0; i-- ) {
			devSum += Math.abs( arr[ i ] - median );
		};
		return devSum / arr.length;
	},

	// factorial of n
	factorial : function( n ) {
		var fval = 1;
		if ( n < 0 ) return NaN;
		if ( n != Math.floor( n ) ) return jstat.gamma( n + 1 );
		for( ; n > 0; n-- ) {
			fval *= n;
		};
		return fval;
	},

	// combinations of n, m
	combination : function( n, m ) {
		return ( jstat.factorial( n ) / jstat.factorial( m ) ) / jstat.factorial( n - m );
	},

	// permutations of n, m
	permutation : function( n, m ) {
		return jstat.factorial( n ) / jstat.factorial( n - m );
	},

	// gamma of x
	gamma : function( x ) {
		var v = 1,
			w;
		if ( x == Math.floor( x ) ) return jstat.factorial( x - 1 );
		while ( x < 8 ) {
			v *= x;
			x++;
		};
		w = 1 / (x * x);
		return Math.exp((((((((-3617 / 122400 * w + 7 / 1092) * w - 691 / 360360) * w + 5 / 5940) * w - 1 / 1680)  * w + 1 / 1260) * w - 1 / 360) * w + 1 / 12) / x + 0.5 * Math.log(2 * Math.PI) - Math.log(v) - x + (x - 0.5) * Math.log(x));
	},

	// quartiles of an array
	quartiles : function( arr ) {
		var arrlen = arr.length,
			_arr = arr.slice().sort( ascNum );
		return [ _arr[ Math.round( ( arrlen ) / 4 ) - 1 ], _arr[ Math.round( ( arrlen ) / 2 ) - 1 ], _arr[ Math.round( ( arrlen ) * 3 / 4 ) - 1 ] ];
	},

	// covariance of two arrays
	covariance : function( arr1, arr2 ) {
		var u = jstat.mean( arr1 ),
			v = jstat.mean( arr2 ),
			sq_dev = [],
			arr1Len = arr1.length,
			i = 0;
		for ( ; i < arr1Len; i++ ) {
			sq_dev[ i ] = ( arr1[ i ] - u ) * ( arr2[ i ] - v );
		};
		return jstat.sum( sq_dev ) / arr1Len;
	},

	// correlation coefficient of two arrays
	corrcoeff : function( arr1, arr2 ) {
		return jstat.covariance( arr1, arr2 ) / jstat.stdev( arr1 ) / jstat.stdev( arr2 );
	},

	// probability of uniform distibution
	uniformcdf : function( a, b, x ) {
		if ( x < a ) {
			return 0;
		} else if ( x < b ) {
			return ( x - a ) / ( b - a );
		};
		return 1;
	},

	// probability of binomial distribution
	binomial : function( n, p, k ) {
		return jstat.combination( n, k ) * Math.pow( p, k ) * Math.pow( 1 - p, n - k );
	},

	// probability of binomial cdf distribution
	binomialcdf : function( n, p, x ) {
		var binomarr = [],
			k = 0,
			i = 0,
			sum = 0;
		if ( x < 0 ) {
			return 0;
		};
		for ( ; k < n; k++ ) {
			binomarr[k] = jstat.binomial(n, p, k);
		};
		if ( x < n ) {
			for ( ; i <= x; i++ ) {
				sum += binomarr[ i ];
			};
			return sum;
		};
		return 1;
	},

	// weibull distribution of x
	weibull : function( x, a, b ) {
		return x < 0 ? 0 : ( a / b ) * Math.pow(( x / b ),( a - 1 )) * Math.exp(-( Math.pow(( x / b ), a )));
	},

	// cumulative probability of x for weibull distibution
	weibullcdf : function( x, a, b ) {
		return x < 0 ? 0 : 1 - Math.exp( Math.pow(-( x / b ), a ));
	},

	// probability of exact success
	negbin : function( r, p, x ) {
		return x !== Math.floor( x )
			? false
		: x < 0
			? 0
		: jstat.combination( x + r - 1, r - 1 ) * Math.pow( p, r ) * Math.pow( 1 - p, x );
	},

	// probability of cdf success
	negbincdf : function( n, p, x ) {
		var sum = 0,
			k = 0;
		if ( x < 0 ) return 0;
		for ( ; k <= x; k++ ) {
			sum += jstat.negbin( n, p, k );
		};
		return sum;
	},

	// probability of selection
	hypgeom : function( N, m, n, x ) {
		return x !== Math.floor( x )
			? false
		: ( x < 0)
			? 0
		: jstat.combination( m, x ) * jstat.combination(( N - m ), n - x ) / jstat.combination( N, n );
	},

	// probability of cdf selection
	hypgeomcdf : function( N, m, n, x ) {
		var sum = 0,
			k = 0;
		if ( x < 0 ) return 0;
		for ( ; k <= x; k++ ) {
			sum += jstat.hypgeom( N, m, n, k );
		};
		return sum;
	},

	// probability an exponentially distributed variable with parameter
	exponentialcdf : function( l, x ) {
		return 1 - Math.exp( -l * x );
	},

	// probability a possion variable with parameter
	poisson : function( l, x ) {
		return Math.pow( l, x ) * Math.exp( -l ) / jstat.factorial( x );
	},

	// calculate cumulative poisson distribution cumulative probability with parameter
	poissoncdf : function( l, x ) {
		var sum = 0,
			k = 0;
		if ( x < 0 ) return 0;
		for ( ; k <= x; k++ ) {
			sum += jstat.poisson( l, k );
		};
		return sum;
	},

	// calcualte sum of f(x) from a to b
	sumFunc : function( a, b, func ) {
		var sum = 0;
		while ( a <= b ) {
			sum += func( a++ );
		};
		return sum;
	}
});

// exposing jstat
_this.jstat = jstat;

// passing this for Node.js modules compatibility
})( Math, this );
