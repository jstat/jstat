const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { jStat } = require('../helpers.js');

describe('geomean', function () {
  it('return basic geomean', function () {
    assert.strictEqual(jStat.geomean([1, 2, 3]), 1.8171205928321397);
  });
  it('geomean from instance', function () {
    assert.strictEqual(jStat([1, 2, 3]).geomean(), 1.8171205928321397);
  });
  it('geomean matrix cols', function () {
    assert.deepStrictEqual(
      jStat([
        [1, 2],
        [3, 4]
      ]).geomean(),
      [1.7320508075688772, 2.8284271247461903]
    );
  });
  it('geomean full matrix', function () {
    assert.strictEqual(
      jStat([
        [1, 2],
        [3, 4]
      ]).geomean(true),
      2.2133638394006434
    );
  });
});

describe('#geomean vector', function () {
  it('geomean callback', function (t, done) {
    jStat([1, 2, 3]).geomean(function (val) {
      assert.strictEqual(val, 1.8171205928321397);
      done();
    });
  });
});

describe('#geomean matrix cols', function () {
  it('geomean matrix cols callback', function (t, done) {
    jStat([
      [1, 2],
      [3, 4]
    ]).geomean(function (val) {
      assert.deepStrictEqual(val, [1.7320508075688772, 2.8284271247461903]);
      done();
    });
  });
});

describe('#geomean full matrix', function () {
  it('geomean full matrix callback', function (t, done) {
    jStat([
      [1, 2],
      [3, 4]
    ]).geomean(true, function (val) {
      assert.strictEqual(val, 2.2133638394006434);
      done();
    });
  });
});
