const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { jStat, assertEpsilon } = require('../helpers.js');

const tol = 0.0000001;

describe('percentiles', function () {
  it('return basic percentile of score', function () {
    assert.deepStrictEqual(jStat.percentileOfScore([1, 2, 3, 4, 5, 6], 3), 0.5);
    assertEpsilon(tol, jStat.percentileOfScore([1, 2, 3, 4, 5, 6], 5), 0.83333333333333343);
  });
  it('return basic percentile of score: left extreme', function () {
    assert.deepStrictEqual(jStat.percentileOfScore([1, 2, 3, 4, 5, 6], -1), 0.0);
  });
  it('return basic percentile of score: right extreme', function () {
    assert.deepStrictEqual(jStat.percentileOfScore([1, 2, 3, 4, 5, 6], 6), 1.0);
  });
  it('return basic percentile of score (strict)', function () {
    assertEpsilon(
      tol,
      jStat.percentileOfScore([1, 2, 3, 4, 5, 6], 5, 'strict'),
      0.66666666666666657
    );
  });
  it('percentile of score from instance', function () {
    assert.deepStrictEqual(jStat([1, 2, 3, 4, 5, 6]).percentileOfScore(3), 0.5);
  });
  it('percentile of score matrix cols', function () {
    const mat = [
      [1, 1],
      [2, 2],
      [3, 3],
      [4, 4],
      [5, 5],
      [6, 6]
    ];
    assert.deepStrictEqual(jStat(mat).percentileOfScore(3), [0.5, 0.5]);
  });
});
