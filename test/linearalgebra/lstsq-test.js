const { describe, it } = require('node:test');
const { jStat, assertEpsilon } = require('../helpers.js');

describe('least squard solver by QR decomposition', function () {
  it('matrix call', function () {
    const A = jStat.arange(100).map(function () {
      return jStat.arange(3).map(function () {
        return jStat.normal.sample(0, 1);
      });
    });
    const e = jStat.arange(100).map(function () {
      return [jStat.normal.sample(0, 1) * 0.001];
    });
    const coef = [[1], [2], [3]];
    const y = jStat.add(jStat.multiply(A, coef), e);
    const coef_bar = jStat.lstsq(A, y);
    const tol = 0.1;
    assertEpsilon(tol, coef_bar[0][0], 1);
    assertEpsilon(tol, coef_bar[1][0], 2);
    assertEpsilon(tol, coef_bar[2][0], 3);
  });
  it('array call', function () {
    const A = jStat.arange(100).map(function () {
      return jStat.arange(3).map(function () {
        return jStat.normal.sample(0, 1);
      });
    });
    const e = jStat.arange(100).map(function () {
      return [jStat.normal.sample(0, 1) * 0.001];
    });
    const coef = [[1], [2], [3]];
    let y = jStat.add(jStat.multiply(A, coef), e);
    y = y.map(function (i) {
      return i[0];
    });
    const coef_bar = jStat.lstsq(A, y);
    const tol = 0.1;
    assertEpsilon(tol, coef_bar[0], 1);
    assertEpsilon(tol, coef_bar[1], 2);
    assertEpsilon(tol, coef_bar[2], 3);
  });
});
