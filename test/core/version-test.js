var vows = require('vows');
var assert = require('assert');
var suite = vows.describe('jStat.alter');

require('../env.js');

suite.addBatch({
  'version': {
    'topic': function() {
      return jStat;
    },
    'has version': function(jStat) {
      assert.isNotNull(jStat.version());
    }
  }
});

suite.export(module);

