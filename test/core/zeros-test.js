const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { jStat } = require('../helpers.js');

describe('zeros', function () {
  it('return zeros', function () {
    assert.deepStrictEqual(jStat.zeros(2, 3), [
      [0, 0, 0],
      [0, 0, 0]
    ]);
    assert.deepStrictEqual(jStat.zeros(2), [
      [0, 0],
      [0, 0]
    ]);
  });
  it('zeros from empty jStat object', function () {
    assert.strictEqual(jStat().zeros(2) instanceof jStat, true);
    assert.deepStrictEqual(jStat().zeros(2, 3).toArray(), [
      [0, 0, 0],
      [0, 0, 0]
    ]);
  });
});
