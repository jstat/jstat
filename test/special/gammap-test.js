var { describe, it } = require('node:test');
var assert = require('node:assert/strict');
var { jStat, assertEpsilon } = require('../helpers.js');

describe('gammap', function() {
  // Checked against Mathematica Gamma[a, 0, x]
  // Also checked against R's gammainc(x, a) via the pracma library
  // gammainc() outputs three values, this matches 'lowinc'
  it('check gammap', function() {
    var tol = 0.000001;
    assertEpsilon(tol, jStat.gammap(5, 5), 13.4281611);
    assertEpsilon(tol, jStat.gammap(5, 4), 8.90791355);
    assertEpsilon(tol, jStat.gammap(5, 7), 19.8482014);
  });
});
