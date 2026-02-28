const { describe, it } = require('node:test');
const { jStat, assertEpsilon } = require('../helpers.js');

describe('triaUpSolve', function () {
  it('array call', function () {
    const A = [
      [1, 2, 3],
      [0, 4, 5],
      [0, 0, 6]
    ];
    const b = [8, 9, 10];
    const coef = jStat.triaUpSolve(A, b);
    const tol = 0.0001;
    assertEpsilon(tol, coef[0], 2.66666666);
    assertEpsilon(tol, coef[1], 0.16666666);
    assertEpsilon(tol, coef[2], 1.66666666);
  });
  it('matrix call', function () {
    const A = [
      [1, 2, 3],
      [0, 4, 5],
      [0, 0, 6]
    ];
    const b = [[8], [9], [10]];
    const coef = jStat.triaUpSolve(A, b);
    const tol = 0.0001;
    assertEpsilon(tol, coef[0][0], 2.66666666);
    assertEpsilon(tol, coef[1][0], 0.16666666);
    assertEpsilon(tol, coef[2][0], 1.66666666);
  });
});
