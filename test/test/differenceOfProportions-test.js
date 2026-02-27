var { describe, it } = require('node:test');
var assert = require('node:assert/strict');
var { jStat } = require('../helpers.js');

describe('differenceOfProportions ', function() {
  it('finds the one sided difference of proportions', function() {
    var p = jStat.fn.oneSidedDifferenceOfProportions(.12, 500, .14, 1000);
    assert.strictEqual(p > 0.14, true);
    assert.strictEqual(p < 0.15, true);

    p = jStat.fn.oneSidedDifferenceOfProportions(.5, 134, .51, 101);
    assert.strictEqual(p > 0.43, true);
    assert.strictEqual(p < 0.44, true);
  });
  it('finds the two sided difference of proportions', function() {
    var p = jStat.fn.twoSidedDifferenceOfProportions(.12, 500, .14, 1000);
    assert.strictEqual(p > 0.28, true);
    assert.strictEqual(p < 0.29, true);

    p = jStat.fn.twoSidedDifferenceOfProportions(.5, 134, .51, 101);
    assert.strictEqual(p > 0.87, true);
    assert.strictEqual(p < 0.88, true);
  });
});
