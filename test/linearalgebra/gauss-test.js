var { describe, it } = require('node:test');
var assert = require('node:assert/strict');
var { jStat, assertEpsilon } = require('../helpers.js');

describe('linearalgebra', function() {
    // See "gauss elimination {{1, -3, 1, 4}, {2, -8, 8, -2}, {-6, 3, -15, 9}}"
    // on Wolfram Alpha
    it('gauss elimination example 1', function() {
        var A = [[1, -3, 1], [2, -8, 8], [-6, 3, -15]];
        var B = [[4], [-2], [9]];
        var tol = 0.000001;
        var result = jStat.gauss_elimination(A, B);
        assertEpsilon(tol, result[0], 3);
        assertEpsilon(tol, result[1], -1);
        assertEpsilon(tol, result[2], -2);
    });
    // See "gauss elimination {{1, 1, 3}, {3, -2, 4}}" on Wolfram Alpha
    it('gauss elimination example 2', function() {
        var A = [[1, 1], [3, -2]];
        var B = [[3], [4]];
        var tol = 0.000001;
        var result = jStat.gauss_elimination(A, B);
        assertEpsilon(tol, result[0], 2);
        assertEpsilon(tol, result[1], 1);
    });
    //Sanity check, should not do anything if already solved
    it('gauss elimination example 3', function() {
        var A = jStat.identity(4);
        var B = [[1], [2], [3], [4]];
        var result = jStat.gauss_elimination(A, B);
        var tol = 0.000001;
        assertEpsilon(tol, result[0], 1);
        assertEpsilon(tol, result[1], 2);
        assertEpsilon(tol, result[2], 3);
        assertEpsilon(tol, result[3], 4);
    });
    // Use "{{1,1,1,1,10}, {0,1,1,1,9},{0,0,1,1,7},{0,0,0,1,4}}" on Wolfram
    // Since the matrix already has a lower left hand zero triangle, this just
    // tests the back-substitution portion of the algorithm
    it('gauss elimination example 4', function() {
        var A = [[1, 1, 1, 1], [0, 1, 1, 1], [0, 0, 1, 1], [0, 0, 0, 1]];
        var B = [[10], [9], [7], [4]];
        var result = jStat.gauss_elimination(A, B);
        var tol = 0.000001;
        assertEpsilon(tol, result[3], 4);
        assertEpsilon(tol, result[2], 3);
        assertEpsilon(tol, result[1], 2);
        assertEpsilon(tol, result[0], 1);
    });
});
