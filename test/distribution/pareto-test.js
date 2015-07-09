var vows = require('vows');
var assert = require('assert');
var suite = vows.describe('jStat.distribution');

require('../env.js');

suite.addBatch({
  'pareto inv': {
    'topic': function() {
      return jStat;
    },
    // Checked against R's qpareto(x, df) in package VGAM
    //   install.packages("VGAM")
    //   library("VGAM")
    //   options(digits=10)
    //   qpareto(c(0, 0.5, 1), 1, 1)
    //   qpareto(c(0, 0.5, 1), 1, 2)
    //   qpareto(c(0, 0.5, 1), 2, 2)
    'check inv calculation': function(jStat) {
      var tol = 0.0000001;
      assert.epsilon(tol, jStat.pareto.inv(0, 1, 1), 1);
      assert.epsilon(tol, jStat.pareto.inv(0.5, 1, 1), 2);
      assert.equal(jStat.pareto.inv(1, 1, 1), Infinity);

      assert.epsilon(tol, jStat.pareto.inv(0, 1, 2), 1);
      assert.epsilon(tol, jStat.pareto.inv(0.5, 1, 2), 1.414213562);
      assert.equal(jStat.pareto.inv(1, 1, 2), Infinity);

      assert.epsilon(tol, jStat.pareto.inv(0, 2, 2), 2);
      assert.epsilon(tol, jStat.pareto.inv(0.5, 2, 2), 2.828427125);
      assert.equal(jStat.pareto.inv(1, 2, 2), Infinity);
    }
  },
});

suite.export(module);
