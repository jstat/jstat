const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { jStat, assertEpsilon } = require('../helpers.js');

describe('pareto pdf', function () {
  // Checked against R's dpareto(x, df) in package VGAM
  //   install.packages("VGAM")
  //   library("VGAM")
  //   options(digits=10)
  //   dpareto(c(0, 1, 2), 1, 1)
  //   dpareto(c(-1, 1, 4), 1, 2)
  //   dpareto(c(1, 2, 10), 2, 2)
  it('check pdf calculation', function () {
    const tol = 0.0000001;
    assertEpsilon(tol, jStat.pareto.pdf(0, 1, 1), 0);
    assertEpsilon(tol, jStat.pareto.pdf(1, 1, 1), 1);
    assertEpsilon(tol, jStat.pareto.pdf(2, 1, 1), 0.25);

    assertEpsilon(tol, jStat.pareto.pdf(-1, 1, 2), 0);
    assertEpsilon(tol, jStat.pareto.pdf(1, 1, 2), 2);
    assertEpsilon(tol, jStat.pareto.pdf(4, 1, 2), 0.03125);

    assertEpsilon(tol, jStat.pareto.pdf(1, 2, 2), 0);
    assertEpsilon(tol, jStat.pareto.pdf(2, 2, 2), 1);
    assertEpsilon(tol, jStat.pareto.pdf(10, 2, 2), 0.008);
  });
});

describe('pareto inv', function () {
  // Checked against R's qpareto(x, df) in package VGAM
  //   install.packages("VGAM")
  //   library("VGAM")
  //   options(digits=10)
  //   qpareto(c(0, 0.5, 1), 1, 1)
  //   qpareto(c(0, 0.5, 1), 1, 2)
  //   qpareto(c(0, 0.5, 1), 2, 2)
  it('check inv calculation', function () {
    const tol = 0.0000001;
    assertEpsilon(tol, jStat.pareto.inv(0, 1, 1), 1);
    assertEpsilon(tol, jStat.pareto.inv(0.5, 1, 1), 2);
    assert.strictEqual(jStat.pareto.inv(1, 1, 1), Infinity);

    assertEpsilon(tol, jStat.pareto.inv(0, 1, 2), 1);
    assertEpsilon(tol, jStat.pareto.inv(0.5, 1, 2), 1.414213562);
    assert.strictEqual(jStat.pareto.inv(1, 1, 2), Infinity);

    assertEpsilon(tol, jStat.pareto.inv(0, 2, 2), 2);
    assertEpsilon(tol, jStat.pareto.inv(0.5, 2, 2), 2.828427125);
    assert.strictEqual(jStat.pareto.inv(1, 2, 2), Infinity);
  });
});

describe('pareto cdf', function () {
  // Checked against R's ppareto(q, scale = 1, shape, lower.tail = TRUE, log.p = FALSE) in package VGAM
  //   install.packages("VGAM")
  //   library("VGAM")
  //   options(digits=10)
  //   ppareto(c(0, 1, 2), 1, 1)
  //   ppareto(c(-1, 1, 4), 1, 2)
  //   ppareto(c(1, 2, 10), 2, 2)
  it('check cdf calculation', function () {
    const tol = 0.0000001;
    assertEpsilon(tol, jStat.pareto.cdf(0, 1, 1), 0);
    assertEpsilon(tol, jStat.pareto.cdf(1, 1, 1), 0);
    assertEpsilon(tol, jStat.pareto.cdf(2, 1, 1), 0.5);

    assertEpsilon(tol, jStat.pareto.cdf(-1, 1, 2), 0);
    assertEpsilon(tol, jStat.pareto.cdf(1, 1, 2), 0);
    assertEpsilon(tol, jStat.pareto.cdf(4, 1, 2), 0.9375);

    assertEpsilon(tol, jStat.pareto.cdf(1, 2, 2), 0);
    assertEpsilon(tol, jStat.pareto.cdf(2, 2, 2), 0);
    assertEpsilon(tol, jStat.pareto.cdf(10, 2, 2), 0.96);
  });
});
