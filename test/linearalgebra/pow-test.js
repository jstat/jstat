const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { jStat } = require('../helpers.js');

describe('linearalgebra', function () {
  it('pow function works', function () {
    const A = jStat([
      [1, 2],
      [3, 4]
    ]);
    assert.deepStrictEqual(
      A.pow(2),
      jStat([
        [1, 4],
        [9, 16]
      ])
    );
  });
});
