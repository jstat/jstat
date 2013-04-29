var vows = require('vows'),
	assert = require('assert')
	suite = vows.describe('jStat.extend');

require('../env.js');

suite.addBatch({
	'jStat' : {
		'topic' : function() {
			return jStat.extend;
		},
		'extending' : function(extend) {
			assert.deepEqual(extend({ happy : 'sad' },{ here : 'there' }),{
				happy : 'sad',
				here : 'there'
			});
			assert.deepEqual(extend({ one : 'two' },{ one : 'more' }),{ one : 'more' });
		}
	}
});

suite.export(module);
