var { describe, it } = require('node:test');
var assert = require('node:assert/strict');
var { jStat, assertEpsilon } = require('../helpers.js');

describe('gamma pdf', function() {
    it('check instance and static pdf method', function() {
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
          assert.ok(isNaN(pInstance));
        } else {
          assert.ok(pStatic === pInstance,
                 'Gamma pdf evaluated at ' +
                   x + ' should be equal for instance and static methods.');
        }
      }
    });

    // Checked against R's dgamma(x, shape, rate = 1, scale = 1/rate, log = FALSE)
    //   options(digits=10)
    //   dgamma(2, 1, scale=1)
    //   dgamma(5, 10, scale=2)
    //   dgamma(18, 22, scale=0.8)
    //   dgamma(-5, 7, scale=10)
    it('check pdf', function() {
      var tol = 0.000001;
      assertEpsilon(tol, jStat.gamma.pdf(2, 1, 1), 0.1353352832);
      assertEpsilon(tol, jStat.gamma.pdf(5, 10, 2), 0.000431450369);
      assertEpsilon(tol, jStat.gamma.pdf(18, 22, 0.8), 0.1029848021);
      assertEpsilon(tol, jStat.gamma.pdf(-5, 7, 10), 0);
    });

    //Checked against R's pgamma(q, shape, rate = 1/scale)
    //That is, jStat.gamma.cdf(5, 10, 2) == pgamma(5, 10, 1/2)
    it('check cdf', function() {
      var tol = 0.000001;
      assertEpsilon(tol, jStat.gamma.cdf(2, 1, 1), 0.8646647);
      assertEpsilon(tol, jStat.gamma.cdf(5, 10, 2), 0.0002773);
      assertEpsilon(tol, jStat.gamma.cdf(18, 22, 0.8), 0.5701725);
      assertEpsilon(tol, jStat.gamma.cdf(-1, 5, 5), 0);
    });

    //Checked against R's qgamma(p, shape, rate = 1/scale)
    //That is, jStat.gamma.inv(0.86, 10, 2) == qgamma(0.86, 10, 1/2)
    it('check inv', function() {
      var tol = 0.00001;
      assertEpsilon(tol, jStat.gamma.inv(0.86, 10, 2), 26.83397);
      assertEpsilon(tol, jStat.gamma.inv(0.57, 22, 0.8), 17.99833);
    });
});
