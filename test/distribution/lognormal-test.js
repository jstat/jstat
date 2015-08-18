var vows = require('vows');
var assert = require('assert');
var suite = vows.describe('jStat.distribution');

require('../env.js');

suite.addBatch({
  'lognormal cdf': {
    'topic': function() {
      return jStat;
    },
    // Checked against R's plnorm(q, meanlog = 0, sdlog = 1, lower.tail = TRUE, log.p = FALSE)
    //   options(digits=10)
	//	 plnorm(c(-2, 0, 4), 4, 5)
	'check cdf calculation': function(jStat) {
      var tol = 0.0000001;
      assert.epsilon(tol, jStat.lognormal.cdf(-2, 4, 5), 0);
      assert.epsilon(tol, jStat.lognormal.cdf(0, 4, 5), 0);
      assert.epsilon(tol, jStat.lognormal.cdf(4, 4, 5), 0.3005772067);
    }
  },
});

suite.export(module);