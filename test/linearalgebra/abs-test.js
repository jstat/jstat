const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { jStat } = require('../helpers.js');

describe('linearalgebra', function () {
  it('abs function works', function () {
    const A = jStat([[1, -1, 0, -10]]);
    assert.deepStrictEqual(A.abs(), jStat([[1, 1, 0, 10]]));
  });
});
