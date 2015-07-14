var vows = require('vows');
var assert = require('assert');
var suite = vows.describe('jStat.distribution');

require('../env.js');

suite.addBatch({
  'lognormal pdf': {
    'topic': function() {
      return jStat;
    },
    // Checked against R's dlnorm(x, meanlog = 0, sdlog = 1, log = FALSE)
    //   options(digits=10)
	//	 dlnorm(c(-2, 0, 4), 4, 5)
	'check pdf calculation': function(jStat) {
      var tol = 0.0000001;
      assert.epsilon(tol, jStat.lognormal.pdf(-2, 4, 5), 0);
      assert.epsilon(tol, jStat.lognormal.pdf(0, 4, 5), 0);
      assert.epsilon(tol, jStat.lognormal.pdf(4, 4, 5), 0.01739974114);
    }
  },
});

suite.export(module);