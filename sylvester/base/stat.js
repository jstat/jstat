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
 * Class for diplaying matrix with table
 *
 * @param {goog.math.Matrix} m
 *     A matrix to display.
 * @constructor
 */
sylv.stat = function(m) {
	this.m_ = m;
};

sylv.stat.prototype.moment = function(order) {
  var height = this.m_.getSize().height;
  var width = this.m_.getSize().width;
  var res = new sylv.Matrix(height, order);
  for (var i = 0; i < height; i++) {
    var series = this.m_.toArray()[i];
    var row = res.toArray()[i];
    for (var j = 0; j < width; j++) {
      var val = 1;
      for (var ord = 0; ord < order; ord++) {
        val = val*series[j];
        row[ord] = row[ord] + val;
      };
    };
    for (var ord = 0; ord < order; ord++) {
      row[ord] = row[ord]/width;
    };
  };
  return res;
};