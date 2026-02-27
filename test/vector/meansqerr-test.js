var { describe, it } = require('node:test');
var assert = require('node:assert/strict');
var { jStat, assertEpsilon } = require('../helpers.js');

describe('meansqerr', function() {
    it('return basic meansqerr', function() {
        assertEpsilon(0.0000001, jStat.meansqerr([1, 2, 3, 4]), 1.25);
    });
    it('meansqerr from instance', function() {
        assertEpsilon(0.0000001, jStat([1, 2, 3, 4]).meansqerr(), 1.25);
    });
    it('meansqerr matrix cols', function() {
        assert.deepStrictEqual(jStat([[1, 2], [3, 4]]).meansqerr(), [1, 1]);
    });
});

describe('#meansqerr vector', function() {
    it('meansqerr callback', function(t, done) {
        jStat([1, 2, 3, 4]).meansqerr(function(val) {
            assertEpsilon(0.0000001, val, 1.25);
            done();
        });
    });
});

describe('#meansqerr matrix cols', function() {
    it('meansqerr matrix cols callback', function(t, done) {
        jStat([[1, 2], [3, 4]]).meansqerr(function(val) {
            assert.deepStrictEqual(val, [1, 1]);
            done();
        });
    });
});
