const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { jStat } = require('../helpers.js');

describe('linearalgebra', function () {
  it('p-norm works for vector defaults to p = 2', function () {
    const A = jStat([[3, 4]]);
    assert.strictEqual(A.norm(), 5);
    const B = jStat([[-3, 4]]);
    assert.strictEqual(B.norm(), 5);
  });
  it('p norm works for vector with p = 1', function () {
    const A = jStat([[1, 2, 3]]);
    assert.strictEqual(A.norm(1), 6);
  });
  it('p norm works for a matrix with p = 2', function () {
    const A = jStat([
      [3, 4],
      [1, 2]
    ]);
    assert.strictEqual(A.norm(), 5);
  });
});
