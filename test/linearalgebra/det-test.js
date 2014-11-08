var vows = require('vows');
var assert = require('assert');
var suite = vows.describe('jStat');

require('../env.js');

suite.addBatch({
  'linearalgebra': {
    'topic': function() {
      return jStat;
    },
    'test det works': function(jStat) {
      var A = [[1, 2, 3], [4, 5, -6], [7, -8, 9]];
      assert.equal(jStat.det(A), -360);
    }
  }
});

suite.export(module);
