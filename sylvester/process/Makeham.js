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