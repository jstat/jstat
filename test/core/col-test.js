const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { jStat } = require('../helpers.js');

describe('col', function () {
  it('return col at index', function () {
    assert.deepStrictEqual(
      jStat.col(
        [
          [1, 2],
          [3, 4]
        ],
        1
      ),
      [[2], [4]]
    );
    assert.deepStrictEqual(
      jStat([
        [1, 2],
        [3, 4]
      ])
        .col(1)
        .toArray(),
      [[2], [4]]
    );
  });
  it('return sub matrix at index list', function () {
    const A = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9]
    ];
    const B = jStat.col(A, [1, 2]);
    assert.deepStrictEqual(B, [
      [2, 3],
      [5, 6],
      [8, 9]
    ]);
  });
});

describe('#col', function () {
  it('col callback', function (t, done) {
    jStat([
      [1, 2],
      [3, 4]
    ]).col(0, function (val) {
      assert.deepStrictEqual(val.toArray(), [[1], [3]]);
      assert.strictEqual(this instanceof jStat, true);
      done();
    });
  });
});
