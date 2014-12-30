var vows = require('vows');
var assert = require('assert');
var suite = vows.describe('jStat.distribution');

require('../env.js');

suite.addBatch({
  'inverse gamma pdf': {
    'topic': function() {
      return jStat;
    },

    //Checked against R's pigamma(q, shape, scale), which R calls alpha, beta
    //from the pscl package
    'check cdf': function(jStat) {
      tol = 0.000001;
      assert.epsilon(tol, jStat.invgamma.cdf(0.5, 1, 1), 0.1353353);
      assert.epsilon(tol, jStat.invgamma.cdf(0.25, 10, 2), 0.7166243);
      assert.epsilon(tol, jStat.invgamma.cdf(0.95, 18, 10), 0.9776673);
    },

    //Checked against R's qigamma(p, shape, rate = 1/scale)
    //from the pscl package
    'check inv': function(jStat) {
      tol = 0.00001;
      assert.epsilon(tol, jStat.invgamma.inv(0.135, 1, 1), 0.4993806);
      assert.epsilon(tol, jStat.invgamma.inv(0.716, 10, 2), 0.2498429);
    }
  },
});

suite.export(module);
