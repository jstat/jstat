const { describe, it } = require('node:test');
const { jStat, assertEpsilon } = require('../helpers.js');

describe('lognormal pdf', function () {
  // Checked against R's dlnorm(x, meanlog = 0, sdlog = 1, log = FALSE)
  //   options(digits=10)
  //   dlnorm(c(-2, 0, 4), 4, 5)
  it('check pdf calculation', function () {
    const tol = 0.0000001;
    assertEpsilon(tol, jStat.lognormal.pdf(-2, 4, 5), 0);
    assertEpsilon(tol, jStat.lognormal.pdf(0, 4, 5), 0);
    assertEpsilon(tol, jStat.lognormal.pdf(4, 4, 5), 0.01739974114);
  });
});

describe('lognormal cdf', function () {
  // Checked against R's
  // plnorm(q, meanlog = 0, sdlog = 1, lower.tail = TRUE, log.p = FALSE)
  //   options(digits=10)
  //   plnorm(c(-2, 0, 4), 4, 5)
  it('check cdf calculation', function () {
    const tol = 0.0000001;
    assertEpsilon(tol, jStat.lognormal.cdf(-2, 4, 5), 0);
    assertEpsilon(tol, jStat.lognormal.cdf(0, 4, 5), 0);
    assertEpsilon(tol, jStat.lognormal.cdf(4, 4, 5), 0.3005772067);
  });
});
