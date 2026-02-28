const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { jStat, assertEpsilon } = require('../helpers.js');

describe('meddev', function () {
  it('return basic meddev', function () {
    assertEpsilon(0.0000001, jStat.meddev([4, 5, 7, 22, 90, 1, 4, 5]), 1.5);
  });
  it('meddev from instance', function () {
    assertEpsilon(0.0000001, jStat([1, 2, 3, 4]).meddev(), 1);
  });
  it('meddev matrix cols', function () {
    assert.deepStrictEqual(
      jStat([
        [1, 2],
        [3, 4]
      ]).meddev(),
      [1, 1]
    );
  });
});

describe('#meddev vector', function () {
  it('meddev callback', function (t, done) {
    jStat([1, 2, 3, 4]).meddev(function (val) {
      assertEpsilon(0.0000001, val, 1);
      done();
    });
  });
});

describe('#meddev matrix cols', function () {
  it('meddev matrix cols callback', function (t, done) {
    jStat([
      [1, 2],
      [3, 4]
    ]).meddev(function (val) {
      assert.deepStrictEqual(val, [1, 1]);
      done();
    });
  });
});
