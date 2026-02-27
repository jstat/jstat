var { describe, it } = require('node:test');
var assert = require('node:assert/strict');
var { jStat } = require('../helpers.js');

describe('linearalgebra', function() {
    it('exp function works', function() {
        var A = jStat([[-1, 0], [1, 2]]);
        assert.deepStrictEqual(A.exp(), jStat([[Math.exp(-1), 1], [Math.E, Math.exp(2)]]));
    });
});
