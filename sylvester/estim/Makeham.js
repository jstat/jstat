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
 * @fileoverview Classe d'évaluation de coefficients de la formule de Makeham.
 *
 *
 */

/**
 * Fonction d'évaluation de coefficients de la formule de Makeham.
 *
 * @param {integer} date de demarrage de P
 * @param {LifeTable} Taux annuel de vitalité au dates x, x+1, x+2 ...
 * @constructor
 */
function MakehamEstim(x, L) {
	var P = L.P;
	var n = Math.floor(P.length/3);
	var A = [0,0,0];
  for (var i = 0; i<3; i++) {
		for (var j = 0; j<n; j++) {
			A[i] += Math.log(P[i*n+j]);
		}
	};
	this.c = Math.exp(Math.log((A[1]-A[2])/(A[0]-A[1]))/n);
	var cn_1 = Math.pow(this.c,n)-1;
	var V = (A[1]-A[0])/cn_1;
	this.g = Math.exp(V/(Math.pow(this.c,x)*cn_1));
	this.s = Math.exp((A[0]-V)/n)
	this.ec = 0;
	this.eg = 0;
	this.es = 0;
	this.A = [];
	this.SA = 0;
	this.lP = [];
	this.SAlP = 0;
	this.SAlP2 = 0;
	for (var i = 0; i<P.length; i++) {
		var a = L.L[i]*L.P[i]/L.Q[i];
		var lp = Math.log(L.P[i]);
		this.A.push(a);
		this.lP.push(lp);
		this.SA += a;
		this.SAlP += a*lp;
		this.SAlP2 += a*lp*lp;
	};
	this.getCompCLast = {};
};

// Calculate f components with c values
MakehamEstim.prototype.getCompC = function(c) {
	if (this.getCompCLast.c != c) {
		this.getCompCLast.AxCx = 0;
		this.getCompCLast.AxlPCx = 0;
		this.getCompCLast.AxC2x = 0;
		for (var i = this.A.length-1; i>-1; i--) {
			
		};
	};
	return this.getCompCLast
};

// Returns a process representation of the serie
MakehamEstim.prototype.improveValues = function() {
	bfgs = new BTFS(1,1,new Matrix([[this.c], [this.g], [this.s]]));
};

// Returns a process representation of the serie
MakehamEstim.prototype.getProcess = function() {
	return new Makeham(this.c+this.ec, this.g+this.eg, this.s+this.es);
};