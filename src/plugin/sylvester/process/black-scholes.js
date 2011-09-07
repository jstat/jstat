// Copyright 2011 Florian Pons (florian.pons.tv). All Rights Reserved.
//
// Licensed under the MIT License

/**
 * @fileoverview Class for representing matrices and static helper functions.
 *
 *
 */
 
define(["plugin/sylvester/sylv"],function(sylv) {
	/**
	 * Class to generate Gaussian random number
	 *
	 * @param {float} a average
	 * @param {float} d standard deviation
	 * @constructor
	 */
	sylv.BlackScholes = function(average, deviation) {
		//goog.base(this);
	  this.mu = average;
	  this.sigma = deviation;
	};

	sylv.extend(sylv.BlackScholes, {
		serie: function(size, initValue) {
		  var res = [];
		  res[0] = initValue;
		  var gauss = new Gaussian(this.mu, this.sigma);
		  for (var i = 1; i<size; i++) {
			res[i] = res[i-1]*gauss.boxMullerNext();
		  };
			return jStat([res]);
		}
	});
	
	return sylv.BlackScholes;
});
