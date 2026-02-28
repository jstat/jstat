const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { jStat } = require('../helpers.js');

describe('histogram', function () {
  it('returns histogram (bin counts)', function () {
    assert.deepStrictEqual(jStat.histogram([1, 1, 2, 2, 3, 4, 5, 5, 6, 7, 8]), [4, 2, 3, 2]);
  });
  it('histogram from instance', function () {
    assert.deepStrictEqual(jStat([1, 1, 2, 2, 3, 4, 5, 5, 6, 7, 8]).histogram(), [4, 2, 3, 2]);
  });
  it('histogram with numBins parameter', function () {
    assert.deepStrictEqual(
      jStat([1, 1, 2, 2, 3, 4, 5, 5, 6, 7, 8, 10]).histogram(10),
      [2, 2, 1, 1, 2, 1, 1, 1, 0, 1]
    );
  });
  it('histogram with floating point values', function () {
    assert.deepStrictEqual(jStat([0.1, 0.1, 0.3, 0.5]).histogram(3), [2, 1, 1]);
  });
  it('documentation values', function () {
    assert.deepStrictEqual(jStat.histogram([100, 101, 102, 230, 304, 305, 400], 3), [3, 1, 3]);
  });
});
