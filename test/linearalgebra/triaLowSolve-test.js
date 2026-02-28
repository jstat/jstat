const { describe, it } = require('node:test');
const { jStat, assertEpsilon } = require('../helpers.js');

describe('triaLowSolve', function () {
  it('array call', function () {
    const A = [
      [1, 0, 0],
      [2, 3, 0],
      [4, 5, 6]
    ];
    const b = [7, 8, 9];
    const coef = jStat.triaLowSolve(A, b);
    const tol = 0.0001;
    assertEpsilon(tol, coef[0], 7.0);
    assertEpsilon(tol, coef[1], -2.0);
    assertEpsilon(tol, coef[2], -1.5);
  });
  it('matrix call', function () {
    const A = [
      [1, 0, 0],
      [2, 3, 0],
      [4, 5, 6]
    ];
    const b = [[7], [8], [9]];
    const coef = jStat.triaLowSolve(A, b);
    const tol = 0.0001;
    assertEpsilon(tol, coef[0][0], 7.0);
    assertEpsilon(tol, coef[1][0], -2.0);
    assertEpsilon(tol, coef[2][0], -1.5);
  });
});
