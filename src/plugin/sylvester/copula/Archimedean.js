// Copyright 2011 Florian Pons (florian.pons.tv). All Rights Reserved.
//
// Licensed under the MIT License

/**
 * @fileoverview Classe representing Archimedean Copula.
 *
 *
 */

define(["plugin/sylvester/sylv"],function(sylv) {
	/**
	 * Class to generate Gaussian random number
	 *
	 * @param {function} generator
	 * @constructor
	 */
	sylv.ArchimedeanCopula = function(phi, phiInv) {
		this.phi = phi;
		this.phiInv = phiInv;
	};
	
	sylv.extend(sylv.ArchimedeanCopula, {
		// Calculate the next step and return the value of the function at the new point.
		CDF: function() {
			var i=0, cdf=0;
			for(i; i<arguments.length; i++) {
				cdf += this.phiInv(arguments[i]);
			};
			cdf = this.phi(cdf)
			return cdf;
		}
	});
	
	return sylv.ArchimedeanCopula;
});