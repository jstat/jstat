const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { jStat } = require('../helpers.js');

describe('unique', function () {
  it('return basic unique', function () {
    assert.deepStrictEqual(jStat.unique([1, 2, 1]), [1, 2]);
  });
  it('unique from instance', function () {
    assert.deepStrictEqual(jStat([1, 2, 1]).unique(), [1, 2]);
  });
  it('unique matrix cols', function () {
    assert.deepStrictEqual(
      jStat([
        [1, 2],
        [1, 4]
      ]).unique(),
      [[1], [2, 4]]
    );
  });
});
