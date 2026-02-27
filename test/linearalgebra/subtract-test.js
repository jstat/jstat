var { describe, it } = require('node:test');
var assert = require('node:assert/strict');
var { jStat } = require('../helpers.js');

describe('linearalgebra', function() {
    it('subtracting a matrix works', function() {
        var A = jStat([[1, 2, 3]]);
        var B = [[4, 5, -6]];
        assert.deepStrictEqual(A.subtract(B), jStat([[-3, -3, 9]]));
    });
    it('subtracting a scalar works', function() {
        var A = jStat([[1, 2, 3]]);
        assert.deepStrictEqual(A.subtract(100), jStat([[-99, -98, -97]]));
    });
});
