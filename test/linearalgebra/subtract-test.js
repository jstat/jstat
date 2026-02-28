const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { jStat } = require('../helpers.js');

describe('linearalgebra', function () {
  it('subtracting a matrix works', function () {
    const A = jStat([[1, 2, 3]]);
    const B = [[4, 5, -6]];
    assert.deepStrictEqual(A.subtract(B), jStat([[-3, -3, 9]]));
  });
  it('subtracting a scalar works', function () {
    const A = jStat([[1, 2, 3]]);
    assert.deepStrictEqual(A.subtract(100), jStat([[-99, -98, -97]]));
  });
});
