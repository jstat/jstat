const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { jStat } = require('../helpers.js');

describe('row', function () {
  it('return row at index', function () {
    assert.deepStrictEqual(
      jStat.row(
        [
          [1, 2],
          [3, 4]
        ],
        1
      ),
      [3, 4]
    );
    assert.deepStrictEqual(
      jStat([
        [1, 2],
        [3, 4]
      ])
        .row(1)
        .toArray(),
      [3, 4]
    );
  });
  it('return sub matrix at index list', function () {
    const A = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9]
    ];
    const B = jStat.row(A, [1, 2]);
    assert.deepStrictEqual(B, [
      [4, 5, 6],
      [7, 8, 9]
    ]);
  });
});

describe('#row', function () {
  it('row callback', function (t, done) {
    jStat([
      [1, 2],
      [3, 4]
    ]).row(0, function (val) {
      assert.deepStrictEqual(val.toArray(), [1, 2]);
      assert.strictEqual(this instanceof jStat, true);
      done();
    });
  });
});
