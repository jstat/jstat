const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { jStat } = require('../helpers.js');

describe('mode', function () {
  it('return basic mode', function () {
    assert.strictEqual(jStat.mode([1, 2, 3, 3]), 3);
  });
  it('mode from instance', function () {
    assert.strictEqual(jStat([1, 2, 3, 3]).mode(), 3);
  });
  it('mode matrix cols', function () {
    assert.deepStrictEqual(
      jStat([
        [1, 2],
        [1, 4]
      ]).mode(),
      [1, [2, 4]]
    );
  });
});

describe('#mode vector', function () {
  it('mode callback', function (t, done) {
    jStat([1, 2, 3, 3]).mode(function (val) {
      assert.strictEqual(val, 3);
      done();
    });
  });
});

describe('#mode matrix cols', function () {
  it('mode matrix cols callback', function (t, done) {
    jStat([
      [1, 2],
      [1, 4]
    ]).mode(function (val) {
      assert.deepStrictEqual(val, [1, [2, 4]]);
      done();
    });
  });
});

describe('mode of a matrix', function () {
  it('mode matrix cols with true returns the "mode of the matrix"', function () {
    assert.strictEqual(
      jStat([
        [1, 2],
        [1, 4],
        [1, 4]
      ]).mode(true),
      1
    );
    assert.strictEqual(
      jStat([
        [5, 2],
        [5, 4],
        [5, 4]
      ]).mode(true),
      5
    );
  });
});
