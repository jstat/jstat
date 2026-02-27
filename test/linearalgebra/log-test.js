var { describe, it } = require('node:test');
var assert = require('node:assert/strict');
var { jStat } = require('../helpers.js');

describe('linearalgebra', function() {
    it('log function works', function() {
        var A = jStat([[1, Math.E], [Math.exp(5), Math.exp(10)]]);
        assert.deepStrictEqual(A.log(), jStat([[0, 1], [5, 10]]));
    });
});
