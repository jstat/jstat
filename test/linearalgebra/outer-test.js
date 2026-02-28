const { describe, it } = require('node:test');
const { jStat, assertEpsilon } = require('../helpers.js');

describe('outer', function () {
  it('example1', function () {
    const a = [1, 2, 3];
    const b = [4, 5, 6];
    const A = jStat.outer(a, b);
    const tol = 0.0001;
    assertEpsilon(tol, A[0][0], 4);
    assertEpsilon(tol, A[0][1], 5);
    assertEpsilon(tol, A[0][2], 6);
    assertEpsilon(tol, A[1][0], 8);
    assertEpsilon(tol, A[1][1], 10);
    assertEpsilon(tol, A[1][2], 12);
    assertEpsilon(tol, A[2][0], 12);
    assertEpsilon(tol, A[2][1], 15);
    assertEpsilon(tol, A[2][2], 18);
  });
});
