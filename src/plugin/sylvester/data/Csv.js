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
	 * Creates a matrix from a string
	 * @param {string} path The string representing a matrix.
	 * @return {!goog.math.Matrix} The new matrix.
	 */
	sylv.Csv = function(mtx, txt) {
		this.m = mtx;
		this.t = txt;
	};

	sylv.extend(sylv.Csv, {
		parse: function(txt) {
			var data = txt.split(/\n/g);
			for (var i = 0; i < data.length; i++) {
			  data[i] = data[i].split(/,/g);
			  data[i] = data[i].map(parseFloat);
			};
			this.m = jStat(data);
			this.t = txt;
		},

		save: function(mtx) {
			var txt = '';
			for (var i = 0; i < mtx.getSize().height; i++) {
				txt += '\n';
			}
			this.t = txt;
			this.m = mtx;
		}
	});
	
	return sylv.Csv;
});
