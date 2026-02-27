var { describe, it } = require('node:test');
var assert = require('node:assert/strict');
var { jStat, assertEpsilon } = require('../helpers.js');

describe('gammafn', function() {
  // Checked against Mathematica Gamma[a]
  it('check gammafn', function() {
    var tol = 0.000001;
    assertEpsilon(tol, jStat.gammafn(0.00001), 99999.422794);
    assertEpsilon(tol, jStat.gammafn(0.2), 4.590843);
    assert.strictEqual(jStat.gammafn(10), 362880);
    assert.strictEqual(jStat.gammafn(171.6243769536076), Infinity);
  });
});
