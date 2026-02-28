const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { jStat } = require('../helpers.js');

describe('sliceAssign', function () {
  it('crop assign', function () {
    const A = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9]
    ];
    jStat.sliceAssign(A, { row: { start: 1 }, col: { start: 1 } }, [
      [1, 0],
      [0, 1]
    ]);
    assert.deepStrictEqual(A, [
      [1, 2, 3],
      [4, 1, 0],
      [7, 0, 1]
    ]);
  });
  it('row assign', function () {
    const A = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9]
    ];
    jStat.sliceAssign(A, { row: 1 }, [-1, -1, -1]);
    assert.deepStrictEqual(A, [
      [1, 2, 3],
      [-1, -1, -1],
      [7, 8, 9]
    ]);
  });
  it('col assign', function () {
    const A = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9]
    ];
    jStat.sliceAssign(A, { col: 1 }, [-1, -1, -1]);
    assert.deepStrictEqual(A, [
      [1, -1, 3],
      [4, -1, 6],
      [7, -1, 9]
    ]);
  });
});
