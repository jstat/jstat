// Copyright 2011 Florian Pons (florian.pons.tv). All Rights Reserved.
//
// Licensed under the Cecill License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.cecill.info/licences/Licence_CeCILL_V2-en.txt
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

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
