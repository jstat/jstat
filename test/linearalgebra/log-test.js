const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { jStat } = require('../helpers.js');

describe('linearalgebra', function () {
  it('log function works', function () {
    const A = jStat([
      [1, Math.E],
      [Math.exp(5), Math.exp(10)]
    ]);
    assert.deepStrictEqual(
      A.log(),
      jStat([
        [0, 1],
        [5, 10]
      ])
    );
  });
});
