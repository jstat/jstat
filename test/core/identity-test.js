const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { jStat } = require('../helpers.js');

describe('identity', function () {
  it('return identity', function () {
    assert.deepStrictEqual(jStat.identity(2), [
      [1, 0],
      [0, 1]
    ]);
  });
  it('identity from empty jStat object', function () {
    assert.strictEqual(jStat().identity(2) instanceof jStat, true);
    assert.deepStrictEqual(jStat().identity(2).toArray(), [
      [1, 0],
      [0, 1]
    ]);
  });
});
