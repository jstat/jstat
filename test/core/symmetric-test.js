const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { jStat } = require('../helpers.js');

describe('symmetric', function () {
  it('return symmetric', function () {
    assert.strictEqual(
      jStat.symmetric([
        [1, 2],
        [2, 1]
      ]),
      true
    );
    assert.strictEqual(
      jStat.symmetric([
        [1, 2],
        [1, 2]
      ]),
      false
    );
  });
  it('symmetric from jStat object', function () {
    assert.strictEqual(
      jStat([
        [1, 2],
        [2, 1]
      ]).symmetric(),
      true
    );
    assert.strictEqual(
      jStat([
        [1, 2],
        [1, 2]
      ]).symmetric(),
      false
    );
  });
});
