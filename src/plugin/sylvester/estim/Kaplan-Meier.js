// Copyright 2011 Florian Pons (florian.pons.tv). All Rights Reserved.
//
// Licensed under the MIT License

/**
 * @fileoverview Class for representing matrices and static helper functions.
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
	sylv.KaplanMeier = function(N, C, T) {
	  this.S = [];
		this.Var = [];
		var s = 1, sVar = 0, n = N;
		var end = Math.max(C[0]==undefined?0:C[0], T[0]==undefined?0:T[0]);
	  for (var i = 0; i<=end; i++) {
			var k;
			//calcul de d(i)
			var d = 0;
			while ((k=T.pop())==i) {
				d++;
			};
			if(k!=undefined) T.push(k);
			s *= n==0?1:(1-d/n);
			sVar += n==0?0:(d/(n*(n-d)));
			this.S[i] = s;
			this.Var[i] = s*s*sVar;
			//calcul de n(i+1)
			n -= d;
			while ((k=C.pop())==i) {
				n--;
			};
			if(k!=undefined) C.push(k);
		}
	};

	sylv.extend(sylv.KaplanMeier, {
		// Returns a string representation of the matrix
		toString: function() {
			return "["+this.S.toString()+"]";
		}
	});
	
	return sylv.KaplanMeier;
});