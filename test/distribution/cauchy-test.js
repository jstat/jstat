const { describe, it } = require('node:test');
const { jStat, assertEpsilon } = require('../helpers.js');

const tol = 0.0000001;

describe('cauchy pdf', function () {
  it('check pdf calculation', function () {
    const pdf = jStat.cauchy.pdf;

    assertEpsilon(tol, pdf(1, 0, 1), 1 / (2 * Math.PI));
    assertEpsilon(tol, pdf(3, 0, 1), 1 / (10 * Math.PI));
    assertEpsilon(tol, pdf(-2, 0, 1), 1 / (5 * Math.PI));

    //Location parameter
    assertEpsilon(tol, pdf(1, 1, 1), 1 / Math.PI);
    assertEpsilon(tol, pdf(0, -3, 1), 1 / (10 * Math.PI));

    //Scale parameter
    assertEpsilon(tol, pdf(0, 1, 3), 1 / ((10 / 3) * Math.PI));
    assertEpsilon(tol, pdf(0, 1, 0.5), 1 / (2.5 * Math.PI));

    //Negative test cases
    assertEpsilon(tol, pdf(0, 0, -3), 0);
  });
  it('check cdf calculations', function () {
    const cdf = jStat.cauchy.cdf;

    assertEpsilon(tol, cdf(0, 0, 1), 0.5);
    assertEpsilon(tol, cdf(3, 0, 1), Math.atan(3) / Math.PI + 0.5);

    assertEpsilon(tol, cdf(0, 1, 1), Math.atan(-1) / Math.PI + 0.5);
    assertEpsilon(tol, cdf(3, 1, 1), Math.atan(2) / Math.PI + 0.5);

    assertEpsilon(tol, cdf(0, 1, 2), Math.atan(-0.5) / Math.PI + 0.5);
    assertEpsilon(tol, cdf(1, 0, 0.5), Math.atan(2) / Math.PI + 0.5);
  });
  it('median', function () {
    const median = jStat.cauchy.median;

    assertEpsilon(tol, median(0, 1), 0);
    assertEpsilon(tol, median(0, 4), 0);
    assertEpsilon(tol, median(-2, 1), -2);
  });
  it('mode', function () {
    const mode = jStat.cauchy.mode;

    assertEpsilon(tol, mode(0, 1), 0);
    assertEpsilon(tol, mode(0, 4), 0);
    assertEpsilon(tol, mode(-2, 1), -2);
  });
});
