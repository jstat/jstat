const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { jStat } = require('../helpers.js');

describe('diff', function () {
  it('return basic diff', function () {
    assert.deepStrictEqual(jStat.diff([1, 2, 3]), [1, 1]);
  });
  it('diff from instance', function () {
    assert.deepStrictEqual(jStat([1, 2, 3]).diff(), [1, 1]);
  });
  it('diff matrix cols', function () {
    assert.deepStrictEqual(
      jStat([
        [1, 2],
        [3, 4]
      ]).diff(),
      [[2], [2]]
    );
  });
});

describe('#diff vector', function () {
  it('diff callback', function (t, done) {
    jStat([1, 2, 3]).diff(function (val) {
      assert.deepStrictEqual(val, [1, 1]);
      done();
    });
  });
});

describe('#diff matrix cols', function () {
  it('diff matrix cols callback', function (t, done) {
    jStat([
      [1, 2],
      [3, 4]
    ]).diff(function (val) {
      assert.deepStrictEqual(val, [[2], [2]]);
      done();
    });
  });
});
