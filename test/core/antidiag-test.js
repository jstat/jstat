var { describe, it } = require('node:test');
var assert = require('node:assert/strict');
var { jStat } = require('../helpers.js');

describe('antidiag', function() {
    it('return antidiag', function() {
        assert.deepStrictEqual(jStat.antidiag([[1, 2], [3, 4]]), [[2], [3]]);
        assert.deepStrictEqual(jStat([[1, 2], [3, 4]]).antidiag().toArray(),
                               [[2], [3]]);
    });
});

describe('#antidiag', function() {
    it('antidiag callback', function(t, done) {
        jStat([[1, 2], [3, 4]]).antidiag(function(val) {
            assert.deepStrictEqual(val.toArray(), [[2], [3]]);
            done();
        });
    });
});
