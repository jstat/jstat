var vows = require('vows'),
	assert = require('assert')
	suite = vows.describe('jStat.diff');

require('../env.js');

suite.addBatch({
	'diff' : {
		'topic' : function() {
			return jStat;
		},
		'return basic diff' : function(jStat) {
			assert.deepEqual(jStat.diff([1,2,3]), [1,1]);
		},
		'diff from instance' : function(jStat) {
			assert.deepEqual(jStat([1,2,3]).diff(), [1,1]);
		},
		'diff matrix cols' : function(jStat) {
			assert.deepEqual(jStat([[1,2],[3,4]]).diff(), [[2],[2]]);
		}
	},
	'fn.diff vector' : {
		'topic' : function() {
			jStat([1,2,3]).diff(this.callback);
		},
		'diff callback' : function(val, stat) {
			assert.deepEqual(val, [1,1]);
		}
	},
	'fn.diff matrix cols' : {
		'topic' : function() {
			jStat([[1,2],[3,4]]).diff(this.callback);
		},
		'diff matrix cols callback' : function(val, stat) {
			assert.deepEqual(val, [[2],[2]]);
		}
	}
});

suite.export(module);
