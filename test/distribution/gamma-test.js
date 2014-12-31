var vows = require('vows');
var assert = require('assert');
var suite = vows.describe('jStat.distribution');

require('../env.js');

suite.addBatch({
  'gamma pdf': {
    'topic': function() {
      return jStat;
    },
    'check instance and static pdf method': function (jStat) {
      var shape = 5;
      var scale = 1;
      var gamma = jStat.gamma(shape, scale);
      var xValues = [-1, 0, 1];
      var x;
      for (var i = 0; i < xValues.length; i++) {
        x = xValues[i];
        pStatic = jStat.gamma.pdf(x, shape, scale);
        pInstance = gamma.pdf(x);
        if (isNaN(pStatic)) {
          assert(isNaN(pInstance));
        } else {
          assert(pStatic === pInstance,
                 'Gamma pdf evaluated at ' +
                   x + ' should be equal for instance and static methods.');
        }
      }
    },

    //Checked against R's pgamma(q, shape, rate = 1/scale)
    //That is, jStat.gamma.cdf(5, 10, 2) == pgamma(5, 10, 1/2)
    'check cdf': function(jStat) {
      tol = 0.000001;
      assert.epsilon(tol, jStat.gamma.cdf(2, 1, 1), 0.8646647);
      assert.epsilon(tol, jStat.gamma.cdf(5, 10, 2), 0.0002773);
      assert.epsilon(tol, jStat.gamma.cdf(18, 22, 0.8), 0.5701725);
    },

    //Checked against R's qgamma(p, shape, rate = 1/scale)
    //That is, jStat.gamma.inv(0.86, 10, 2) == qgamma(0.86, 10, 1/2)
    'check inv': function(jStat) {
      tol = 0.00001;
      assert.epsilon(tol, jStat.gamma.inv(0.86, 10, 2), 26.83397);
      assert.epsilon(tol, jStat.gamma.inv(0.57, 22, 0.8), 17.99833);
    }
  },
});

suite.export(module);
