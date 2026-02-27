var { describe, it } = require('node:test');
var assert = require('node:assert/strict');
var { jStat } = require('../helpers.js');

describe('linearalgebra', function() {
    it('dot product works', function() {
        var A = jStat([1, 2, 3]);
        var B = [5, -2, 10];
        assert.strictEqual(jStat.dot(A, B), 31);
        assert.strictEqual(A.dot(B), 31);
    });
});
