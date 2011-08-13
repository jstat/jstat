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
Csv = function(mtx, txt) {
	this.m = mtx;
	this.t = txt;
};

Csv.prototype.parse = function(txt) {
	var data = txt.split(/\n/g);
	for (var i = 0; i < data.length; i++) {
	  data[i] = data[i].split(/,/g);
	  data[i] = data[i].map(parseFloat);
	};
	this.m = new sylv.Matrix(data);
	this.t = txt;
};

Csv.prototype.save = function(mtx) {
	var txt = '';
	for (var i = 0; i < mtx.getSize().height; i++) {
		txt += '\n';
	}
	this.t = txt;
	this.m = mtx;
};
