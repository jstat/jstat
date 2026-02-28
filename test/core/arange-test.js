const { describe, it } = require('node:test');
const { jStat, assertEpsilon } = require('../helpers.js');

describe('arange-test', function () {
  it('example1', function () {
    const arr = jStat.arange(5, 1, -1);
    const tol = 0.000001;
    assertEpsilon(tol, arr[0], 5);
    assertEpsilon(tol, arr[1], 4);
    assertEpsilon(tol, arr[2], 3);
    assertEpsilon(tol, arr[3], 2);
  });
});
