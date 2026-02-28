const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { jStat } = require('../helpers.js');

describe('rows', function () {
  it('number of rows', function () {
    assert.strictEqual(jStat.rows([[1], [4], [5]]), 3);
    assert.strictEqual(jStat([[1], [4], [5]]).rows(), 3);
    assert.strictEqual(jStat([[1], [3]]).rows(function () {}) instanceof jStat, true);
  });
});

describe('#rows', function () {
  it('rows sends value', function (t, done) {
    jStat([
      [1, 2, 3],
      [4, 5, 6]
    ]).rows(function (val) {
      assert.strictEqual(val, 2);
      done();
    });
  });
});
