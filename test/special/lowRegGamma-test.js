const { describe, it } = require('node:test');
const { jStat, assertEpsilon } = require('../helpers.js');

describe('lowRegGamma', function () {
  // Checked against Mathematica Gamma[a, 0, x]
  // Also checked against R's gammainc(a, x) via the pracma library
  // gammainc() outputs three values, this matches 'reginc'.
  // Note that R and jStat swap the operators; so
  // gammainc(a, x) == jStat.lowRegGamma(x, a)
  it('check lowRegGamma', function () {
    const tol = 0.000001;
    assertEpsilon(tol, jStat.lowRegGamma(5, 5), 0.5595067);
    assertEpsilon(tol, jStat.lowRegGamma(4, 5), 0.7349741);
    assertEpsilon(tol, jStat.lowRegGamma(11, 10), 0.4169602);
  });
});
