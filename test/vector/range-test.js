var vows = require('vows'),
	assert = require('assert')
	suite = vows.describe('jStat.range');

require('../env.js');

suite.addBatch({
	'range' : {
		'topic' : function() {
			return jStat;
		},
		'return basic range' : function(jStat) {
			assert.equal(jStat.range([1,2,3]), 2);
		},
		'range from instance' : function(jStat) {
			assert.equal(jStat([1,2,3]).range(), 2);
		},
		'range matrix cols' : function(jStat) {
			assert.deepEqual(jStat([[1,2],[3,4]]).range(), [2,2]);
		}
	},
	'fn.range vector' : {
		'topic' : function() {
			jStat([1,2,3]).range(this.callback);
		},
		'range callback' : function(val, stat) {
			assert.equal(val, 2);
		}
	},
	'fn.range matrix cols' : {
		'topic' : function() {
			jStat([[1,2],[3,4]]).range(this.callback);
		},
		'range matrix cols callback' : function(val, stat) {
			assert.deepEqual(val, [2,2]);
		}
	}
});

suite.export(module);
