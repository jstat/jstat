// Copyright 2011 Florian Pons (florian.pons.tv). All Rights Reserved.
//
// Licensed under the MIT License

/**
 * @fileoverview Class for representing matrices and static helper functions.
 *
 *
 */

define(["plugin/sylvester/sylv"],function(sylv) { 
	sylv.ui = function() {};

	if(window.location.origin.substr(0,4)=="file" | window.location.origin.substr(0,4)=="http") {
		function glb(name, val) {
			if(val == undefined) {
				switch(sylv.ui.types[name]) {
					case "macro":
						return eval(glb[name]);
					default:
						return glb[name];
				};
			} else {
				glb[name] = val;
				sylv.ui.print(name+":"+glb[name].toString());
				eval(name+"=glb['"+name+"'];");
				return glb[name];
			};
		};
	};

	sylv.ui.print = function() {
		alert("Affichage not defined");
	};

	sylv.ui.extractAll = function() {
		var res = "";
		for (name in glb) {
			var type = glb[name].constructor.name;
			if(type=="String") {
				res += "glb('"+name+"',\n'"+glb[name].toString()+"'\n);\n";
			} else {
				res += "glb('"+name+"',new "+type+"(\n"+glb[name].toString()+"\n));\n";
			};
		};
		return res;
	};

	/**
	 * Creates a matrix from a string
	 * @param {string} str The string representing a matrix.
	 * @return {!sylv.Matrix} The new matrix.
	 */
	sylv.ui.MatrixfromString = function(str) {
		var reg = new RegExp("[ ]*[[]+[ ]*","g");
		res = str.replace(reg, "");
		var reg = new RegExp("[ \\n]*[\\]]+[ \n]*","g");
		var res = res.split(reg);
		var last = res.pop();
		if (last != "") res[res.length] = last;
		reg = new RegExp("[ ]+","g");
		for (var i = 0; i < res.length; i++) {
			res[i] = res[i].split(reg);
			res[i] = res[i].map(parseFloat);
		};
		return jStat(res);
	};
	
	return sylv.ui;
});