var vows = require('vows');
var assert = require('assert');
var suite = vows.describe('jStat.distribution');

require('../env.js');

suite.addBatch({
  'pareto pdf': {
    'topic': function() {
      return jStat;
    },
    // Checked against R's dpareto(x, df) in package VGAM
    //   install.packages("VGAM")
    //   library("VGAM")
    //   options(digits=10)
    //   dpareto(c(0, 1, 2), 1, 1)
    //   dpareto(c(-1, 1, 4), 1, 2)
    //   dpareto(c(1, 2, 10), 2, 2)
    'check pdf calculation': function(jStat) {
      var tol = 0.0000001;
      assert.epsilon(tol, jStat.pareto.pdf(0, 1, 1), 0);
      assert.epsilon(tol, jStat.pareto.pdf(1, 1, 1), 1);
      assert.epsilon(tol, jStat.pareto.pdf(2, 1, 1), 0.25);

      assert.epsilon(tol, jStat.pareto.pdf(-1, 1, 2), 0);
      assert.epsilon(tol, jStat.pareto.pdf(1, 1, 2), 2);
      assert.epsilon(tol, jStat.pareto.pdf(4, 1, 2), 0.03125);
 
      assert.epsilon(tol, jStat.pareto.pdf(1, 2, 2), 0);
      assert.epsilon(tol, jStat.pareto.pdf(2, 2, 2), 1);
      assert.epsilon(tol, jStat.pareto.pdf(10, 2, 2), 0.008);
    }
  },
});

suite.export(module);