var vows = require('vows'),
	assert = require('assert')
	suite = vows.describe('jStat.rand');

require('../env.js');

suite.addBatch({
	'rand' : {
		'topic' : function() {
			return jStat;
		},
		'return rand' : function(jStat) {
			assert.isTrue(jStat.rand(2) instanceof Array);
		},
		'rand from empty jStat object' : function (jStat) {
			assert.isTrue(jStat().rand(2) instanceof jStat);
		}
	}
});

suite.export(module);
