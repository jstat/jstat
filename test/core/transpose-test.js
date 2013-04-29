var vows = require('vows'),
	assert = require('assert')
	suite = vows.describe('jStat.transpose');

require('../env.js');

suite.addBatch({
	'transpose' : {
		'topic' : function() {
			return jStat;
		},
		'return transpose' : function(jStat) {
			assert.deepEqual(jStat.transpose([[1,2],[3,4]]), [[1,3],[2,4]]);
			assert.deepEqual(jStat([[1,2],[3,4]]).transpose().toArray(), [[1,3],[2,4]]);
		}
	},
	'fn.transpose' : {
		'topic' : function() {
			jStat([[1,2],[3,4]]).transpose(this.callback);
		},
		'transpose callback' : function(val, stat) {
			assert.deepEqual(val.toArray(), [[1,3],[2,4]]);
		}
	}
});

suite.export(module);
