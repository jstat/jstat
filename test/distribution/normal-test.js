var { describe, it } = require('node:test');
var assert = require('node:assert/strict');
var { jStat, assertEpsilon } = require('../helpers.js');

describe('normal pdf', function() {
    //Checked against R's dnorm(x, mean, sd)
    it('check pdf calculation', function() {
      var tol = 0.000001;
      assertEpsilon(tol, jStat.normal.pdf(0, 0, 1.0), 0.3989423);
      assertEpsilon(tol, jStat.normal.pdf(5, 10, 3.0), 0.03315905);
      assertEpsilon(tol, jStat.normal.pdf(-1, 1, 0.5), 0.00026766);
    });

    //Checked against R's qnorm(p, mean, sd)
    it('check inv calculation', function() {
      var tol = 0.000001;
      assertEpsilon(tol, jStat.normal.inv(0.3989423, 0, 1.0), -0.2560858);
      assertEpsilon(tol, jStat.normal.inv(0.05, 10, 3.0), 5.065439);
      assertEpsilon(tol, jStat.normal.inv(0.65, -2, .5), -1.80734);
    });
});
