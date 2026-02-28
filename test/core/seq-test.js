const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { jStat } = require('../helpers.js');

describe('seq', function () {
  it('return seq', function () {
    assert.deepStrictEqual(jStat.seq(0, 1, 5), [0, 0.25, 0.5, 0.75, 1]);
    assert.deepStrictEqual(
      jStat.seq(0, 1, 5, function (x) {
        return x * 2;
      }),
      [0, 0.5, 1, 1.5, 2]
    );
    assert.deepStrictEqual(jStat.seq(-1, 1, 5), [-1, -0.5, 0, 0.5, 1]);
    assert.deepStrictEqual(jStat.seq(1, 1, 5), [1, 1, 1, 1, 1]);
    assert.deepStrictEqual(
      jStat.seq(2, 2, 6, function (x) {
        return x * 2;
      }),
      [4, 4, 4, 4, 4, 4]
    );
  });
  it('seq from jStat object', function () {
    assert.deepStrictEqual(jStat(0, 1, 5).toArray(), [0, 0.25, 0.5, 0.75, 1]);
  });
});
