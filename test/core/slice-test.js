var { describe, it } = require('node:test');
var assert = require('node:assert/strict');
var { jStat, assertEpsilon } = require('../helpers.js');

describe('slice-test', function() {
    it('example1', function() {
        var A = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
        var B = jStat.slice(A, { row: { start: 1 }, col: { start: 1 }});
        var tol = 0.001;
        assertEpsilon(tol, B[0][0], A[1][1]);
        assertEpsilon(tol, B[0][1], A[1][2]);
        assertEpsilon(tol, B[1][0], A[2][1]);
        assertEpsilon(tol, B[1][1], A[2][2]);
    });
    it('example2', function() {
        var A = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
        var B = jStat.slice(A, { row: { end: 1 }, col: { start: 1 }});
        var tol = 0.001;
        assertEpsilon(tol, B[0][0], A[0][1]);
        assertEpsilon(tol, B[0][1], A[0][2]);
    });
    it('example3 row slice', function() {
        var A = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
        var B = jStat.slice(A, { row: 2 });
        assert.deepStrictEqual(B, [7, 8, 9]);
    });
    it('example3 element slice', function() {
        var A = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
        var n = jStat.slice(A, { row: 2, col: 2 });
        assert.strictEqual(n, 9);
    });
});
