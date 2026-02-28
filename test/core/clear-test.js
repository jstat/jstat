const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { jStat } = require('../helpers.js');

describe('clear', function () {
  it('return clear', function () {
    const toclear = [
      [1, 2],
      [3, 4]
    ];
    jStat.clear(toclear);
    assert.deepStrictEqual(toclear, [
      [0, 0],
      [0, 0]
    ]);
  });
  it('clear from empty jStat object', function () {
    const toclear = jStat([
      [1, 2],
      [3, 4]
    ]);
    toclear.clear();
    assert.strictEqual(toclear instanceof jStat, true);
    assert.deepStrictEqual(toclear.toArray(), [
      [0, 0],
      [0, 0]
    ]);
  });
});
