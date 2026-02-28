const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { jStat } = require('../helpers.js');

describe('min', function () {
  it('return basic min', function () {
    assert.strictEqual(jStat.min([1, 2, 3]), 1);
  });
  it('min from instance', function () {
    assert.strictEqual(jStat([1, 2, 3]).min(), 1);
  });
  it('min matrix cols', function () {
    assert.deepStrictEqual(
      jStat([
        [1, 2],
        [3, 4]
      ]).min(),
      [1, 2]
    );
  });
  it('min full matrix', function () {
    assert.strictEqual(
      jStat([
        [1, 2],
        [3, 4]
      ]).min(true),
      1
    );
  });
});

describe('#min vector', function () {
  it('min callback', function (t, done) {
    jStat([1, 2, 3]).min(function (val) {
      assert.strictEqual(val, 1);
      done();
    });
  });
});

describe('#min matrix cols', function () {
  it('min matrix cols callback', function (t, done) {
    jStat([
      [1, 2],
      [3, 4]
    ]).min(function (val) {
      assert.deepStrictEqual(val, [1, 2]);
      done();
    });
  });
});

describe('#min full matrix', function () {
  it('min full matrix callback', function (t, done) {
    jStat([
      [1, 2],
      [3, 4]
    ]).min(true, function (val) {
      assert.strictEqual(val, 1);
      done();
    });
  });
});
