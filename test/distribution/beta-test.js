const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { jStat, assertEpsilon } = require('../helpers.js');

describe('beta pdf', function () {
  it('check pdf calculation', function () {
    // Non-log form of the Beta pdf
    function pdf(x, alpha, beta) {
      if (x > 1 || x < 0) return 0;
      return (Math.pow(x, alpha - 1) * Math.pow(1 - x, beta - 1)) / jStat.betafn(alpha, beta);
    }

    const tol = 0.0000001;
    const args = [0, 0.1, 0.3, 0.5, 0.7, 0.9, 1];
    let arg;

    for (let i = 0; i < args.length; i++) {
      arg = args[i];
      assertEpsilon(tol, jStat.beta.pdf(arg, 0.1, 0.1), pdf(arg, 0.1, 0.1));
      assertEpsilon(tol, jStat.beta.pdf(arg, 1, 1), pdf(arg, 1, 1));
      assertEpsilon(tol, jStat.beta.pdf(arg, 10, 50), pdf(arg, 10, 50));

      // Show that the log form of the pdf performs better for
      // large parameter values.
      assert.ok(
        !isNaN(jStat.beta.pdf(arg, 1000, 5000)),
        'New Beta pdf is NaN for large parameter values.'
      );
      assert.ok(isNaN(pdf(arg, 1000, 5000)), 'Old Beta pdf is not NaN for large parameter values.');
    }

    assert.strictEqual(jStat.beta.pdf(0, 1, 4), 4);
    assert.strictEqual(jStat.beta.pdf(1, 4, 1), 4);
    assert.strictEqual(jStat.beta.pdf(0.5, 200, 4000), 0);
  });
  // checked against R code:
  //   options(digits=10)
  //   # Using mode definition from: https://en.wikipedia.org/wiki/Beta_distribution
  //   beta.mode <- function (a, b) {(a-1)/(a+b-2)}
  //   beta.mode(2.05, 2)
  //   beta.mode(5, 10)
  //   beta.mode(3, 3)
  it('check mode calculation', function () {
    const tol = 0.0000001;
    assertEpsilon(tol, jStat.beta.mode(5, 10), 0.3076923077);
    assertEpsilon(tol, jStat.beta.mode(2.05, 2), 0.512195122);
    assertEpsilon(tol, jStat.beta.mode(3, 3), 0.5);
  });
  // checked against R's qbeta(p, shape1, shape2, ncp=0, lower.tail=TRUE, log.p=FALSE) from package 'stats':
  //   options(digits=10)
  //   qbeta(0.5, 5, 10)
  //   qbeta(0.5, 2.05, 2)
  //   qbeta(0.5, 3, 3)
  it('check median calculation', function () {
    const tol = 0.0000001;
    assertEpsilon(tol, jStat.beta.median(5, 10), 0.3257511553);
    assertEpsilon(tol, jStat.beta.median(2.05, 2), 0.5072797399);
    assertEpsilon(tol, jStat.beta.median(3, 3), 0.5);
  });
});
