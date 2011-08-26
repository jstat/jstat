// Copyright 2011 Florian Pons (florian.pons.tv). All Rights Reserved.
//
// Licensed under the MIT License

/**
 * @fileoverview Class representant un processus de Makeham.
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
	sylv.Makeham = function(c, g, s) {
	  this.c = c;
	  this.g = g;
		this.s = s;
	};

	sylv.extend(sylv.Makeham, {
		serie: function(size, x0, l0) {
			if(l0==undefined) l0=1;
		  var k = l0/Math.pow(this.g, Math.pow(this.c,x0));
			var res = [l0];
			var si = 1;
		  for (var i = 1; i<size; i++) {
				si *= this.s;
			res[i] = k*si*Math.pow(this.g, Math.pow(this.c,i+x0)) ;
		  };
			var Lt = new sylv.LifeTable();
			Lt.setL(res);
			return Lt;
		},

		toString: function() {
			return this.c+","+this.g+","+this.s;
		}
	});
	
	return sylv.Makeham;
});