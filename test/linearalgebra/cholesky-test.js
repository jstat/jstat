const { describe, it } = require('node:test');
const { jStat, assertEpsilon } = require('../helpers.js');

describe('cholesky decomposition', function () {
  it('example1', function () {
    const A = [
      [4, 6, 10],
      [6, 58, 29],
      [10, 29, 38]
    ];
    const T = jStat.cholesky(A);
    const tol = 0.0001;
    assertEpsilon(tol, T[0][0], 2.0);
    assertEpsilon(tol, T[0][1], 0.0);
    assertEpsilon(tol, T[0][2], 0.0);
    assertEpsilon(tol, T[1][0], 3.0);
    assertEpsilon(tol, T[1][1], 7.0);
    assertEpsilon(tol, T[1][2], 0.0);
    assertEpsilon(tol, T[2][0], 5.0);
    assertEpsilon(tol, T[2][1], 2.0);
    assertEpsilon(tol, T[2][2], 3.0);
  });
});
