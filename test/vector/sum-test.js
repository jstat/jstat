const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { jStat } = require('../helpers.js');

describe('sum', function () {
  it('return basic sum', function () {
    assert.strictEqual(jStat.sum([1, 2, 3]), 6);
  });
  it('sum from instance', function () {
    assert.strictEqual(jStat([1, 2, 3]).sum(), 6);
  });
  it('sum matrix cols', function () {
    assert.deepStrictEqual(
      jStat([
        [1, 2],
        [3, 4]
      ]).sum(),
      [4, 6]
    );
  });
  it('sum full matrix', function () {
    assert.strictEqual(
      jStat([
        [1, 2],
        [3, 4]
      ]).sum(true),
      10
    );
  });
});

describe('#sum vector', function () {
  it('sum callback', function (t, done) {
    jStat([1, 2, 3]).sum(function (val) {
      assert.strictEqual(val, 6);
      done();
    });
  });
});

describe('#sum matrix cols', function () {
  it('sum matrix cols callback', function (t, done) {
    jStat([
      [1, 2],
      [3, 4]
    ]).sum(function (val) {
      assert.deepStrictEqual(val, [4, 6]);
      done();
    });
  });
});

describe('#sum full matrix', function () {
  it('sum full matrix callback', function (t, done) {
    jStat([
      [1, 2],
      [3, 4]
    ]).sum(true, function (val) {
      assert.strictEqual(val, 10);
      done();
    });
  });
});
