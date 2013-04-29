var vows = require('vows'),
	assert = require('assert')
	suite = vows.describe('jStat.mode');

require('../env.js');

suite.addBatch({
	'mode' : {
		'topic' : function() {
			return jStat;
		},
		'return basic mode' : function(jStat) {
			assert.equal(jStat.mode([1,2,3,3]), 3);
		},
		'mode from instance' : function(jStat) {
			assert.equal(jStat([1,2,3,3]).mode(), 3);
		},
		'mode matrix cols' : function(jStat) {
			assert.deepEqual(jStat([[1,2],[1,4]]).mode(), [1,[2,4]]);
		}
	},
	'fn.mode vector' : {
		'topic' : function() {
			jStat([1,2,3,3]).mode(this.callback);
		},
		'mode callback' : function(val, stat) {
			assert.equal(val, 3);
		}
	},
	'fn.mode matrix cols' : {
		'topic' : function() {
			jStat([[1,2],[1,4]]).mode(this.callback);
		},
		'mode matrix cols callback' : function(val, stat) {
			assert.deepEqual(val, [1,[2,4]]);
		}
	}
});

suite.export(module);
