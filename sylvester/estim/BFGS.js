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
 * @fileoverview Classe d'implementation de la m�thode Broyden-Fletcher-Goldfarb-Shanno.
 *
 *
 */

/**
 * Class to generate Gaussian random number
 *
 * @param {fonction} fonction � �tudier
 * @param {fonction} gradient de la fonction (sous forme de matrice colonne)
 * @param {array[integer]} point de depart
 * @constructor
 */
function BTFS(F, Delta, x0) {
  this.f = F;
	this.D = Delta;
	this.x0 = x0;
	this.mu = 0.9;
};

// Returns a string representation of the matrix
BTFS.prototype.nextStep = function() {
	// definition de la r�f�rence, � passer dans une fonction lambda
	var that = this;
	// calcule des valeurs au point courrant
	var fx = this.f(this.x0);
	var df = this.D(this.x0);
	var S = this.s;
	var X = this.x0.add(S);
	// initialisation ou calcul du prochain B
	if (this.B == undefined) {
		this.B = Matrix.I(df.rows());
	} else {
		var Y = this.D(X).subtract(df);
		var sy = S.transpose().x(Y);
		this.B = this.B.add(S.x((sy+Y.transpose().x(this.B).x(S))/(sy*sy)).x(S.transpose())).subtract(this.B.x(S).x(Y.transpose()).add(S.x(Y.transpose().x(this.B))).x(sy));
		this.x0 = X;
	};
	var p = this.B.x(df.x(-1));
	var gs = new GoldenSection(0, 5, function(a) {return that.f(that.x.add(p.x(a)))});
	var d = this.mu*df.transpose().x(p);
	while (gs.nextStep() > fx+gs.a*d);
	this.s = p.x(gs.a);
	return gs.fa;
};