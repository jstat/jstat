const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { jStat, assertEpsilon } = require('../helpers.js');

describe('chisquare pdf', function () {
  //Checked against R dchisq(x,df)
  it('check pdf calculation', function () {
    const tol = 0.0000001;
    assertEpsilon(tol, jStat.chisquare.pdf(3.5, 10), 0.03395437);
  });
  // Checked against R dchisq(x,df)
  //   dchisq(0, 5)
  //   dchisq(0, 2)
  //   dchisq(0, 1)
  it('check pdf calculation at x = 0.0', function () {
    const tol = 0.0000001;
    assertEpsilon(tol, jStat.chisquare.pdf(0.0, 5), 0.0);
    assertEpsilon(tol, jStat.chisquare.pdf(0.0, 2), 0.5);
    assert.strictEqual(jStat.chisquare.pdf(0.0, 1), Infinity);
  });
  it('check pdf calculation at x < 0', function () {
    const tol = 0.0000001;
    assertEpsilon(tol, jStat.chisquare.pdf(-10, 8), 0.0);
  });
  //Checked against R's pchisq(x, df)
  it('check cdf calculation', function () {
    const tol = 0.0000001;
    assertEpsilon(tol, jStat.chisquare.cdf(2.5, 8), 0.03826905);
  });
  // Checked against R's pchisq(q, df, ncp = 0, lower.tail = TRUE, log.p = FALSE):
  //    pchisq(-5, 21)
  it('check cdf calculation when x outside support (x < 0)', function () {
    const tol = 0.0000001;
    assertEpsilon(tol, jStat.chisquare.cdf(-5, 21), 0);
  });
  //Checked against R's qchisq(x, df)
  it('check inv calculation', function () {
    const tol = 0.00001;
    assertEpsilon(tol, jStat.chisquare.inv(0.95, 10), 18.30704);
  });
  //Checked against R's qchisq(x, df)
  it('check inv calculation again', function () {
    const tol = 0.00001;
    assertEpsilon(tol, jStat.chisquare.inv(0.85, 10), 14.53394);
  });
});
