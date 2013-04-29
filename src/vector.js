(function(jStat, Math) {

	// for quick reference
var isFunction = jStat.utils.isFunction,

	// ascending functions for sort
	ascNum = function(a, b) { return a - b; };

jStat.extend({

	// sum of an array
	sum : function(arr) {
		var sum = 0,
			i = arr.length,
			tmp;
		while (--i >= 0) {
			sum += arr[i];
		}
		return sum;
	},

	// sum squared
	sumsqrd : function(arr) {
		var sum = 0,
			i = arr.length;
		while (--i >= 0) sum += arr[i] * arr[i];
		return sum;
	},

	// sum of squared errors of prediction (SSE)
	sumsqerr : function(arr) {
		var mean = jStat.mean(arr),
			sum = 0,
			i = arr.length,
			tmp;
		while (--i >= 0) {
			tmp = arr[i] - mean;
			sum += tmp * tmp;
		}
		return sum;
	},

	// product of an array
	product : function(arr) {
		var prod = 1,
			i = arr.length;
		while (--i >= 0) prod *= arr[i];
		return prod;
	},

	// minimum value of an array
	min : function(arr) {
		var low = arr[0],
			i = 0;
		while (++i < arr.length)
			if (arr[i] < low) low = arr[i];
		return low;
	},

	// maximum value of an array
	max : function(arr) {
		var high = arr[0],
			i = 0;
		while (++i < arr.length)
			if (arr[i] > high) high = arr[i];
		return high;
	},

	// mean value of an array
	mean : function(arr) {
		return jStat.sum(arr) / arr.length;
	},

	// mean squared error (MSE)
	meansqerr : function(arr) {
		return jStat.sumsqerr(arr) / arr.length;
	},

	// geometric mean of an array
	geomean : function(arr) {
		return Math.pow(jStat.product(arr), 1 / arr.length);
	},

	// median of an array
	median : function(arr) {
		var arrlen = arr.length,
			_arr = arr.slice().sort(ascNum);
		// check if array is even or odd, then return the appropriate
		return !(arrlen & 1)
			? (_arr[(arrlen / 2) - 1 ] + _arr[(arrlen / 2)]) / 2
		: _arr[(arrlen / 2) | 0 ];
	},

	// cumulative sum of an array
	cumsum : function(arr) {
		var len = arr.length,
			sums = new Array(len),
			i = 1;
		sums[0] = arr[0];
		for (; i < len; i++) {
			sums[i] = sums[i - 1] + arr[i];
		}
		return sums;
	},

	// successive differences of a sequence
	diff : function(arr) {
		var diffs = [],
			arrLen = arr.length,
			i = 1;
		for (i = 1; i < arrLen; i++) {
			diffs.push(arr[i] - arr[i-1]);
		}
		return diffs;
	},

	// mode of an array
	// if there are multiple modes of an array, return all of them
	// is this the appropriate way of handling it?
	mode : function(arr) {
		var arrLen = arr.length,
			_arr = arr.slice().sort(ascNum),
			count = 1,
			maxCount = 0,
			numMaxCount = 0,
			i = 0,
			mode_arr = [];
		for (; i < arrLen; i++) {
			if (_arr[ i ] === _arr[ i + 1 ]) {
				count++;
			} else {
				if (count > maxCount) {
					mode_arr = [ _arr[i] ];
					maxCount = count;
					numMaxCount = 0;
				}
				// are there multiple max counts
				else if (count === maxCount) {
					mode_arr.push(_arr[i]);
					numMaxCount++;
				}

				// resetting count for new value in array
				count = 1;
			}
		}
		return (numMaxCount === 0) ? mode_arr[0] : mode_arr;
	},

	// range of an array
	range : function(arr) {
		return jStat.max(arr) - jStat.min(arr);
	},

	// variance of an array
	// flag indicates population vs sample
	variance : function(arr, flag) {
		return jStat.sumsqerr(arr) / (arr.length - (flag ? 1 : 0));
	},

	// standard deviation of an array
	// flag indicates population vs sample
	stdev : function(arr, flag) {
		return Math.sqrt(jStat.variance(arr, flag));
	},

	// mean deviation (mean absolute deviation) of an array
	meandev : function(arr) {
		var devSum = 0,
			mean = jStat.mean(arr),
			i = arr.length - 1;
		for (; i >= 0; i--) {
			devSum += Math.abs(arr[i] - mean);
		}
		return devSum / arr.length;
	},

	// median deviation (median absolute deviation) of an array
	meddev : function(arr) {
		var devSum = 0,
			median = jStat.median(arr),
			i = arr.length - 1;
		for (; i >= 0; i--) {
			devSum += Math.abs(arr[i] - median);
		}
		return devSum / arr.length;
	},

	// coefficient of variation
	coeffvar : function(arr) {
		return jStat.stdev(arr) / jStat.mean(arr);
	},

	// quartiles of an array
	quartiles : function(arr) {
		var arrlen = arr.length,
			_arr = arr.slice().sort(ascNum);
		return [
			_arr[ Math.round((arrlen) / 4) - 1 ],
			_arr[ Math.round((arrlen) / 2) - 1 ],
			_arr[ Math.round((arrlen) * 3 / 4) - 1 ]
		];
	},

	// covariance of two arrays
	covariance : function(arr1, arr2) {
		var u = jStat.mean(arr1),
			v = jStat.mean(arr2),
			arr1Len = arr1.length,
			sq_dev = new Array(arr1Len),
			i = 0;
		for (; i < arr1Len; i++) {
			sq_dev[i] = (arr1[i] - u) * (arr2[i] - v);
		}
		return jStat.sum(sq_dev) / (arr1Len - 1);
	},

	// population correlation coefficient
	corrcoeff : function(arr1, arr2) {
		return jStat.covariance(arr1, arr2) / jStat.stdev(arr1, 1) / jStat.stdev(arr2, 1);
	}
});

// extend jStat.fn with methods which don't require arguments and work on columns
(function(funcs) {
	for (var i = 0; i < funcs.length; i++) (function(passfunc) {
		// if a matrix is passed, automatically assume operation should be done on the columns
		jStat.fn[ passfunc ] = function(fullbool, func) {
			var arr = [],
				i = 0,
				tmpthis = this;
			// assignment reassignation depending on how parameters were passed in
			if (isFunction(fullbool)) {
				func = fullbool;
				fullbool = false;
			}
			// check if a callback was passed with the function
			if (func) {
				setTimeout(function() {
					func.call(tmpthis, jStat.fn[ passfunc ].call(tmpthis, fullbool));
				}, 15);
				return this;
			}
			// check if matrix and run calculations
			if (this.length > 1) {
				tmpthis = fullbool === true ? this : this.transpose();
				for (; i < tmpthis.length; i++)
					arr[i] = jStat[ passfunc ](tmpthis[i]);
				return fullbool === true ? jStat[ passfunc ](jStat.utils.toVector(arr)) : arr;
			}
			// pass fullbool if only vector, not a matrix. for variance and stdev
			return jStat[ passfunc ](this[0], fullbool);
		};
	})(funcs[i]);
})('sum sumsqrd sumsqerr product min max mean meansqerr geomean median diff mode range variance stdev meandev meddev coeffvar quartiles'.split(' '));

// extend jStat.fn with method for calculating cumulative sums, as it does not run again in case of true
// if a matrix is passed, automatically assume operation should be done on the columns
jStat.fn.cumsum = function(fullbool, func) {
	var arr = [],
		i = 0,
		tmpthis = this;
	// assignment reassignation depending on how parameters were passed in
	if (isFunction(fullbool)) {
		func = fullbool;
		fullbool = false;
	}
	// check if a callback was passed with the function
	if (func) {
		setTimeout(function() {
			func.call(tmpthis, jStat.fn.cumsum.call(tmpthis, fullbool));
		}, 15);
		return this;
	}
	// check if matrix and run calculations
	if (this.length > 1) {
		tmpthis = fullbool === true ? this : this.transpose();
		for (; i < tmpthis.length; i++)
			arr[i] = jStat.cumsum(tmpthis[i]);
		return arr;
	}
	return jStat.cumsum(this[0], fullbool);
};

}(this.jStat, Math));
