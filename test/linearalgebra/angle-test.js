const { describe, it } = require('node:test');
const { jStat, assertEpsilon } = require('../helpers.js');

describe('linearalgebra', function () {
  it('angle works for a vector', function () {
    const piOverFour = 0.7853981633974484;
    const tol = 0.00000001;
    const A = jStat([[0, 1]]);
    const B = [[2, 2]];
    assertEpsilon(tol, A.angle(B), piOverFour);
  });
});
