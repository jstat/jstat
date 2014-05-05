var vows = require('vows'),
	assert = require('assert')
	suite = vows.describe('jStat.quantiles');

require('../env.js');

suite.addBatch({
	'quantiles' : {
		'topic' : function() {
			return jStat;
		},
		'return basic quantiles' : function(jStat) {
			assert.deepEqual(jStat.quantiles([1,2,3,4,5,6],
											 [0.25, 0.5, 0.75]), 
											 [1.9375, 3.5, 5.0625]);
		},
		'quantiles from instance' : function(jStat) {
			assert.deepEqual(jStat([1,2,3,4,5,6]).quantiles([0.25, 0.5, 0.75]),
							 [1.9375, 3.5, 5.0625]);
		},
		'quantiles matrix cols' : function(jStat) {
			assert.deepEqual(jStat([[1,2],[3,4],[5,6]]).quantiles([0.25, 0.5, 0.75]),
							 [[1.375, 3, 4.625], [2.375, 4, 5.625]]);
		}
	},
	'fn.quantiles vector' : {
		'topic' : function() {
			jStat([1,2,3,4,5,6]).quantiles([0.25, 0.5, 0.75], this.callback);
		},
		'quantiles callback' : function(val, stat) {
			assert.deepEqual(val, [1.9375, 3.5, 5.0625]);
		}
	},
	'fn.quantiles matrix cols' : {
		'topic' : function() {
			jStat([[1,2],[3,4],[5,6]]).quantiles([0.25, 0.5, 0.75], this.callback);
		},
		'quantiles matrix cols callback' : function(val, stat) {
			assert.deepEqual(val, [[1.375, 3, 4.625], [2.375, 4, 5.625]]);
		}
	}
});

suite.export(module);
