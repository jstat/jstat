var { describe, it } = require('node:test');
var assert = require('node:assert/strict');
var { jStat, assertEpsilon } = require('../helpers.js');

describe('linearalgebra', function() {
    it('angle works for a vector', function() {
        var piOverFour = 0.7853981633974484;
        var tol = 0.00000001;
        var A = jStat([[0, 1]]);
        var B = [[2, 2]];
        assertEpsilon(tol, A.angle(B), piOverFour);
    });
});
