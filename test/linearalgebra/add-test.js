var { describe, it } = require('node:test');
var assert = require('node:assert/strict');
var { jStat } = require('../helpers.js');

describe('linearalgebra', function() {
    it('adding matricies works', function() {
        var A = jStat([[1, 2, 3]]);
        var B = [[4, 5, -6]];
        assert.deepStrictEqual(A.add(B), jStat([[5, 7, -3]]));
    });
    it('adding a scalar works', function() {
        var A = jStat([[1, 2, 3]]);
        assert.deepStrictEqual(A.add(100), jStat([[101, 102, 103]]));
    });
});
