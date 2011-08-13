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
 * Creates a matrix from a string
 * @param {string} path The string representing a matrix.
 * @return {!goog.math.Matrix} The new matrix.
 */
LifeTable = function() {
	this.L = [1];
};

LifeTable.prototype.setP = function(P) {
	this.P = P;
	this.L = [this.L[0]];
	this.Q = [];
	for (var i = 0; i < P.length; i++) {
	  this.L.push(this.L[i]*P[i]);
	  this.Q.push(1-P[i]);
	};
};

LifeTable.prototype.setQ = function(Q) {
	this.Q = Q;
	this.L = [this.L[0]];
	this.P = [];
	for (var i = 0; i < Q.length; i++) {
	  this.P.push(1-Q[i]);
		this.L.push(this.L[i]*this.P[i]);
	};
};

LifeTable.prototype.setL = function(L) {
	this.L = L;
	this.P = [];
	this.Q = [];
	for (var i = 1; i < L.length; i++) {
	  this.P.push(this.L[i]/this.L[i-1]);
	  this.Q.push(1-this.P[i]);
	};
};

LifeTable.prototype.setL0 = function(L0) {
	this.L = [L0];
	for (var i = 0; i < this.P.length; i++) {
	  this.L.push(this.L[i]*P[i]);
	};
};
