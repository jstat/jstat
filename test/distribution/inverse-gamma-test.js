var { describe, it } = require('node:test');
var assert = require('node:assert/strict');
var { jStat, assertEpsilon } = require('../helpers.js');

describe('inverse gamma pdf', function() {
    // Checked against R's densigamma(x, alpha, beta) from pscl package
    //    install.packages("pscl")
    //    library("pscl")
    //    densigamma(0.5, 1, 1)
    //    densigamma(0.25, 10, 2)
    //    densigamma(0.95, 18, 10)
    //    densigamma(-5, 2, 4) # Note: This incorrectly throws an error!
    it('check pdf', function() {
      var tol = 0.000001;
      assertEpsilon(tol, jStat.invgamma.pdf(0.5, 1, 1), 0.5413411329);
      assertEpsilon(tol, jStat.invgamma.pdf(0.25, 10, 2), 3.970461353);
      assertEpsilon(tol, jStat.invgamma.pdf(0.95, 18, 10), 0.1998306597);
      assertEpsilon(tol, jStat.invgamma.pdf(-5, 2, 4), 0);
    });

    //Checked against R's pigamma(q, shape, scale), which R calls alpha, beta
    //from the pscl package
    it('check cdf', function() {
      var tol = 0.000001;
      assertEpsilon(tol, jStat.invgamma.cdf(0.5, 1, 1), 0.1353353);
      assertEpsilon(tol, jStat.invgamma.cdf(0.25, 10, 2), 0.7166243);
      assertEpsilon(tol, jStat.invgamma.cdf(0.95, 18, 10), 0.9776673);
      assertEpsilon(tol, jStat.invgamma.cdf(-5, 5, 20), 0);
    });

    //Checked against R's qigamma(p, shape, rate = 1/scale)
    //from the pscl package
    it('check inv', function() {
      var tol = 0.00001;
      assertEpsilon(tol, jStat.invgamma.inv(0.135, 1, 1), 0.4993806);
      assertEpsilon(tol, jStat.invgamma.inv(0.716, 10, 2), 0.2498429);
    });
});
