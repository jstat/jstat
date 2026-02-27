var { describe, it } = require('node:test');
var assert = require('node:assert/strict');
var { jStat, assertEpsilon } = require('../helpers.js');

describe('diagonal', function() {
    it('example1', function() {
        var A = jStat.diagonal(jStat.arange(3));
        var tol = 0.000001;
        assertEpsilon(tol, A[0][0], 0);
        assertEpsilon(tol, A[0][1], 0);
        assertEpsilon(tol, A[0][2], 0);
        assertEpsilon(tol, A[1][0], 0);
        assertEpsilon(tol, A[1][1], 1);
        assertEpsilon(tol, A[1][2], 0);
        assertEpsilon(tol, A[2][0], 0);
        assertEpsilon(tol, A[2][1], 0);
        assertEpsilon(tol, A[2][2], 2);
    });
});
