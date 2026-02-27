var { describe, it } = require('node:test');
var assert = require('node:assert/strict');
var { jStat } = require('../helpers.js');

describe('linearalgebra', function() {
    it('sanity: inv of ident is ident', function() {
        var A = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
        var B = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
        assert.deepStrictEqual(jStat.inv(A), B);
    });
});
