var { describe, it } = require('node:test');
var assert = require('node:assert/strict');
var { jStat } = require('../helpers.js');

function cloneMatrix(m) {
    var n = [];
    for (var i = 0; i < m.length; i++) {
        n.push(m[i].slice());
    }
    return n;
}

describe('linearalgebra', function() {
    it('aug function works', function() {
        var A = jStat([[1, 2], [3, 4]]);
        var B = [[5], [6]];
        assert.deepStrictEqual(jStat.aug(A, B), [[1, 2, 5], [3, 4, 6]]);
    });
    it('aug no mutate inputs', function() {
        var A = [[1, 2], [3, 4]];
        var B = [[5, 6], [7, 8]];
        var cloneA = cloneMatrix(A);
        var cloneB = cloneMatrix(B);
        assert.deepStrictEqual(jStat.aug(A, B), [[1, 2, 5, 6], [3, 4, 7, 8]]);
        assert.deepStrictEqual(A, cloneA);
        assert.deepStrictEqual(B, cloneB);
    });
});
