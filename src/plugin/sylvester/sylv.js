// Copyright 2011 Florian Pons (florian.pons.tv). All Rights Reserved.
//
// Licensed under the MIT License

/**
 * @fileoverview Class for representing matrices and static helper functions.
 *
 *
 */
 
define(["main"], function() {
	sylv = function() { };

	sylv.loadFile = function(name) {
		if(sylv.loadFile.path==undefined) {
			var scripts = document.getElementsByTagName('script');
			for (var i = 0, ln = scripts.length; i < ln; i++) {
				var scriptSrc = scripts[i].src;
				var match = scriptSrc.match(/sylv\.js$/);
				if (match) {
					sylv.loadFile.path = scriptSrc.substring(0, scriptSrc.length - match[0].length);
					break;
				};
			};
		};
		document.write('<script type="text/javascript" src="' + sylv.loadFile.path + name + '"></script>');
	};

	sylv.extend = function(obj, methodes) {
		for(var mth in methodes) {
			obj.prototype[mth] = methodes[mth];
			obj[mth] = function(that) {
				return methodes[mth].apply(that,Array.prototype.slice.call(arguments, 1))
			};
		}
		return obj;
	};
	
	return sylv;

});
