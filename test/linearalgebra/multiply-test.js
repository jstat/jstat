var { describe, it } = require('node:test');
var assert = require('node:assert/strict');
var { jStat } = require('../helpers.js');

describe('linearalgebra', function() {
    it('test that multipling by a scalar works', function() {
        var A = jStat([[1, 2, 3]]);
        assert.deepStrictEqual(A.multiply(5), jStat([[5, 10, 15]]));
    });
    it('test that multiplying by a matrix works', function() {
        var A = jStat([[1, 2], [3, 4]]);
        var B = [[1, 0], [0, 1]];
        assert.deepStrictEqual(A.multiply(B), jStat([[1, 2], [3, 4]]));
    });
    it('test that multiplying by a nonidentity matrix works', function() {
        var A = jStat([[1, 2], [3, 4]]);
        var B = [[1, 2], [3, 4]];
        assert.deepStrictEqual(A.multiply(B), jStat([[7, 10], [15, 22]]));
    });
});
