const { describe, it } = require('node:test');
const { jStat, assertEpsilon } = require('../helpers.js');

describe('lu decomposition', function () {
  it('example1', function () {
    const A = [
      [2, 3, 0],
      [0, 1, 0],
      [4, 6, 0]
    ];
    const LU = jStat.lu(A);
    const L = LU[0];
    const U = LU[1];
    const tol = 0.0001;
    assertEpsilon(tol, L[0][0], 1.0);
    assertEpsilon(tol, L[0][1], 0.0);
    assertEpsilon(tol, L[0][2], 0.0);
    assertEpsilon(tol, L[1][0], 0.0);
    assertEpsilon(tol, L[1][1], 1.0);
    assertEpsilon(tol, L[1][2], 0.0);
    assertEpsilon(tol, L[2][0], 2.0);
    assertEpsilon(tol, L[2][1], 0.0);
    assertEpsilon(tol, L[2][2], 1.0);
    assertEpsilon(tol, U[0][0], 2.0);
    assertEpsilon(tol, U[0][1], 3.0);
    assertEpsilon(tol, U[0][2], 0.0);
    assertEpsilon(tol, U[1][0], 0.0);
    assertEpsilon(tol, U[1][1], 1.0);
    assertEpsilon(tol, U[1][2], 0.0);
    assertEpsilon(tol, U[2][0], 0.0);
    assertEpsilon(tol, U[2][1], 0.0);
    assertEpsilon(tol, U[2][2], 0.0);
  });
});
