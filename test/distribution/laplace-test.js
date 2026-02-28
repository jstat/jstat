const { describe, it } = require('node:test');
const { jStat, assertEpsilon } = require('../helpers.js');

const tol = 0.0000001;

describe('laplace pdf', function () {
  it('check pdf calculation', function () {
    const pdf = jStat.laplace.pdf;

    assertEpsilon(tol, pdf(0, 0, 1), 0.5);
    assertEpsilon(tol, pdf(2, 0, 1), 0.5 * Math.exp(-2));

    //Mean parameter
    assertEpsilon(tol, pdf(0, 1, 1), 0.5 * Math.exp(-1));
    assertEpsilon(tol, pdf(0, 3, 1), 0.5 * Math.exp(-3));
    assertEpsilon(tol, pdf(0, -3, 1), 0.5 * Math.exp(-3));

    //Shape parameter
    assertEpsilon(tol, pdf(0, 0, 5), 0.1);

    //Zero for invalid parameters
    assertEpsilon(tol, pdf(0, 0, 0), 0);
    assertEpsilon(tol, pdf(0, 0, -3), 0);

    //Large values
    assertEpsilon(tol, pdf(0, 400, 500), 0.001 * Math.exp(-0.8));
  });
  it('check cdf calculation', function () {
    const cdf = jStat.laplace.cdf;

    assertEpsilon(tol, cdf(0, 0, 1), 0.5);
    assertEpsilon(tol, cdf(1, 0, 1), 1 - 0.5 * Math.exp(-1));

    //Mean parameter
    assertEpsilon(tol, cdf(0, 2, 1), 0.5 * Math.exp(-2));
    assertEpsilon(tol, cdf(3, 2, 1), 1 - 0.5 * Math.exp(-1));

    //Shape parameter
    assertEpsilon(tol, cdf(0, 0, 3), 0.5);
    assertEpsilon(tol, cdf(3, 0, 3), 1 - 0.5 * Math.exp(-1));
    assertEpsilon(tol, cdf(-2, 0, 4), 0.5 * Math.exp(-0.5));

    //Zero returned for invalid parameters
    assertEpsilon(tol, cdf(1, 1, 0), 0);
    assertEpsilon(tol, cdf(1, 1, -2), 0);
  });
  it('mean', function () {
    const mean = jStat.laplace.mean;

    assertEpsilon(tol, mean(0, 2), 0);
    assertEpsilon(tol, mean(1, 2), 1);
    assertEpsilon(tol, mean(-5, 3), -5);
  });
  it('median', function () {
    const median = jStat.laplace.median;

    assertEpsilon(tol, median(0, 2), 0);
    assertEpsilon(tol, median(1, 2), 1);
    assertEpsilon(tol, median(-5, 3), -5);
  });
  it('mode', function () {
    const mode = jStat.laplace.mode;

    assertEpsilon(tol, mode(0, 2), 0);
    assertEpsilon(tol, mode(1, 2), 1);
    assertEpsilon(tol, mode(-5, 3), -5);
  });
  it('variance', function () {
    const variance = jStat.laplace.variance;

    assertEpsilon(tol, variance(0, 2), 2 * 2 * 2);
    assertEpsilon(tol, variance(0, 0.25), 2 * 0.25 * 0.25);
  });
});
