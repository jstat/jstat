var { describe, it } = require('node:test');
var assert = require('node:assert/strict');
var { jStat, assertEpsilon } = require('../helpers.js');

describe('triaUpSolve', function() {
    it('array call', function() {
        var A = [[1, 2, 3], [0, 4, 5], [0, 0, 6]];
        var b = [8, 9, 10];
        var coef = jStat.triaUpSolve(A, b);
        var tol = 0.0001;
        assertEpsilon(tol, coef[0], 2.66666666);
        assertEpsilon(tol, coef[1], 0.16666666);
        assertEpsilon(tol, coef[2], 1.66666666);
    });
    it('matrix call', function() {
        var A = [[1, 2, 3], [0, 4, 5], [0, 0, 6]];
        var b = [[8], [9], [10]];
        var coef = jStat.triaUpSolve(A, b);
        var tol = 0.0001;
        assertEpsilon(tol, coef[0][0], 2.66666666);
        assertEpsilon(tol, coef[1][0], 0.16666666);
        assertEpsilon(tol, coef[2][0], 1.66666666);
    });
});
