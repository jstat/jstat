const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { jStat } = require('../helpers.js');

describe('linearalgebra', function () {
  it('adding matricies works', function () {
    const A = jStat([[1, 2, 3]]);
    const B = [[4, 5, -6]];
    assert.deepStrictEqual(A.add(B), jStat([[5, 7, -3]]));
  });
  it('adding a scalar works', function () {
    const A = jStat([[1, 2, 3]]);
    assert.deepStrictEqual(A.add(100), jStat([[101, 102, 103]]));
  });
});
