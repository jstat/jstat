var vows = require('vows');
var assert = require('assert');
var suite = vows.describe('jStat.percentile');

require('../env.js');

//could be compared against MS Excel percentile function
suite.addBatch({
  'percentile': {
    'topic': function() {
      return jStat;
    },
    '30th percentile of the list in the range': function(jStat) {
      assert.deepEqual(jStat.percentile([1, 2, 3, 4], 0.3), 1.9);
    },
    '30th percentile of the list in the range, unsorted': function(jStat) {
      assert.deepEqual(jStat.percentile([3, 1, 4, 2], 0.3), 1.9);
    }
  }
});

suite.export(module);
