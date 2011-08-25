// Copyright 2011 Florian Pons (florian.pons.tv). All Rights Reserved.
//
// Licensed under the MIT License

/**
 * @fileoverview Class for representing matrices and static helper functions.
 *
 *
 */
that = this;
require(["plugin/sylvester/sylv", "plugin/sylvester/ui/ui"], function() {

that.exportAll = function() {
	document.getElementById("consoleIn").value = sylv.ui.extractAll();
};
that.historyNavAll = function() {
	document.getElementById("consoleIn").value = historyNav.buff.join(";\n//////////////////////\n");
};
sylv.ui.print = function(val, nl) {
	var txt = val?val.toString():"";
	var cnsl = document.getElementById("consoleOut"+print.nb);
	cnsl.innerHTML=txt.replace(/\n/g,"<br/>")+(nl?"<br/>":"")+cnsl.innerHTML; 
};
that.print = function(val) {if(val) sylv.ui.print(val, true)};
print.nb = 0;
that.execute = function() {
	var cmd = document.getElementById("consoleIn");
	$("#consoleOut"+print.nb).before('<div id="consoleOut'+(++print.nb)+'"></div>');
	sylv.ui.print("<hr/>", false);
	try {
		print(eval(consoleIn.getValue()));
	} catch(e) {
		print("<span style='color:red'>"+e+"</span>");
	};
	historyNav.buff[historyNav.buff.length-1]=consoleIn.getValue();
	consoleIn.setValue("");
	historyNav.buff.push("");
	historyNav.pos = historyNav.buff.length-1;
};
that.historyNav = function(inst, e) {
	if(e.shiftKey && e.type=="keydown") switch(e.keyCode) {
		case 38:
			if(historyNav.pos==historyNav.buff.length-1) historyNav.buff[historyNav.pos]=consoleIn.getValue();
			historyNav.pos--;
			if(historyNav.pos<0) historyNav.pos=0;
			consoleIn.setValue(historyNav.buff[historyNav.pos]);
			break;
		case 40:
			historyNav.pos++;
			if(historyNav.pos>historyNav.buff.length-1) historyNav.pos=historyNav.buff.length-1;
			consoleIn.setValue(historyNav.buff[historyNav.pos]);
			break;
	};
};
historyNav.pos = 0;
historyNav.buff = [""];
that.plot = function(vals, optIfNotMatrix) {
	$("#consoleOut"+print.nb).before('<div id="consoleOut'+(++print.nb)+'" style="width:'+windowWidth+'px;height:300px;"></div>');
	if (optIfNotMatrix == undefined) {
		var arr = jStat.fn.toArray(vals);
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
that.onResize = function() {
	windowWidth = $(window).width()-70;
	$("#consoleIn").width(windowWidth);
	$("#consoleOut*").width(windowWidth);
};
$(window).resize(onResize);

$(document).ready(function() {
	consoleIn = CodeMirror.fromTextArea(document.getElementById("consoleIn"), {
		indentWithTabs: true,
		mode:  "javascript",
		matchBrackets: true,
		onKeyEvent: historyNav,
		theme: "default"
	});
	onResize();
});

});
