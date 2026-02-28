const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { jStat } = require('../helpers.js');

describe('range', function () {
  it('return basic range', function () {
    assert.strictEqual(jStat.range([1, 2, 3]), 2);
  });
  it('range from instance', function () {
    assert.strictEqual(jStat([1, 2, 3]).range(), 2);
  });
  it('range matrix cols', function () {
    assert.deepStrictEqual(
      jStat([
        [1, 2],
        [3, 4]
      ]).range(),
      [2, 2]
    );
  });
});

describe('#range vector', function () {
  it('range callback', function (t, done) {
    jStat([1, 2, 3]).range(function (val) {
      assert.strictEqual(val, 2);
      done();
    });
  });
});

describe('#range matrix cols', function () {
  it('range matrix cols callback', function (t, done) {
    jStat([
      [1, 2],
      [3, 4]
    ]).range(function (val) {
      assert.deepStrictEqual(val, [2, 2]);
      done();
    });
  });
});
