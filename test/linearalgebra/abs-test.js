var { describe, it } = require('node:test');
var assert = require('node:assert/strict');
var { jStat } = require('../helpers.js');

describe('linearalgebra', function() {
    it('abs function works', function() {
        var A = jStat([[1, -1, 0, -10]]);
        assert.deepStrictEqual(A.abs(), jStat([[1, 1, 0, 10]]));
    });
});
