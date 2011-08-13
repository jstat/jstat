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
function exportAll() {
	document.getElementById("consoleIn").value = sylv.ui.extractAll();
};
function historyNavAll() {
	document.getElementById("consoleIn").value = historyNav.buff.join(";\n//////////////////////\n");
};
sylv.ui.print = function(val, nl) {
	var txt = val?val.toString():"";
	var cnsl = document.getElementById("consoleOut"+print.nb);
	cnsl.innerHTML=txt.replace(/\n/g,"<br/>")+(nl?"<br/>":"")+cnsl.innerHTML; 
};
function print(val) {if(val) sylv.ui.print(val, true)};
print.nb = 0;
function execute() {
	var cmd = document.getElementById("consoleIn");
	$("#consoleOut"+print.nb).before('<div id="consoleOut'+(++print.nb)+'"></div>');
	sylv.ui.print("<hr/>", false);
	print(eval(cmd.value));
	historyNav.buff[historyNav.buff.length-1]=cmd.value;
	cmd.value = "";
	historyNav.buff.push("");
	historyNav.pos = historyNav.buff.length-1;
};
function historyNav(e) {
	switch(e.keyCode) {
		case 38:
			var cmd = document.getElementById("consoleIn");
			if(historyNav.pos==historyNav.buff.length-1) historyNav.buff[historyNav.pos]=cmd.value;
			historyNav.pos--;
			if(historyNav.pos<0) historyNav.pos=0;
			cmd.value = historyNav.buff[historyNav.pos];
			break;
		case 40:
			var cmd = document.getElementById("consoleIn");
			historyNav.pos++;
			if(historyNav.pos>historyNav.buff.length-1) historyNav.pos=historyNav.buff.length-1;
			cmd.value = historyNav.buff[historyNav.pos];
			break;
	};
};
historyNav.pos = 0;
historyNav.buff = [""];
function plot(vals, optIfNotMatrix) {
	$("#consoleOut"+print.nb).before('<div id="consoleOut'+(++print.nb)+'" style="width:'+windowWidth+'px;height:300px;"></div>');
	if (optIfNotMatrix == undefined) {
		var arr = Matrix.ToArray(vals);
		var data = [];
		var size = arr[0].length;
		for (var i = 1; i<arr.length; i++) {
			var ligne = [];
			for (var j = 0; j<size; j++) {
				ligne.push([arr[0][j],arr[i][j]]);
			};
			data.push(ligne);
		};
		jStat.flot("#consoleOut"+print.nb, data, {rawData: true});
	} else {
		jStat.flot("#consoleOut"+print.nb, vals, optIfNotMatrix);
	};
	return ""
};
function onResize() {
	windowWidth = $(window).width()-70;
	$("#consoleIn").width(windowWidth);
	$("#consoleOut*").width(windowWidth);
};
$(window).resize(onResize);
