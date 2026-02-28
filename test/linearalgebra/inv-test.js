const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { jStat } = require('../helpers.js');

describe('linearalgebra', function () {
  it('sanity: inv of ident is ident', function () {
    const A = [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1]
    ];
    const B = [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1]
    ];
    assert.deepStrictEqual(jStat.inv(A), B);
  });
});
