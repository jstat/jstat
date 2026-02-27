var { describe, it } = require('node:test');
var assert = require('node:assert/strict');
var { jStat } = require('../helpers.js');

describe('sumsqrd', function() {
    it('return basic sumsqrd', function() {
        assert.strictEqual(jStat.sumsqrd([1, 2, 3]), 14);
    });
    it('sumsqrd from instance', function() {
        assert.strictEqual(jStat([1, 2, 3]).sumsqrd(), 14);
    });
    it('sumsqrd matrix cols', function() {
        assert.deepStrictEqual(jStat([[1, 2], [3, 4]]).sumsqrd(), [10, 20]);
    });
    it('sumsqrd full matrix', function() {
        assert.strictEqual(jStat([[1, 2], [3, 4]]).sumsqrd(true), 650);
    });
});

describe('#sumsqrd vector', function() {
    it('sumsqrd callback', function(t, done) {
        jStat([1, 2, 3]).sumsqrd(function(val) {
            assert.strictEqual(val, 14);
            done();
        });
    });
});

describe('#sumsqrd matrix cols', function() {
    it('sumsqrd matrix cols callback', function(t, done) {
        jStat([[1, 2], [3, 4]]).sumsqrd(function(val) {
            assert.deepStrictEqual(val, [10, 20]);
            done();
        });
    });
});

describe('#sumsqrd full matrix', function() {
    it('sumsqrd full matrix callback', function(t, done) {
        jStat([[1, 2], [3, 4]]).sumsqrd(true, function(val) {
            assert.strictEqual(val, 650);
            done();
        });
    });
});
