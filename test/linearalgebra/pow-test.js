var { describe, it } = require('node:test');
var assert = require('node:assert/strict');
var { jStat } = require('../helpers.js');

describe('linearalgebra', function() {
    it('pow function works', function() {
        var A = jStat([[1, 2], [3, 4]]);
        assert.deepStrictEqual(A.pow(2), jStat([[1, 4], [9, 16]]));
    });
});
