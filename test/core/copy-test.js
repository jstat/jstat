const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { jStat } = require('../helpers.js');

describe('copy-test', function () {
  it('example1', function () {
    const A = [
      [1, 2],
      [3, 4]
    ];
    const B = A;
    B[0][0] = 0;
    assert.strictEqual(A[0][0], 0);
    const C = jStat.copy(A);
    C[0][0] = -1;
    assert.strictEqual(A[0][0], 0);
  });
});
