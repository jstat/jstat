const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { jStat, assertEpsilon } = require('../helpers.js');

describe('slice-test', function () {
  it('example1', function () {
    const A = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9]
    ];
    const B = jStat.slice(A, { row: { start: 1 }, col: { start: 1 } });
    const tol = 0.001;
    assertEpsilon(tol, B[0][0], A[1][1]);
    assertEpsilon(tol, B[0][1], A[1][2]);
    assertEpsilon(tol, B[1][0], A[2][1]);
    assertEpsilon(tol, B[1][1], A[2][2]);
  });
  it('example2', function () {
    const A = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9]
    ];
    const B = jStat.slice(A, { row: { end: 1 }, col: { start: 1 } });
    const tol = 0.001;
    assertEpsilon(tol, B[0][0], A[0][1]);
    assertEpsilon(tol, B[0][1], A[0][2]);
  });
  it('example3 row slice', function () {
    const A = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9]
    ];
    const B = jStat.slice(A, { row: 2 });
    assert.deepStrictEqual(B, [7, 8, 9]);
  });
  it('example3 element slice', function () {
    const A = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9]
    ];
    const n = jStat.slice(A, { row: 2, col: 2 });
    assert.strictEqual(n, 9);
  });
});
