var vows = require('vows');
var assert = require('assert');
var suite = vows.describe('jStat.distribution');

require('../env.js');

suite.addBatch({
  'binomial pdf': {
    'topic': function() {
      return jStat;
    },
    //checked against R's dbinom(k, n, p)
    'check pdf calculation': function(jStat) {
      var tol = 0.0000001;
      assert.epsilon(tol, jStat.binomial.pdf(10, 25, 0.5), 0.09741664);
      assert.epsilon(tol, jStat.binomial.pdf(50, 1000, 0.05), 0.05778798);
    },
    //Checked against r's pbinom(k, n, p)
    'check cdf calculation': function(jStat) {
      var tol = 0.0000001;
      assert.epsilon(tol, jStat.binomial.cdf(10, 25, 0.5), 0.2121781);
      assert.epsilon(tol, jStat.binomial.cdf(50, 1000, 0.05), 0.537529);
    }
  }
});

suite.export(module);
