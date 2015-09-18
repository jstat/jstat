var vows = require('vows');
var assert = require('assert');
var suite = vows.describe('jStat.spearmancoeff');

require('../env.js');

suite.addBatch({
  'spearman': {
    'topic': function() {
      return jStat;
    },
    'return basic spearmancoeff': function(jStat) {
      assert.equal(jStat.spearmancoeff([1, 2, 3, 4], [5, 6, 9, 7]),
                   0.8);
    }
  }
});

suite.export(module);
