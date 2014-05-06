var vows = require('vows');
var assert = require('assert');
var suite = vows.describe('jStat.row');

require('../env.js');

suite.addBatch({
  'row': {
    'topic': function() {
      return jStat;
    },
    'return row at index': function(jStat) {
      assert.deepEqual(jStat.row([[1, 2], [3, 4]], 1), [3, 4]);
      assert.deepEqual(jStat([[1, 2], [3, 4]]).row(1).toArray(), [3, 4]);
    }
  },
  '#row': {
    'topic': function() {
      jStat([[1, 2], [3, 4]]).row(0, this.callback);
    },
    'row callback': function(val, stat) {
      assert.deepEqual(val.toArray(), [1, 2]);
      assert.isTrue(this instanceof jStat);
    }
  }
});

suite.export(module);
