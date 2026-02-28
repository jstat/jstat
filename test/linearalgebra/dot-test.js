const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { jStat } = require('../helpers.js');

describe('linearalgebra', function () {
  it('dot product works', function () {
    const A = jStat([1, 2, 3]);
    const B = [5, -2, 10];
    assert.strictEqual(jStat.dot(A, B), 31);
    assert.strictEqual(A.dot(B), 31);
  });
});
