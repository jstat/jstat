const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { jStat } = require('../helpers.js');

describe('map', function () {
  it('return map', function () {
    assert.deepStrictEqual(
      jStat.map(
        [
          [1, 2],
          [3, 4]
        ],
        function (x) {
          return x * 2;
        }
      ),
      [
        [2, 4],
        [6, 8]
      ]
    );
    assert.deepStrictEqual(
      jStat([
        [1, 2],
        [3, 4]
      ])
        .map(function (x) {
          return x * 2;
        })
        .toArray(),
      [
        [2, 4],
        [6, 8]
      ]
    );
  });
});
