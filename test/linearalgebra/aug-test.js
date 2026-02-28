const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { jStat } = require('../helpers.js');

function cloneMatrix(m) {
  const n = [];
  for (let i = 0; i < m.length; i++) {
    n.push(m[i].slice());
  }
  return n;
}

describe('linearalgebra', function () {
  it('aug function works', function () {
    const A = jStat([
      [1, 2],
      [3, 4]
    ]);
    const B = [[5], [6]];
    assert.deepStrictEqual(jStat.aug(A, B), [
      [1, 2, 5],
      [3, 4, 6]
    ]);
  });
  it('aug no mutate inputs', function () {
    const A = [
      [1, 2],
      [3, 4]
    ];
    const B = [
      [5, 6],
      [7, 8]
    ];
    const cloneA = cloneMatrix(A);
    const cloneB = cloneMatrix(B);
    assert.deepStrictEqual(jStat.aug(A, B), [
      [1, 2, 5, 6],
      [3, 4, 7, 8]
    ]);
    assert.deepStrictEqual(A, cloneA);
    assert.deepStrictEqual(B, cloneB);
  });
});
