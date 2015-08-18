var vows = require('vows');
var assert = require('assert');
var suite = vows.describe('jStat.distribution');

require('../env.js');

suite.addBatch({
  'pareto cdf': {
    'topic': function() {
      return jStat;
    },
    // Checked against R's ppareto(q, scale = 1, shape, lower.tail = TRUE, log.p = FALSE) in package VGAM
    //   install.packages("VGAM")
    //   library("VGAM")
    //   options(digits=10)
    //   ppareto(c(0, 1, 2), 1, 1)
    //   ppareto(c(-1, 1, 4), 1, 2)
    //   ppareto(c(1, 2, 10), 2, 2)
    'check cdf calculation': function(jStat) {
      var tol = 0.0000001;
      assert.epsilon(tol, jStat.pareto.cdf(0, 1, 1), 0);
      assert.epsilon(tol, jStat.pareto.cdf(1, 1, 1), 0);
      assert.epsilon(tol, jStat.pareto.cdf(2, 1, 1), 0.5);

      assert.epsilon(tol, jStat.pareto.cdf(-1, 1, 2), 0);
      assert.epsilon(tol, jStat.pareto.cdf(1, 1, 2), 0);
      assert.epsilon(tol, jStat.pareto.cdf(4, 1, 2), 0.9375);
 
      assert.epsilon(tol, jStat.pareto.cdf(1, 2, 2), 0);
      assert.epsilon(tol, jStat.pareto.cdf(2, 2, 2), 0);
      assert.epsilon(tol, jStat.pareto.cdf(10, 2, 2), 0.96);
    }
  },
});