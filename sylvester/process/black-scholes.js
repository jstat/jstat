// Copyright 2011 Florian Pons (florian.pons.tv). All Rights Reserved.
//
// Licensed under the MIT License

/**
 * @fileoverview Class for representing matrices and static helper functions.
 *
 *
 */

/**
 * Class to generate Gaussian random number
 *
 * @param {float} a average
 * @param {float} d standard deviation
 * @constructor
 */
function BlackScholes(average, deviation) {
	//goog.base(this);
  this.mu = average;
  this.sigma = deviation;
};

BlackScholes.prototype.serie = function(size, initValue) {
  var res = [];
  res[0] = initValue;
  var gauss = new Gaussian(this.mu, this.sigma);
  for (var i = 1; i<size; i++) {
    res[i] = res[i-1]*gauss.boxMullerNext();
  };
	return new Matrix([res]);
};
