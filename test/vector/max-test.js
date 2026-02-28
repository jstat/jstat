const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { jStat } = require('../helpers.js');

describe('max', function () {
  it('return basic max', function () {
    assert.strictEqual(jStat.max([1, 2, 3]), 3);
  });
  it('max from instance', function () {
    assert.strictEqual(jStat([1, 2, 3]).max(), 3);
  });
  it('max matrix cols', function () {
    assert.deepStrictEqual(
      jStat([
        [1, 2],
        [3, 4]
      ]).max(),
      [3, 4]
    );
  });
  it('max full matrix', function () {
    assert.strictEqual(
      jStat([
        [1, 2],
        [3, 4]
      ]).max(true),
      4
    );
  });
});

describe('#max vector', function () {
  it('max callback', function (t, done) {
    jStat([1, 2, 3]).max(function (val) {
      assert.strictEqual(val, 3);
      done();
    });
  });
});

describe('#max matrix cols', function () {
  it('max matrix cols callback', function (t, done) {
    jStat([
      [1, 2],
      [3, 4]
    ]).max(function (val) {
      assert.deepStrictEqual(val, [3, 4]);
      done();
    });
  });
});

describe('#max full matrix', function () {
  it('max full matrix callback', function (t, done) {
    jStat([
      [1, 2],
      [3, 4]
    ]).max(true, function (val) {
      assert.strictEqual(val, 4);
      done();
    });
  });
});
