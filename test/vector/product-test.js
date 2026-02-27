var { describe, it } = require('node:test');
var assert = require('node:assert/strict');
var { jStat } = require('../helpers.js');

describe('product', function() {
    it('return basic product', function() {
        assert.strictEqual(jStat.product([1, 2, 3]), 6);
    });
    it('product from instance', function() {
        assert.strictEqual(jStat([1, 2, 3]).product(), 6);
    });
    it('product matrix cols', function() {
        assert.deepStrictEqual(jStat([[1, 2], [3, 4]]).product(), [3, 8]);
    });
    it('product full matrix', function() {
        assert.strictEqual(jStat([[1, 2], [3, 4]]).product(true), 24);
    });
});

describe('#product vector', function() {
    it('product callback', function(t, done) {
        jStat([1, 2, 3]).product(function(val) {
            assert.strictEqual(val, 6);
            done();
        });
    });
});

describe('#product matrix cols', function() {
    it('product matrix cols callback', function(t, done) {
        jStat([[1, 2], [3, 4]]).product(function(val) {
            assert.deepStrictEqual(val, [3, 8]);
            done();
        });
    });
});

describe('#product full matrix', function() {
    it('product full matrix callback', function(t, done) {
        jStat([[1, 2], [3, 4]]).product(true, function(val) {
            assert.strictEqual(val, 24);
            done();
        });
    });
});
