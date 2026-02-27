var { describe, it } = require('node:test');
var assert = require('node:assert/strict');
var { jStat } = require('../helpers.js');

describe('linearalgebra', function() {
    it('test det on 2x2 matrix', function() {
        var A = [
            [4, 6],
            [3, 8],
        ];
        assert.strictEqual(jStat.det(A), 14);
    });
    it('test det works', function() {
        var A = [[1, 2, 3], [4, 5, -6], [7, -8, 9]];
        assert.strictEqual(jStat.det(A), -360);
    });
    it('test bug #270', function() {
        var A = [
            [310, -228, -190, 108],
            [-228, 310, 108, -190],
            [-190, 108, 310, -228],
            [108, -190, -228, 310],
        ];
        assert.strictEqual(jStat.det(A), 0);
    });
});
