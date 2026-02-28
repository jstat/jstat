const { describe, it } = require('node:test');
const { jStat, assertEpsilon } = require('../helpers.js');

describe('diagonal', function () {
  it('example1', function () {
    const A = jStat.diagonal(jStat.arange(3));
    const tol = 0.000001;
    assertEpsilon(tol, A[0][0], 0);
    assertEpsilon(tol, A[0][1], 0);
    assertEpsilon(tol, A[0][2], 0);
    assertEpsilon(tol, A[1][0], 0);
    assertEpsilon(tol, A[1][1], 1);
    assertEpsilon(tol, A[1][2], 0);
    assertEpsilon(tol, A[2][0], 0);
    assertEpsilon(tol, A[2][1], 0);
    assertEpsilon(tol, A[2][2], 2);
  });
});
