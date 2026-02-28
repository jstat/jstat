const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { jStat } = require('../helpers.js');

describe('ztest ', function () {
  it('(value, mean, sd, sides) pattern works', function () {
    const p = jStat.ztest(1.96, 0, 1, 2);
    assert.strictEqual(p < 0.05, true);
  });
  it('(zscore, sides) pattern works', function () {
    const p = jStat.ztest(1.96, 2);
    assert.strictEqual(p < 0.05, true);
  });
  it('(value, array, sides, flag) pattern works', function () {
    const p = jStat.ztest(1.96, [1, -1], 2);
    assert.strictEqual(p < 0.05, true);
  });
});
