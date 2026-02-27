var { describe, it } = require('node:test');
var assert = require('node:assert/strict');
var { jStat } = require('../helpers.js');

describe('copy-test', function() {
    it('example1', function() {
        var A = [[1,2],[3,4]];
        var B = A;
        B[0][0] = 0;
        assert.strictEqual(A[0][0], 0);
        var C = jStat.copy(A);
        C[0][0] = -1;
        assert.strictEqual(A[0][0], 0);
    });
});
