const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { jStat, assertEpsilon } = require('../helpers.js');

const tol = 0.0000001;

describe('spearman', function () {
  it('return basic spearmancoeff', function () {
    assertEpsilon(tol, jStat.spearmancoeff([1, 2, 3, 4], [5, 6, 9, 7]), 0.8);
  });
  it('return spearmancoeff with ties', function () {
    assertEpsilon(tol, jStat.spearmancoeff([1, 2, 3, 4], [5, 5, 9, 7]), 0.7378647873726218);
  });
  it('return spearmancoeff all ties', function () {
    assert.strictEqual(isNaN(jStat.spearmancoeff([1, 2, 3, 4], [5, 5, 5, 5])), true);
  });
  it('return spearmancoeff unequal arrays', function () {
    assert.strictEqual(isNaN(jStat.spearmancoeff([1, 2, 3, 4], [5, 6, 7])), true);
  });
});
