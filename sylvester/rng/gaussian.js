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
function Gaussian(average, deviation) {
	//goog.base(this);
  this.a_ = average;
  this.d_ = deviation;
  this.nbm = false;
};

Gaussian.normalCentralLimit = function() {
  var res = -6.0;
  for (var i = 0; i<12; i++) {
    res += Math.random();
  };
	return res;
};

Gaussian.normalBoxMuller = function(allVal) {
  if (typeof allVal == "undefined") allVal = false;
  var res = [];
  var s;
  do {
    res[0] = Math.random()*2.0-1.0;
    res[1] = Math.random()*2.0-1.0;
    s = res[0]*res[0]+res[1]*res[1]
  } while (s>=1.0 || s==0.0);
  s = Math.sqrt(-2.0*Math.log(s)/s);
  res[0] = res[0]*s;
  res[1] = res[1]*s;
	if(allVal) return res;
  else return res[0];
};

Gaussian.boxMullerNext = function() {
  if (this.nbm == false) {
    var rand = Gaussian.normalBoxMuller(true);
    this.nbm = rand[1];
    return this.a_ + rand[0]*this.d_;
  } else {
    var res = this.nbm;
    this.nbm = false;
    return this.a_ + res*this.d_;
  }
};


Gaussian.prototype.serie = function(size) {
  var res = [];
  var nbIter = Math.floor(size/2);
  for (var i = 0; i<nbIter; i++) {
    var rand = Gaussian.normalBoxMuller(true);
    res[i*2] = this.a_ + rand[0]*this.d_;
    res[i*2+1] = this.a_ + rand[1]*this.d_;
  };
  if(nbIter*2 < size) res[size-1] = this.a_ + Gaussian.normalBoxMuller()*this.d_;
	return new Matrix([res]);
};
