// Copyright 2011 Florian Pons (florian.pons.tv). All Rights Reserved.
//
// Licensed under the MIT License

/**
 * @fileoverview Classe d'implementation de la m�thode Golden Section de recherche de minimal.
 *
 *
 */

/**
 * Class to generate Gaussian random number
 *
 * @param {integer} nombre d'individus
 * @param {array[integer]} date des resiliation ordonn� par ordre decroissant
 * @param {array[integer]} date des morts ordonn� par ordre decroissant
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