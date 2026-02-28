const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { jStat } = require('../helpers.js');

describe('sumrow', function () {
  it('return basic sumrow', function () {
    assert.strictEqual(jStat.sumrow([1, 2, 3]), 6);
  });
  it('sumrow from instance', function () {
    assert.strictEqual(jStat([1, 2, 3]).sumrow(), 6);
  });
  it('sumrow matrix cols', function () {
    assert.deepStrictEqual(
      jStat([
        [1, 2],
        [3, 4]
      ]).sumrow(),
      [3, 7]
    );
  });
  it('sumrow full matrix', function () {
    assert.strictEqual(
      jStat([
        [1, 2],
        [3, 4]
      ]).sumrow(true),
      10
    );
  });
});

describe('#sumrow vector', function () {
  it('sumrow callback', function (t, done) {
    jStat([1, 2, 3]).sumrow(function (val) {
      assert.strictEqual(val, 6);
      done();
    });
  });
});

describe('#sumrow matrix cols', function () {
  it('sumrow matrix cols callback', function (t, done) {
    jStat([
      [1, 2],
      [3, 4]
    ]).sumrow(function (val) {
      assert.deepStrictEqual(val, [3, 7]);
      done();
    });
  });
});

describe('#sumrow full matrix', function () {
  it('sumrow full matrix callback', function (t, done) {
    jStat([
      [1, 2],
      [3, 4]
    ]).sumrow(true, function (val) {
      assert.strictEqual(val, 10);
      done();
    });
  });
});
