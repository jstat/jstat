var vows = require('vows');
var assert = require('assert');
var suite = vows.describe('jStat.distribution');

require('../env.js');

suite.addBatch({
  'triangular pdf': {
    'topic': function() {
      return jStat;
    },
    // checked against R's dtriangle(x, a, b, c) from package 'triangle'
    'check pdf calculation': function(jStat) {
      var tol = 0.0000001;
      assert.epsilon(tol, jStat.triangular.pdf(5.5, 1, 10, 5), 0.2);
      assert.epsilon(tol, jStat.triangular.pdf(1.0, 1.0, 2.0, 1.0), 1.0);
      assert.epsilon(tol, jStat.triangular.pdf(3.0, 1.0, 3.0, 3.0), 1.0);
    },
  }
});

suite.export(module);
