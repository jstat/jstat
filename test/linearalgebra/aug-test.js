var vows = require('vows');
var assert = require('assert');
var suite = vows.describe('jStat');

require('../env.js');

suite.addBatch({
  'linearalgebra': {
    'topic': function() {
      return jStat;
    },
    'aug function works': function(jStat) {
      var A = jStat([[1, 2], [3, 4]]);
      var B = [[5], [6]];
      assert.deepEqual(jStat.aug(A, B), [[1, 2, 5], [3, 4, 6]]);
    }
  }
});

suite.export(module);
