const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { jStat } = require('../helpers.js');

describe('mean', function () {
  it('return basic mean', function () {
    assert.strictEqual(jStat.mean([1, 2, 3]), 2);
  });
  it('mean from instance', function () {
    assert.strictEqual(jStat([1, 2, 3]).mean(), 2);
  });
  it('mean matrix cols', function () {
    assert.deepStrictEqual(
      jStat([
        [1, 2],
        [3, 4]
      ]).mean(),
      [2, 3]
    );
  });
  it('mean full matrix', function () {
    assert.strictEqual(
      jStat([
        [1, 2],
        [3, 4]
      ]).mean(true),
      2.5
    );
  });
});

describe('#mean vector', function () {
  it('mean callback', function (t, done) {
    jStat([1, 2, 3]).mean(function (val) {
      assert.strictEqual(val, 2);
      done();
    });
  });
});

describe('#mean matrix cols', function () {
  it('mean matrix cols callback', function (t, done) {
    jStat([
      [1, 2],
      [3, 4]
    ]).mean(function (val) {
      assert.deepStrictEqual(val, [2, 3]);
      done();
    });
  });
});

describe('#mean full matrix', function () {
  it('mean full matrix callback', function (t, done) {
    jStat([
      [1, 2],
      [3, 4]
    ]).mean(true, function (val) {
      assert.strictEqual(val, 2.5);
      done();
    });
  });
});
