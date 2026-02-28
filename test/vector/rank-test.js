const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { jStat } = require('../helpers.js');

describe('rank', function () {
  it('return basic rank', function () {
    assert.deepStrictEqual(jStat.rank([1, 5, 2]), [1, 3, 2]);
  });
  it('rank from instance', function () {
    assert.deepStrictEqual(jStat([1, 5, 2]).rank(), [1, 3, 2]);
  });
  it('rank matrix cols', function () {
    assert.deepStrictEqual(
      jStat([
        [1, 2],
        [2, 4]
      ]).rank(),
      [
        [1, 2],
        [1, 2]
      ]
    );
  });
  it('return rank with ties', function () {
    assert.deepStrictEqual(jStat.rank([5, 5, 2]), [2.5, 2.5, 1]);
  });
});
