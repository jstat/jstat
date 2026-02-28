const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { jStat } = require('../helpers.js');

describe('diag', function () {
  it('return diag', function () {
    assert.deepStrictEqual(
      jStat.diag([
        [1, 2],
        [3, 4]
      ]),
      [[1], [4]]
    );
    assert.deepStrictEqual(
      jStat([
        [1, 2],
        [3, 4]
      ])
        .diag()
        .toArray(),
      [[1], [4]]
    );
  });
});

describe('#diag', function () {
  it('diag callback', function (t, done) {
    jStat([
      [1, 2],
      [3, 4]
    ]).diag(function (val) {
      assert.deepStrictEqual(val.toArray(), [[1], [4]]);
      done();
    });
  });
});
