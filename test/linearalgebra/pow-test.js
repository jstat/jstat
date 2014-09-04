var vows = require('vows'),
  assert = require('assert')
  suite = vows.describe('jStat');

require('../env.js');

suite.addBatch({
  'linearalgebra' : {
    'topic' : function() {
      return jStat;
    },
    'pow function works' : function(jStat) {
      var A = jStat([[1, 2], [3, 4]]);
      assert.deepEqual(A.pow(2), jStat([[1, 4], [9, 16]]));
    }
  }
});

suite.export(module);
