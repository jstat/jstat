var { describe, it } = require('node:test');
var assert = require('node:assert/strict');
var { jStat, assertEpsilon } = require('../helpers.js');

describe('triaLowSolve', function() {
    it('array call', function() {
        var A = [[1, 0, 0], [2, 3, 0], [4, 5, 6]];
        var b = [7, 8, 9];
        var coef = jStat.triaLowSolve(A, b);
        var tol = 0.0001;
        assertEpsilon(tol, coef[0], 7.0);
        assertEpsilon(tol, coef[1], -2.0);
        assertEpsilon(tol, coef[2], -1.5);
    });
    it('matrix call', function() {
        var A = [[1, 0, 0], [2, 3, 0], [4, 5, 6]];
        var b = [[7], [8], [9]];
        var coef = jStat.triaLowSolve(A, b);
        var tol = 0.0001;
        assertEpsilon(tol, coef[0][0], 7.0);
        assertEpsilon(tol, coef[1][0], -2.0);
        assertEpsilon(tol, coef[2][0], -1.5);
    });
});
