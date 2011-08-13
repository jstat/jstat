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
 * @param {integer} nombre d'individus
 * @param {array[integer]} date des resiliation ordonné par ordre decroissant
 * @param {array[integer]} date des morts ordonné par ordre decroissant
 * @constructor
 */
function KaplanMeier(N, C, T) {
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

// Returns a string representation of the matrix
KaplanMeier.prototype.toString = function() {
	return "["+this.S.toString()+"]";
};