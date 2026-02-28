const { describe, it } = require('node:test');
const { jStat, assertEpsilon } = require('../helpers.js');

describe('uniform pdf', function () {
  it('check pdf calculation', function () {
    const tol = 0.0000001;
    assertEpsilon(tol, jStat.uniform.pdf(10.5, 10, 11), 1.0);
    assertEpsilon(tol, jStat.uniform.pdf(6, 0, 10), 0.1);
  });
  it('check cdf calculation', function () {
    const tol = 0.0000001;
    assertEpsilon(tol, jStat.uniform.cdf(7, 0, 10), 0.7);
    assertEpsilon(tol, jStat.uniform.cdf(10.5, 10, 11), 0.5);
  });
  it('check inv calculation', function () {
    const tol = 0.0000001;
    assertEpsilon(tol, jStat.uniform.inv(0.5, 10, 11), 10.5);
    assertEpsilon(tol, jStat.uniform.inv(0.7, 0, 10), 7.0);
  });
});
