var { describe, it } = require('node:test');
var assert = require('node:assert/strict');
var { jStat, assertEpsilon } = require('../helpers.js');

describe('arange-test', function() {
    it('example1', function() {
        var arr = jStat.arange(5, 1, -1);
        var tol = 0.000001;
        assertEpsilon(tol, arr[0], 5);
        assertEpsilon(tol, arr[1], 4);
        assertEpsilon(tol, arr[2], 3);
        assertEpsilon(tol, arr[3], 2);
    });
});
