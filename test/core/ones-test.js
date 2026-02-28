const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { jStat } = require('../helpers.js');

describe('ones', function () {
  it('return ones', function () {
    assert.deepStrictEqual(jStat.ones(2, 3), [
      [1, 1, 1],
      [1, 1, 1]
    ]);
    assert.deepStrictEqual(jStat.ones(2), [
      [1, 1],
      [1, 1]
    ]);
  });
  it('ones from empty jStat object', function () {
    assert.strictEqual(jStat().ones(2) instanceof jStat, true);
    assert.deepStrictEqual(jStat().ones(2, 3).toArray(), [
      [1, 1, 1],
      [1, 1, 1]
    ]);
  });
});
