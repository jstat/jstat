const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { jStat } = require('../helpers.js');

describe('linearalgebra', function () {
  it('exp function works', function () {
    const A = jStat([
      [-1, 0],
      [1, 2]
    ]);
    assert.deepStrictEqual(
      A.exp(),
      jStat([
        [Math.exp(-1), 1],
        [Math.E, Math.exp(2)]
      ])
    );
  });
});
