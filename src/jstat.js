/**
 * @fileOverview
 * jStat - Statistical Package
 * Copyright (c) 2010, Trevor Norris
 * This document is licensed as free software under the terms of the
 * MIT License: http://www.opensource.org/licenses/mit-license.php
 * @author Trevor Norris, trev.norris@gmail.com
 */
(function(){

/**
 * Javascript Statistical Package
 * @namespace JavaScript Statistical Analysis Package
 */
var jStat = {
// ### Want to add option for arbitrarily long numbers
// ### Employ ability to create function based on js engine. (e.g. IE handles
//  Math.min.apply(this,[]) much faster than for() loop. ###

	/**
	 * Sum of an array
	 * @example
	 * jStat.sum([1,2,3])
	 */
	sum: function(arr){
		var sum = 0,
			i = arr.length - 1;
		for(i; i >= 0; i--){
			sum += arr[i];
		};
		return sum;
	},

	/**
	 * Minimum value of an array
	 * @example
	 * jStat.min([1,2,3])
	 */
	min: function(arr){
		var min = arr[0],
			i = arr.length - 1;
		for(i; i >= 0; i--){
			if(arr[i] < min){
				min = arr[i];
			};
		};
		return min;
	},

	/**
	 * Maximum value of an array
	 * @example
	 * jStat.max([1,2,3])
	 */
	max: function(arr){
		var max = arr[0],
			i = arr.length - 1;
		for(i; i >= 0; i--){
			if(arr[i] > max){
				max = arr[i];
			};
		};
		return max;
	},

	/**
	 * Mean value of an array
	 * @example
	 * jStat.mean([1,2,3])
	 */
	mean: function(arr){
		return jStat.sum(arr) / arr.length;
	},

	/**
	 * Median of an array
	 * @example
	 * jStat.median([1,2,3,4,5,6])
	 */
	median: function(arr){
		var arrsort = arr.sort(function(a, b){return a - b;}),
			arrlen = arr.length,
			median;
		if(arrlen % 2 === 0){
			median = (arrsort[(arrlen / 2) - 1] + arrsort[(arrlen / 2)]) / 2;
		}else{
			median = arrsort[Math.floor(arrlen / 2)];
		};
		return median;
	},

	/**
	 * Mode of an array
	 * @example
	 * jStat.mode([1,2,2,3,3,3,3])
	 */
	mode: function(arr){
		var arrSort = arr.sort(function(a, b){return a - b;}),
			arrLen = arr.length,
			count = 1,
			maxCount = 0,
			numMaxCount = 0,
			maxNum,
			i;

		for(i = 0; i < arrLen; i++){
			if(arrSort[i] === arrSort[i + 1]){
				count++;
			}else{
				if(count > maxCount){
					maxNum = arrSort[i];
					maxCount = count;
					count = 1;
					numMaxCount = 0;
				}else{
					
					// Are there multiple max counts
					if(count === maxCount){
						numMaxCount++;
					
					// Count is less than max count, so reset values
					}else{
						count = 1;
					};
				};
			};
		};
		
		if(numMaxCount === 0){
			return maxNum;
		}else{
			return false;
		};
	},

	/**
	 * Range of an array
	 * @example
	 * jStat.range([1,6,5,3,8,6])
	 */
	range: function(arr){
		var arrsort = arr.sort(function(a, b){return a - b;});
		return arrsort[arrsort.length - 1] - arrsort[0];
	},

	/**
	 * Variance of an array
	 * @example
	 * jStat.variance([1,6,8,5,4,9,5,3])
	 */
	variance: function(arr){
		var mean = jStat.mean(arr),
			stSum = 0,
			i = arr.length - 1;
		for(i; i >= 0; i--){
			stSum += Math.pow((arr[i] - mean), 2);
		};
		return stSum / (arr.length - 1);
	},

	/**
	 * Standard deviation of an array
	 * @example
	 * jStat.stdev([4,5,9,7,5,3,4])
	 */
	stdev: function(arr){
		return Math.sqrt(jStat.variance(arr));
	},

	/**
	 * Mean deviation (Mean Absolute Deviation) of an array
	 * @example
	 * jStat.meandev([4,9,8,6,5,3,7,5])
	 */
	meandev: function(arr){
		var devSum = 0,
			mean = jStat.mean(arr),
			i = arr.length - 1;
		for(i; i >= 0; i--){
			devSum += Math.abs(arr[i] - mean);
		};
		return devSum / arr.length;
	},

	/**
	 * Median deviation (Median Absolute Deviation) of an array
	 * @example
	 * jStat.meddev([4,9,8,6,5,3,7,5])
	 */
	meddev: function(arr){
		var devSum = 0,
			median = jStat.median(arr),
			i = arr.length - 1;
		for(i; i >= 0; i--){
			devSum += Math.abs(arr[i] - median);
		};
		return devSum / arr.length;
	},

	/**
	 * Factoral of n
	 * @example
	 * jStat.factorial(5)
	 */
	factorial: function(n){
		var fval = 1;
		for(n; n > 0; n--){
			fval *= n;
		};
		return fval;
	},

	/**
	 * Combinations of n,m
	 * @example
	 * jStat.combination(10,4)
	 */
	combination: function(n, k){
		return (jStat.factorial(n) / jStat.factorial(k)) / jStat.factorial(n - k);
	},

	/**
	 * Permutations of n,m
	 * @example
	 * jStat.permutation(10,4)
	 */
	permutation: function(n ,r){
		return jStat.factorial(n) / jStat.factorial(n - r);
	},

	/**
	 * Gamma of x
	 * @example
	 * jStat.gamma(.5)
	 */
	gamma: function(x){
		var v = 1,
			w;
		if(x != Math.floor(x)){
			while(x < 8){
				v *= x;
				x++;
			};
			w = 1 / (x * x);
			return Math.exp((((((((-3617 / 122400 * w + 7 / 1092) * w - 691 / 360360) * w + 5 / 5940) * w - 1 / 1680)  * w + 1 / 1260) * w - 1 / 360) * w + 1 / 12) / x + 0.5 * Math.log(2 * Math.PI) - Math.log(v) - x + (x - 0.5) * Math.log(x));
		}else{
			return jStat.factorial(x - 1);
		};
	},

// #########################################
// ### Beyond this hasn't been optimized ###
// #########################################

	/**
	 * Quartiles of an array
	 * @example
	 * jStat.quartiles([1,2,3,6,9,3,1,2,5])
	 */
	quartiles: function(arr){
		var arrsort = arr.sort(function(a, b){return a - b;});
		return [arrsort[Math.round((arrsort.length) / 4) - 1], arrsort[Math.round((arrsort.length) / 2) - 1], arrsort[Math.round((arrsort.length) * 3 / 4) - 1]];
	},

	/**
	 * Covariance of two arrays
	 * @example
	 * jStat.covariance([1,2,3,6,9,3,1,2,5],[2,3,5,2,5,7,8,9,6])
	 */
	covariance: function(arr1, arr2){
		var u = jStat.mean(arr1),
			v = jStat.mean(arr2),
			sq_dev = [],
			arr1Len = arr1.length,
			i;
		for(i = 0; i < arr1Len; i++){
			sq_dev[i] = (arr1[i] - u) * (arr2[i] - v);
		};
		return jStat.sum(sq_dev) / arr1Len;
	},

	/**
	 * Correlation coefficient of two arrays
	 * @example
	 * jStat.corr_coeff([1,2,3,6,9,3,1,2,5],[2,3,5,2,5,7,8,9,6])
	 */
	corr_coeff: function(arr1, arr2){
		return jStat.covariance(arr1,arr2) / jStat.stdev(arr1) / jStat.stdev(arr2);
	},

	/**
	 * Probability of (x<.5) of uniform distibution with parameters 0,2
	 * @example
	 * jStat.uniformcdf(0,2,.5)
	 */
	uniformcdf: function(a, b, x){
		if(x < a){
			return 0;
		}else{
			if(x < b){
				return (x - a) / (b - a);
			};
		};
		return 1;
	},

	/**
	 * Probability of (x=2) of binomial distribution of 5 trials with probability 1/2
	 * @example
	 * jStat.binomial(5,1/2,2)
	 */
	binomial: function(n, p, k){
		return this.combination(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k);
	},

	/**
	 * Probability of (x<=2) of binomial distribution of 5 trials with probability 1/2
	 * @example
	 * jStat.binomialcdf(5,1/2,2)
	 */
	binomialcdf: function(n, p, x){
		if(x < 0){
			return 0;
		};
		var binomarr = [];
		for(var k=0; k < n; k++){
			binomarr[k] = this.binomial(n, p, k);
		};
		if(x < n){
			var sum = 0;
			for(var i = 0; i <= x; i++){
				sum += binomarr[i];
			};
			return sum;
		};
		return 1;
	},

	/**
	 * Probability of exactly 1 success before 2nd failure of an event with probability 1/2
	 * @example
	 * jStat.negbin(2,1/2,1)
	 */
	negbin: function(r, p, x){
		if(x != Math.floor(x)){
			return false;
		};
		if(x < 0){
			return 0;
		}else{
			return this.combination(x + r - 1, r - 1) * Math.pow(p, r) * Math.pow(1 - p, x);
		};
	},

	/**
	 * Probability of 1 success or less before 2nd failure of an event with probability 1/2
	 * @example
	 * jStat.negbincdf(2,1/2,1)
	 */
	negbincdf: function(n, p, x){
		if(x < 0){
			return 0;
		};
		var sum = 0;
		for(var k = 0; k <= x; k++){
			sum += this.negbin(n, p, k);
		};
		return sum;
	},

	/**
	 * Probability of selecting 5 items of a type from 50 items in 10 trials if 25 items are of the type
	 * @example
	 * jStat.hypgeom(50,25,10,5)
	 */
	hypgeom: function(N, m, n, x){
		if(x != Math.floor(x)){
			return false;
		};
		if(x < 0){
			return 0;
		}else{
			return this.combination(m, x) * this.combination((N - m), n - x) / this.combination(N, n);
		};
	},

	/**
	 * Probability of selecting 5 or less items of a type from 50 items in 10 trials if 25 items are of the type
	 * @example
	 * jStat.hypgeomcdf(50,25,10,5)
	 */
	hypgeomcdf: function(N, m, n, x){
		if(x < 0){
			return 0;
		};
		var sum = 0;
		for(var k = 0; k <= x; k++){
			sum += this.hypgeom(N, m, n, k);
		};
		return sum;
	},

	/**
	 * Probability an exponentially distributed variable with parameter l=.5 is less than 2
	 * @example
	 * jStat.exponentialcdf(.5,2)
	 */
	exponentialcdf: function(l, x){
		return 1 - Math.exp(-1 * x);
	},

	/**
	 * Probability a possion variable with parameter l=2 is less than or equal to 3
	 * @example
	 * jStat.poisson(2,3)
	 */
	poisson: function(l, x){
		return Math.pow(l, x) * Math.exp(-l) / this.factorial(x);
	},

	/**
	 * Calculate Poisson distribution cumulative probability with parameter l=2 is less than or equal to 3
	 * @example
	 * jStat.poissoncdf(2,3)
	 */
	poissoncdf: function(l, x){
		if(x < 0){
			return 0;
		};
		var sum = 0;
		for(var k = 0; k <= x; k++){
			sum += this.poisson(l, k);
		};
		return sum;
	},

	/**
	 * Find the numerical integral of sin(x^2) from 0,5 to 1e-15
	 * @example
	 * jStat.asr(function (x){return Math.sin(x*x)},0,5,15)
	 */
	asr: function(f, a, b, eps){
		var c = (a+b)/2,
			h = (b-a)/6,
			fa = f(a),
			fb = f(b),
			fc = f(c),
			recursive_asr = function(f, a, b, c, eps, sum, fa, fb, fc){
				var cl = (a+c)/2,
					cr = (c+b)/2,
					h = (c-a)/6,
					fcr = f(cr),
					fcl = f(cl),
					left = (fa+4*fcl+fc)*h,
					right = (fc+4*fcr+fb)*h;
				if(Math.abs(left + right - sum) <= 15 * eps){
					return left + right + (left + right - sum) / 15;
				};
				return arguments.callee(f, a, c, cl, eps/2, left, fa, fc, fcl) + arguments.callee(f, c, b, cr, eps/2, right, fc, fb, fcr);
			};
		return parseFloat((recursive_asr(f, a, b, c, eps, h * (fa + fb + 4 * fc), fa, fb, fc)).toFixed(eps));
	},

	/**
	 * Approximate the derivative of f(x)=x^3-5 at the point 2 using step size of 1e-3
	 * @example
	 * jStat.fivept(function (x){return x*x*x-5},2,1e-3)
	 */
	fivept: function(func, x, h){
		return (-func(x + h * 2) + 8 * func(x + h) - 8 * func(x - h) + func(x - h * 2)) / h / 12;
	},


// #####################################################
// ### Things below this line haven't been completed ###
// #####################################################

	/**
	 * Reduct and array of length n to m, and generate a second array of stdev's for each interval with sig * sigma
	 * @example
	 * jStat.areduct([1,2,3,4,5,6,7,8],4,1)
	 */
	areduct: function(arr, len, sig){



	}
};

// Exposing jStat
window.jStat = jStat;

})(window);