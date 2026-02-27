var { describe, it } = require('node:test');
var assert = require('node:assert/strict');
var { jStat, assertEpsilon } = require('../helpers.js');

describe('stdev', function() {
    it('return basic stdev', function() {
        assertEpsilon(0.0000001, jStat.stdev([1, 2, 3, 4]), 1.118033988749895);
    });
    it('return basic stdev using sample', function() {
        assertEpsilon(0.0000001, jStat.stdev([1, 2, 3, 4, 5], true), 1.5811388300841898);
    });
    it('stdev from instance', function() {
        assertEpsilon(0.0000001, jStat([1, 2, 3, 4]).stdev(), 1.118033988749895);
    });
    it('stdev matrix cols', function() {
        assert.deepStrictEqual(jStat([[1, 2], [3, 4]]).stdev(), [1, 1]);
    });
});

describe('#stdev vector', function() {
    it('stdev callback', function(t, done) {
        jStat([1, 2, 3, 4]).stdev(function(val) {
            assertEpsilon(0.0000001, val, 1.118033988749895);
            done();
        });
    });
});

describe('#stdev matrix cols', function() {
    it('stdev matrix cols callback', function(t, done) {
        jStat([[1, 2], [3, 4]]).stdev(function(val) {
            assert.deepStrictEqual(val, [1, 1]);
            done();
        });
    });
});
