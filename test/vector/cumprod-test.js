const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { jStat } = require('../helpers.js');

describe('cumprod', function () {
  it('return basic cumprod', function () {
    assert.deepStrictEqual(jStat.cumprod([1, 2, 3]), [1, 2, 6]);
  });
  it('cumprod from instance', function () {
    assert.deepStrictEqual(jStat([1, 2, 3]).cumprod(), [1, 2, 6]);
  });
  it('cumprod matrix cols', function () {
    assert.deepStrictEqual(
      jStat([
        [1, 2],
        [3, 4]
      ]).cumprod(),
      [
        [1, 3],
        [2, 8]
      ]
    );
  });
  it('cumprod matrix rows', function () {
    assert.deepStrictEqual(
      jStat([
        [1, 2],
        [3, 4]
      ]).cumprod(true),
      [
        [1, 2],
        [3, 12]
      ]
    );
  });
});

describe('#cumprod vector', function () {
  it('cumprod callback', function (t, done) {
    jStat([1, 2, 3]).cumprod(function (val) {
      assert.deepStrictEqual(val, [1, 2, 6]);
      done();
    });
  });
});

describe('#cumprod matrix cols', function () {
  it('cumprod matrix cols callback', function (t, done) {
    jStat([
      [1, 2],
      [3, 4]
    ]).cumprod(function (val) {
      assert.deepStrictEqual(val, [
        [1, 3],
        [2, 8]
      ]);
      done();
    });
  });
});

describe('#cumprod matrix rows', function () {
  it('cumprod matrix rows callback', function (t, done) {
    jStat([
      [1, 2],
      [3, 4]
    ]).cumprod(true, function (val) {
      assert.deepStrictEqual(val, [
        [1, 2],
        [3, 12]
      ]);
      done();
    });
  });
});
