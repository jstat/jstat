var { describe, it } = require('node:test');
var assert = require('node:assert/strict');
var { jStat } = require('../helpers.js');

describe('cumsum', function() {
    it('return basic cumsum', function() {
        assert.deepStrictEqual(jStat.cumsum([1, 2, 3]), [1, 3, 6]);
    });
    it('cumsum from instance', function() {
        assert.deepStrictEqual(jStat([1, 2, 3]).cumsum(), [1, 3, 6]);
    });
    it('cumsum matrix cols', function() {
        assert.deepStrictEqual(jStat([[1, 2], [3, 4]]).cumsum(), [[1, 4], [2, 6]]);
    });
    it('cumsum matrix rows', function() {
        assert.deepStrictEqual(jStat([[1, 2], [3, 4]]).cumsum(true), [[1, 3], [3, 7]]);
    });
});

describe('#cumsum vector', function() {
    it('cumsum callback', function(t, done) {
        jStat([1, 2, 3]).cumsum(function(val) {
            assert.deepStrictEqual(val, [1, 3, 6]);
            done();
        });
    });
});

describe('#cumsum matrix cols', function() {
    it('cumsum matrix cols callback', function(t, done) {
        jStat([[1, 2], [3, 4]]).cumsum(function(val) {
            assert.deepStrictEqual(val, [[1, 4], [2, 6]]);
            done();
        });
    });
});

describe('#cumsum matrix rows', function() {
    it('cumsum matrix rows callback', function(t, done) {
        jStat([[1, 2], [3, 4]]).cumsum(true, function(val) {
            assert.deepStrictEqual(val, [[1, 3], [3, 7]]);
            done();
        });
    });
});
