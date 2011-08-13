// Copyright 2011 Florian Pons (florian.pons.tv). All Rights Reserved.
//
// Licensed under the MIT License

/**
 * @fileoverview Class representant un processus de Makeham.
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
function Makeham(c, g, s) {
  this.c = c;
  this.g = g;
	this.s = s;
};

Makeham.prototype.serie = function(size, x0, l0) {
  var k = l0/Math.pow(this.g, Math.pow(this.c,x0));
  for (var i = 1; i<size; i++) {
    res[i] = k*Math.pow(this.s,i)*Math.pow(this.g, Math.pow(this.c,i+x0)) ;
  };
	return res;
};

Makeham.prototype.toString = function() {
	return this.c+","+this.g+","+this.s;
};