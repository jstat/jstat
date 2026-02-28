const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { jStat, assertEpsilon } = require('../helpers.js');

describe('central F distribution', function () {
  //Check against R's df(x, df1, df2)
  it('check pdf calculation', function () {
    const tol = 0.0000001;

    const zeroth = jStat.centralF.pdf(0.2, 1, 3);
    assertEpsilon(tol, zeroth, 0.722349);

    const first = jStat.centralF.pdf(1, 100, 100);
    assertEpsilon(tol, first, 1.989731);

    const second = jStat.centralF.pdf(2.5, 50, 200);
    assertEpsilon(tol, second, 0.00003610325);

    const third = jStat.centralF.pdf(0.8, 2, 10);
    assertEpsilon(tol, third, 0.4104423);

    const fourth = jStat.centralF.pdf(0.4, 3, 10);
    assertEpsilon(tol, fourth, 0.6733766);

    const first_at_zero = jStat.centralF.pdf(0.0, 3, 5);
    assertEpsilon(tol, first_at_zero, 0);

    const second_at_zero = jStat.centralF.pdf(0.0, 2, 1);
    assertEpsilon(tol, second_at_zero, 1);

    const third_at_zero = jStat.centralF.pdf(0.0, 1, 1);
    assert.strictEqual(third_at_zero, Infinity);

    // When x < 0 return 0
    //   df(-3, 4, 11)
    assertEpsilon(tol, jStat.centralF.pdf(-3, 4, 11), 0);

    // When x = 0, and df1 = 2, return 1
    //   df(0, 2, 15)
    assertEpsilon(tol, jStat.centralF.pdf(0, 2, 15), 1);

    // When x = 0, and df1 < 2, return Infinity
    //   df(0, 1, 20)
    assert.strictEqual(jStat.centralF.pdf(0, 1, 20), Infinity);

    assertEpsilon(tol, jStat.centralF.pdf(5, 1, 200), 0.0148982);

    assertEpsilon(tol, jStat.centralF.pdf(4.099, 2, 140), 0.01759074);

    assertEpsilon(tol, jStat.centralF.pdf(10, 300, 10), 8.304129e-5);
  });
  // Check against R's pf(q, df1, df2, ncp, lower.tail = TRUE, log.p = FALSE):
  //    options(digits=10)
  //    pf(0.2, 1, 3)
  //    pf(1, 100, 100)
  //    pf(2.5, 50, 200)
  //    pf(0.8, 2, 10)
  //    pf(0.4, 3, 10)
  //    pf(0, 3, 5)
  //    pf(0, 2, 1)
  //    pf(0, 1, 1)
  //    pf(-5, 5, 20)
  it('check cdf calculation', function () {
    const tol = 0.0000001;
    // Check with x within support (x > 0)
    assertEpsilon(tol, jStat.centralF.cdf(0.2, 1, 3), 0.3149623575);
    assertEpsilon(tol, jStat.centralF.cdf(1, 100, 100), 0.5);
    assertEpsilon(tol, jStat.centralF.cdf(2.5, 50, 200), 0.9999962786);
    assertEpsilon(tol, jStat.centralF.cdf(0.8, 2, 10), 0.5238869846);
    assertEpsilon(tol, jStat.centralF.cdf(0.4, 3, 10), 0.2439174275);
    // Check with x at edge of support (x = 0)
    assertEpsilon(tol, jStat.centralF.cdf(0.0, 3, 5), 0);
    assertEpsilon(tol, jStat.centralF.cdf(0.0, 2, 1), 0);
    assertEpsilon(tol, jStat.centralF.cdf(0.0, 1, 1), 0);
    // Check with x outside of support (x < 0)
    assertEpsilon(tol, jStat.centralF.cdf(-5, 5, 20), 0);
  });
});
