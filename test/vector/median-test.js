var { describe, it } = require('node:test');
var assert = require('node:assert/strict');
var { jStat, assertEpsilon } = require('../helpers.js');

describe('median', function() {
    it('return basic median', function() {
        assert.strictEqual(jStat.median([1, 2, 3]), 2);
    });
    it('median from instance', function() {
        assert.strictEqual(jStat([1, 2, 3]).median(), 2);
    });
    it('median matrix cols', function() {
        assert.deepStrictEqual(jStat([[1, 2], [3, 4]]).median(), [2, 3]);
    });
    it('median full matrix', function() {
        assertEpsilon(0.0000001, jStat([[1, 2], [3, 4]]).median(true), 2.5);
    });
});

describe('#median vector', function() {
    it('median callback', function(t, done) {
        jStat([1, 2, 3]).median(function(val) {
            assert.strictEqual(val, 2);
            done();
        });
    });
});

describe('#median matrix cols', function() {
    it('median matrix cols callback', function(t, done) {
        jStat([[1, 2], [3, 4]]).median(function(val) {
            assert.deepStrictEqual(val, [2, 3]);
            done();
        });
    });
});

describe('#median full matrix', function() {
    it('median full matrix callback', function(t, done) {
        jStat([[1, 2], [3, 4]]).median(true, function(val) {
            assert.strictEqual(val, 2.5);
            done();
        });
    });
});
