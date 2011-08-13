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

sylv.loadFile("../jstat/src/core.js");
sylv.loadFile("../jstat/src/distribution.js");
sylv.loadFile("../jstat/src/special.js");
sylv.loadFile("base/matrix.js");
sylv.loadFile("base/stat.js");

