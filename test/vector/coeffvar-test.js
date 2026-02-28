const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { jStat, assertEpsilon } = require('../helpers.js');

describe('coeffvar', function () {
  it('return basic coeffvar', function () {
    assertEpsilon(0.0000001, jStat.coeffvar([1, 2, 3, 4]), 0.447213595499958);
  });
  it('coeffvar from instance', function () {
    assertEpsilon(0.0000001, jStat([1, 2, 3, 4]).coeffvar(), 0.447213595499958);
  });
  it('coeffvar matrix cols', function () {
    assert.deepStrictEqual(
      jStat([
        [1, 2],
        [4, 6]
      ]).coeffvar(),
      [0.6, 0.5]
    );
  });
});

describe('#coeffvar vector', function () {
  it('coeffvar callback', function (t, done) {
    jStat([1, 2, 3, 4]).coeffvar(function (val) {
      assertEpsilon(0.0000001, val, 0.447213595499958);
      done();
    });
  });
});

describe('#coeffvar matrix cols', function () {
  it('coeffvar matrix cols callback', function (t, done) {
    jStat([
      [1, 2],
      [4, 6]
    ]).coeffvar(function (val) {
      assert.deepStrictEqual(val, [0.6, 0.5]);
      done();
    });
  });
});
