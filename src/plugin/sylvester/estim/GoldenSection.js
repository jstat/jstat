// Copyright 2011 Florian Pons (florian.pons.tv). All Rights Reserved.
//
// Licensed under the MIT License

/**
 * @fileoverview Classe d'implementation de la m�thode Golden Section de recherche de minimal.
 *
 *
 */

define(["plugin/sylvester/sylv"],function(sylv) {
	/**
	 * Class to generate Gaussian random number
	 *
	 * @param {integer} nombre d'individus
	 * @param {array[integer]} date des resiliation ordonn� par ordre decroissant
	 * @param {array[integer]} date des morts ordonn� par ordre decroissant
	 * @constructor
	 */
	sylv.GoldenSection = function(x0, x1, fct) {
		this.f = fct;
		this.x0 = x0;
		this.x1 = x1;
		this.phi = 1/(1+(1+Math.sqrt(5))/2);
		this.x2 = x0+(x1-x0)*this.phi;
		this.a = this.x2
		this.fa = fct(this.a);
	};
	
	sylv.extend(sylv.GoldenSection, {
		// Calculate the next step and return the value of the function at the new point.
		nextStep: function() {
			var x = this.x2+this.phi*(this.x1-this.x2);
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
		}
	});
	
	return sylv.GoldenSection;
});