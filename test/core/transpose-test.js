const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { jStat } = require('../helpers.js');

describe('transpose', function () {
  it('return transpose', function () {
    assert.deepStrictEqual(
      jStat.transpose([
        [1, 2],
        [3, 4]
      ]),
      [
        [1, 3],
        [2, 4]
      ]
    );
    assert.deepStrictEqual(
      jStat([
        [1, 2],
        [3, 4]
      ])
        .transpose()
        .toArray(),
      [
        [1, 3],
        [2, 4]
      ]
    );
  });
});

describe('#transpose', function () {
  it('transpose callback', function (t, done) {
    jStat([
      [1, 2],
      [3, 4]
    ]).transpose(function (val) {
      assert.deepStrictEqual(val.toArray(), [
        [1, 3],
        [2, 4]
      ]);
      done();
    });
  });
});
