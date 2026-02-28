const { describe, it } = require('node:test');
const { jStat, assertEpsilon } = require('../helpers.js');

describe('corrcoeff', function () {
  it('return basic corrcoeff', function () {
    assertEpsilon(0.0000001, jStat.corrcoeff([1, 2, 3, 4], [4, 5, 6, 7]), 1.0000000000000002);
  });
});
