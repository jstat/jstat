const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { jStat } = require('../helpers.js');

describe('differenceOfProportions ', function () {
  it('finds the one sided difference of proportions', function () {
    let p = jStat.fn.oneSidedDifferenceOfProportions(0.12, 500, 0.14, 1000);
    assert.strictEqual(p > 0.14, true);
    assert.strictEqual(p < 0.15, true);

    p = jStat.fn.oneSidedDifferenceOfProportions(0.5, 134, 0.51, 101);
    assert.strictEqual(p > 0.43, true);
    assert.strictEqual(p < 0.44, true);
  });
  it('finds the two sided difference of proportions', function () {
    let p = jStat.fn.twoSidedDifferenceOfProportions(0.12, 500, 0.14, 1000);
    assert.strictEqual(p > 0.28, true);
    assert.strictEqual(p < 0.29, true);

    p = jStat.fn.twoSidedDifferenceOfProportions(0.5, 134, 0.51, 101);
    assert.strictEqual(p > 0.87, true);
    assert.strictEqual(p < 0.88, true);
  });
});
