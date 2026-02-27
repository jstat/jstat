var { describe, it } = require('node:test');
var assert = require('node:assert/strict');
var { jStat } = require('../helpers.js');

describe('linearalgebra', function() {
    it('scalar division works', function() {
        var A = jStat([[10, 20, 30]]);
        assert.deepStrictEqual(A.divide(10), jStat([[1, 2, 3]]));
    });
});
