var { describe, it } = require('node:test');
var assert = require('node:assert/strict');
var { jStat, assertEpsilon } = require('../helpers.js');

describe('outer', function() {
    it('example1', function() {
        var a = [1, 2, 3];
        var b = [4, 5, 6];
        var A = jStat.outer(a, b);
        var tol = 0.0001;
        assertEpsilon(tol, A[0][0], 4);
        assertEpsilon(tol, A[0][1], 5);
        assertEpsilon(tol, A[0][2], 6);
        assertEpsilon(tol, A[1][0], 8);
        assertEpsilon(tol, A[1][1], 10);
        assertEpsilon(tol, A[1][2], 12);
        assertEpsilon(tol, A[2][0], 12);
        assertEpsilon(tol, A[2][1], 15);
        assertEpsilon(tol, A[2][2], 18);
    });
});
