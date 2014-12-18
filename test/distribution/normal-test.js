var vows = require('vows');
var assert = require('assert');
var suite = vows.describe('jStat.distribution');

require('../env.js');

suite.addBatch({
  'normal pdf': {
    'topic': function() {
      return jStat;
    },
    //Checked againstR R's dnorm(x, mean, sd)
    'check pdf calculation': function(jStat) {
      var tol = 0.000001;
      assert.epsilon(tol, jStat.normal.pdf(0, 0, 1.0), 0.3989423);
      assert.epsilon(tol, jStat.normal.pdf(5, 10, 3.0), 0.03315905);
      assert.epsilon(tol, jStat.normal.pdf(-1, 1, 0.5), 0.00026766);
    }
  }
});
