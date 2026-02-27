var { describe, it } = require('node:test');
var assert = require('node:assert/strict');
var { jStat, assertEpsilon } = require('../helpers.js');

describe('sumsqerr', function() {
    it('return basic sumsqerr', function() {
        assertEpsilon(0.0000001, jStat.sumsqerr([1, 2, 3]), 2);
    });
    it('sumsqerr from instance', function() {
        assertEpsilon(0.0000001, jStat([1, 2, 3]).sumsqerr(), 2);
    });
    it('sumsqerr matrix cols', function() {
        assert.deepStrictEqual(jStat([[1, 2], [3, 4]]).sumsqerr(), [2, 2]);
    });
});

describe('#sumsqerr vector', function() {
    it('sumsqerr callback', function(t, done) {
        jStat([1, 2, 3]).sumsqerr(function(val) {
            assertEpsilon(0.0000001, val, 2);
            done();
        });
    });
});

describe('#sumsqerr matrix cols', function() {
    it('sumsqerr matrix cols callback', function(t, done) {
        jStat([[1, 2], [3, 4]]).sumsqerr(function(val) {
            assert.deepStrictEqual(val, [2, 2]);
            done();
        });
    });
});
