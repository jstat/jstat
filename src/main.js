// Copyright 2011 Florian Pons (florian.pons.tv). All Rights Reserved.
//
// Licensed under the MIT License

mainThat = this
define(["core", "distribution", "special"], function() {
	mainThat.jStat.extend({
		x: mainThat.jStat.multiply
	});
	return mainThat.jStat
});