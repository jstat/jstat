const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { jStat } = require('../helpers.js');

describe('linearalgebra', function () {
  it('scalar division works', function () {
    const A = jStat([[10, 20, 30]]);
    assert.deepStrictEqual(A.divide(10), jStat([[1, 2, 3]]));
  });
});
