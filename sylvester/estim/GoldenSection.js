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
 * @fileoverview Classe d'implementation de la méthode Golden Section de recherche de minimal.
 *
 *
 */

/**
 * Class to generate Gaussian random number
 *
 * @param {integer} nombre d'individus
 * @param {array[integer]} date des resiliation ordonné par ordre decroissant
 * @param {array[integer]} date des morts ordonné par ordre decroissant
 * @constructor
 */
function GoldenSection(x0, x1, fct) {
  this.f = fct;
	this.x0 = x0;
	this.x1 = x1;
	this.phi = (1+Maht.sqrt(5))/2;
	this.x2 = x0+(x1-x0)/(1+this.phi);
	this.a = this.x2
	this.fa = fct(this.a);
};

// Calculate the next step and return the value of the function at the new point.
GoldenSection.prototype.nextStep = function() {
	var x = this.x2+this.phi*(this.x2-this.x1);
	var fa = this.f(x);
	if(fa<this.fa) {
		this.fa = fa;
		this.a = x;
		this.x0 = this.x2;
		this.x2 = x;
	} else {
		this.x1 = x;
	};
	return this.fa;
};