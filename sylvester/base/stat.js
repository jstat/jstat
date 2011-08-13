// Copyright 2011 Florian Pons (florian.pons.tv). All Rights Reserved.
//
// Licensed under the MIT License

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