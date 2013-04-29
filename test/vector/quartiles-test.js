var vows = require('vows'),
	assert = require('assert')
	suite = vows.describe('jStat.quartiles');

require('../env.js');

suite.addBatch({
	'quartiles' : {
		'topic' : function() {
			return jStat;
		},
		'return basic quartiles' : function(jStat) {
			assert.deepEqual(jStat.quartiles([1,2,3,4,5,6]), [2,3,5]);
		},
		'quartiles from instance' : function(jStat) {
			assert.deepEqual(jStat([1,2,3,4,5,6]).quartiles(), [2,3,5]);
		},
		'quartiles matrix cols' : function(jStat) {
			assert.deepEqual(jStat([[1,2],[3,4],[5,6]]).quartiles(), [[1,3,3],[2,4,4]]);
		}
	},
	'fn.quartiles vector' : {
		'topic' : function() {
			jStat([1,2,3,4,5,6]).quartiles(this.callback);
		},
		'quartiles callback' : function(val, stat) {
			assert.deepEqual(val, [2,3,5]);
		}
	},
	'fn.quartiles matrix cols' : {
		'topic' : function() {
			jStat([[1,2],[3,4],[5,6]]).quartiles(this.callback);
		},
		'quartiles matrix cols callback' : function(val, stat) {
			assert.deepEqual(val, [[1,3,3],[2,4,4]]);
		}
	}
});

suite.export(module);
