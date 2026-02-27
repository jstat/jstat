var { describe, it } = require('node:test');
var assert = require('node:assert/strict');
var { jStat, assertEpsilon } = require('../helpers.js');

describe('meandev', function() {
    it('return basic meandev', function() {
        assertEpsilon(0.0000001, jStat.meandev([4, 5, 7, 22, 90, 1, 4, 5]), 19.375);
    });
    it('meandev from instance', function() {
        assertEpsilon(0.0000001, jStat([1, 2, 3, 4]).meandev(), 1);
    });
    it('meandev matrix cols', function() {
        assert.deepStrictEqual(jStat([[1, 2], [3, 4]]).meandev(), [1, 1]);
    });
});

describe('#meandev vector', function() {
    it('meandev callback', function(t, done) {
        jStat([1, 2, 3, 4]).meandev(function(val) {
            assertEpsilon(0.0000001, val, 1);
            done();
        });
    });
});

describe('#meandev matrix cols', function() {
    it('meandev matrix cols callback', function(t, done) {
        jStat([[1, 2], [3, 4]]).meandev(function(val) {
            assert.deepStrictEqual(val, [1, 1]);
            done();
        });
    });
});
