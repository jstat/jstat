this.j$ = this.jStat = (function(Math, undefined) {

	// for quick reference
var slice = Array.prototype.slice,
	toString = Object.prototype.toString,

	// calculate correction for IEEE error
	calcRdx = function(n, m) {
		var val = n > m ? n : m;
		return Math.pow(10, 17 - ~~(Math.log(((val > 0) ? val : -val)) * Math.LOG10E));
	},

	// test if array
	isArray = Array.isArray || function(arg) {
		return toString.call(arg) === '[object Array]';
	},

	// test if function
	isFunction = function(arg) {
		return toString.call(arg) === '[object Function]';
	},

	// test if number and not NaN
	isNumber = function(arg) {
		return toString.call(arg) === '[object Number]' && !isNaN(arg);
	},

	// converts the jStat matrix to vector
	toVector = function(arr) {
		return [].concat.apply([], arr);
	};

// global function
function jStat() {
	return new jStat.fn.init(arguments);
}

// extend jStat prototype
jStat.fn = jStat.prototype = {
	constructor : jStat,
	init : function(args) {
		var i = 0;
		// if first argument is an array, must be vector or matrix
		if (isArray(args[0])) {
			// check if matrix
			if (isArray(args[0][0])) {
				// see if a mapping function was also passed
				if (isFunction(args[1])) {
					args[0] = jStat.map(args[0], args[1]);
				}
				// itterating over each is faster than this.push.apply(this, args[0]);
				for (; i < args[0].length; i++) {
					this[i] = args[0][i];
				}
				this.length = args[0].length;
			// so must be vector
			} else {
				this[0] = isFunction(args[1]) ? jStat.map(args[0], args[1]) : args[0];
				this.length = 1;
			}
		// if first argument is number, assume creation of sequence
		} else if (isNumber(args[0])) {
			this[0] = jStat.seq.apply(null, args);
			this.length = 1;
		// handle case when jStat object is passed to jStat
		} else if (args[0] instanceof jStat) {
			// duplicate the object and pass it back
			return jStat(args[0].toArray());
		// unexpected argument value, return empty jStat object
		} else {
			this[0] = [];
			this.length = 1;
		}
		return this;
	},

	// default length
	length : 0,

	// return clean array
	toArray : function() {
		return (this.length > 1) ?
			slice.call(this)
		: slice.call(this)[0];
	},

	// only to be used internally
	push : [].push,
	sort : [].sort,
	splice : [].splice,
	slice : [].slice
};

// for later instantiation
jStat.fn.init.prototype = jStat.fn;

// utility functions
jStat.utils = {
	calcRdx : calcRdx,
	isArray : isArray,
	isFunction : isFunction,
	isNumber : isNumber,
	toVector : toVector
};

// create method for easy extension
jStat.extend = function(obj) {
	var args = slice.call(arguments),
		i = 1, j;
	if (args.length === 1) {
		for (j in obj) {
			jStat[j] = obj[j];
		}
		return this;
	}
	for (; i < args.length; i++) {
		for (j in args[i]) obj[j] = args[i][j];
	}
	return obj;
};

// static methods
jStat.extend({

	// Returns the number of rows in the matrix
	rows : function(arr) {
		return arr.length || 1;
	},

	// Returns the number of columns in the matrix
	cols : function(arr) {
		return arr[0].length || 1;
	},

	// Returns the dimensions of the object { rows: i, cols: j }
	dimensions : function(arr) {
		return {
			rows : jStat.rows(arr),
			cols : jStat.cols(arr)
		};
	},

	// Returns a specified row as a vector
	row : function(arr, index) {
		return arr[ index ];
	},

	// Returns the specified column as a vector
	col : function(arr, index) {
		var column = new Array(arr.length),
			i = 0;
		for (; i < arr.length; i++) {
			column[i] = [ arr[i][index] ];
		}
		return column;
	},

	// Returns the diagonal of the matrix
	diag : function(arr) {
		var row = 0,
			nrow = jStat.rows(arr),
			res = new Array(nrow);
		for (; row < nrow; row++) {
			res[row] = [ arr[row][row] ];
		}
		return res;
	},

	// Returns the anti-diagonal of the matrix
	antidiag : function(arr) {
		var nrow = jStat.rows(arr) - 1,
			res = new Array(nrow),
			i = 0;
		for (; nrow >= 0; nrow--, i++) {
			res[i] = [ arr[i][nrow] ];
		}
		return res;
	},

	// transpose a matrix or array
	transpose : function(arr) {
		var obj = [],
			i = 0,
			rows, cols, j;
		// make sure arr is in matrix format
		if (!isArray(arr[0])) arr = [ arr ];
		rows = arr.length;
		cols = arr[0].length;
		for (; i < cols; i++) {
			obj.push(new Array(rows));
			for (j = 0; j < rows; j++) {
				obj[i][j] = arr[j][i];
			}
		}
		// if obj is vector, return only single array
		return (obj.length === 1) ? obj[0] : obj;
	},

	// map a function to an array or array of arrays
	// toAlter is an internal variable
	map : function(arr, func, toAlter) {
		var row = 0,
			nrow, ncol, res, col;
		if (!isArray(arr[0])) arr = [ arr ];
		nrow = arr.length;
		ncol = arr[0].length;
		res = toAlter ? arr : new Array(nrow);
		for (; row < nrow; row++) {
			// if the row doesn't exist, create it
			if (!res[row]) res[row] = new Array(ncol);
			for (col = 0; col < ncol; col++)
				res[row][col] = func(arr[row][col], row, col);
		}
		return (res.length === 1) ? res[0] : res;
	},

	// destructively alter an array
	alter : function(arr, func) {
		return jStat.map(arr, func, true);
	},

	// generate a rows x cols matrix according to the supplied function
	create : function (rows, cols, func) {
		var res = new Array(rows), i, j;
		if (isFunction(cols)) {
			func = cols;
			cols = rows;
		}
		for (i = 0; i < rows; i++) {
			res[i] = new Array(cols);
			for (j = 0; j < cols; j++) {
				res[i][j] = func(i, j);
			}
		}
		return res;
	},

	// generate a rows x cols matrix of zeros
	zeros : function(rows, cols) {
		if (!isNumber(cols)) cols = rows;
		return jStat.create(rows, cols, function() { return 0; });
	},

	// generate a rows x cols matrix of ones
	ones : function(rows, cols) {
		if (!isNumber(cols)) cols = rows;
		return jStat.create(rows, cols, function() { return 1; });
	},

	// generate a rows x cols matrix of uniformly random numbers
	rand : function(rows, cols) {
		if (!isNumber(cols)) cols = rows;
		return jStat.create(rows, cols, function() { return Math.random(); });
	},

	// generate an identity matrix of size row x cols
	identity : function(rows, cols) {
		if (!isNumber(cols)) cols = rows;
		return jStat.create(rows, cols, function(i, j) { return (i === j) ? 1 : 0; });
	},

	// Tests whether a matrix is symmetric
	symmetric : function(arr) {
		var issymmetric = true,
			row = 0,
			size = arr.length, col;
		if (arr.length !== arr[0].length) return false;
		for (; row < size; row++) {
			for (col = 0; col < size; col++) {
				if (arr[col][row] !== arr[row][col]) return false;
			}
		}
		return true;
	},

	// set all values to zero
	clear : function(arr) {
		return jStat.alter(arr, function() { return 0; });
	},

	// generate sequence
	seq : function(min, max, length, func) {
		if (!isFunction(func)) func = false;
		var arr = [],
			hival = calcRdx(min, max),
			step = (max * hival - min * hival) / ((length - 1) * hival),
			current = min,
			cnt = 0;
		// current is assigned using a technique to compensate for IEEE error
		for (; current <= max; cnt++, current = (min * hival + step * hival * cnt) / hival)
			arr.push((func ? func(current, cnt) : current));
		return arr;
	}
});

// extend jStat.fn with methods that have no argument
(function(funcs) {
	for (var i = 0; i < funcs.length; i++) (function(passfunc) {
		jStat.fn[ passfunc ] = function(func) {
			var tmpthis = this,
				results;
			// check for callback
			if (func) {
				setTimeout(function() {
					func.call(tmpthis, jStat.fn[ passfunc ].call(tmpthis));
				}, 15);
				return this;
			}
			results = jStat[ passfunc ](this);
			return isArray(results) ? jStat(results) : results;
		};
	})(funcs[i]);
})('transpose clear symmetric rows cols dimensions diag antidiag'.split(' '));

// extend jStat.fn with methods that have one argument
(function(funcs) {
	for (var i = 0; i < funcs.length; i++) (function(passfunc) {
		jStat.fn[ passfunc ] = function(index, func) {
			var tmpthis = this;
			// check for callback
			if (func) {
				setTimeout(function() {
					func.call(tmpthis, jStat.fn[ passfunc ].call(tmpthis, index));
				}, 15);
				return this;
			}
			return jStat(jStat[ passfunc ](this, index));
		};
	})(funcs[i]);
})('row col'.split(' '));

// extend jStat.fn with simple shortcut methods
(function(funcs) {
	for (var i = 0; i < funcs.length; i++) (function(passfunc) {
		jStat.fn[ passfunc ] = function() {
			return jStat(jStat[ passfunc ].apply(null, arguments));
		};
	})(funcs[i]);
})('create zeros ones rand identity'.split(' '));

// extend jStat.fn
// specialized instance methods that can't have generalized assignments
jStat.extend(jStat.fn, {

	// map a function to a matrix or vector
	map : function(func, toAlter) {
		return jStat(jStat.map(this, func, toAlter));
	},

	// destructively alter an array
	alter : function(func) {
		jStat.alter(this, func);
		return this;
	}
});

// exposing jStat
return jStat;

}(Math));
