const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { jStat } = require('../helpers.js');

describe('jStat', function () {
  it('basic checks', function () {
    assert.strictEqual(typeof jStat.prototype.toArray, 'function');
    assert.strictEqual(typeof jStat.prototype.push, 'function');
    assert.strictEqual(typeof jStat.prototype.sort, 'function');
    assert.strictEqual(typeof jStat.prototype.splice, 'function');

    assert.deepStrictEqual(jStat().toArray(), []);
    assert.deepStrictEqual(jStat(null).toArray(), []);
    assert.deepStrictEqual(jStat(undefined).toArray(), []);
    assert.deepStrictEqual(jStat([]).toArray(), []);

    assert.strictEqual(jStat._init.constructor === jStat, true);
    assert.strictEqual(jStat._init.prototype === jStat.prototype, true);
    assert.strictEqual(jStat() instanceof jStat, true);
    assert.strictEqual(jStat(null) instanceof jStat, true);
    assert.strictEqual(jStat(undefined) instanceof jStat, true);
    assert.strictEqual(jStat([]) instanceof jStat, true);

    assert.strictEqual(jStat.prototype.length, 0);
    assert.strictEqual(jStat([1, 2, 3]).length, 1);
    assert.strictEqual(jStat([1, 2, 3])[0].length, 3);
  });

  it('matrix/vector generation', function () {
    assert.deepStrictEqual(jStat([1, 2, 3]).toArray(), [1, 2, 3]);
    assert.deepStrictEqual(
      jStat([
        [1, 2],
        [3, 4]
      ]).toArray(),
      [
        [1, 2],
        [3, 4]
      ]
    );
    assert.deepStrictEqual(
      jStat(
        jStat([
          [1, 2],
          [3, 4]
        ])
      ).toArray(),
      [
        [1, 2],
        [3, 4]
      ]
    );
    assert.deepStrictEqual(
      jStat(
        [
          [1, 2],
          [3, 4]
        ],
        function (x) {
          return x * 2;
        }
      ).toArray(),
      [
        [2, 4],
        [6, 8]
      ]
    );
  });

  it('sequence generation', function () {
    assert.deepStrictEqual(jStat(0, 0.5, 6).toArray(), [0, 0.1, 0.2, 0.3, 0.4, 0.5]);
    assert.deepStrictEqual(
      jStat(0, 5, 6, function (x) {
        return x * 2;
      }).toArray(),
      [0, 2, 4, 6, 8, 10]
    );
  });
});
