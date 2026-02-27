var { describe, it } = require('node:test');
var assert = require('node:assert/strict');
var { jStat, assertEpsilon } = require('../helpers.js');

describe('variance', function() {
    it('return basic variance', function() {
        assertEpsilon(0.0000001, jStat.variance([1, 2, 3, 4]), 1.25);
    });
    it('return basic variance using sample', function() {
        assertEpsilon(0.0000001, jStat.variance([1, 2, 3, 4, 5], true), 2.5);
    });
    it('variance from instance', function() {
        assertEpsilon(0.0000001, jStat([1, 2, 3, 4]).variance(), 1.25);
    });
    it('variance matrix cols', function() {
        assert.deepStrictEqual(jStat([[1, 2], [3, 4]]).variance(), [1, 1]);
    });
});

describe('#variance vector', function() {
    it('variance callback', function(t, done) {
        jStat([1, 2, 3, 4]).variance(function(val) {
            assertEpsilon(0.0000001, val, 1.25);
            done();
        });
    });
});

describe('#variance matrix cols', function() {
    it('variance matrix cols callback', function(t, done) {
        jStat([[1, 2], [3, 4]]).variance(function(val) {
            assert.deepStrictEqual(val, [1, 1]);
            done();
        });
    });
});
