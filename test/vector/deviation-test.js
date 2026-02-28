const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { jStat } = require('../helpers.js');

describe('deviation', function () {
  it('return basic deviation', function () {
    assert.deepStrictEqual(
      jStat.deviation([1, 5, 2]),
      [-1.6666666666666665, 2.3333333333333335, -0.6666666666666665]
    );
  });
  it('deviation from instance', function () {
    assert.deepStrictEqual(
      jStat([1, 5, 2]).deviation(),
      [-1.6666666666666665, 2.3333333333333335, -0.6666666666666665]
    );
  });
  it('deviation matrix cols', function () {
    assert.deepStrictEqual(
      jStat([
        [1, 2],
        [2, 1]
      ]).deviation(),
      [
        [-0.5, 0.5],
        [0.5, -0.5]
      ]
    );
  });
  it('return deviation with equal numbers', function () {
    assert.deepStrictEqual(jStat.deviation([1, 1, 1]), [0, 0, 0]);
  });
});
