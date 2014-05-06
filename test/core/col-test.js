var vows = require('vows');
var assert = require('assert');
var suite = vows.describe('jStat.col');

require('../env.js');

suite.addBatch({
  'col': {
    'topic': function() {
      return jStat;
    },
    'return col at index' : function(jStat) {
      assert.deepEqual(jStat.col([[1, 2], [3, 4]], 1), [[2], [4]]);
      assert.deepEqual(jStat([[1, 2], [3, 4]]).col(1).toArray(), [[2], [4]]);
    }
  },
  '#col': {
    'topic': function() {
      jStat([[1, 2], [3, 4]]).col(0, this.callback);
    },
    'col callback': function(val, stat) {
      assert.deepEqual(val.toArray(), [[1], [3]]);
      assert.isTrue(this instanceof jStat);
    }
  }
});

suite.export(module);
