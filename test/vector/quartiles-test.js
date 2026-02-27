var { describe, it } = require('node:test');
var assert = require('node:assert/strict');
var { jStat } = require('../helpers.js');

describe('quartiles', function() {
    it('return basic quartiles', function() {
        assert.deepStrictEqual(jStat.quartiles([1, 2, 3, 4, 5, 6]), [2, 3, 5]);
    });
    it('quartiles from instance', function() {
        assert.deepStrictEqual(jStat([1, 2, 3, 4, 5, 6]).quartiles(), [2, 3, 5]);
    });
    it('quartiles matrix cols', function() {
        assert.deepStrictEqual(jStat([[1, 2], [3, 4], [5, 6]]).quartiles(),
                               [[1, 3, 3], [2, 4, 4]]);
    });
});

describe('#quartiles vector', function() {
    it('quartiles callback', function(t, done) {
        jStat([1, 2, 3, 4, 5, 6]).quartiles(function(val) {
            assert.deepStrictEqual(val, [2, 3, 5]);
            done();
        });
    });
});

describe('#quartiles matrix cols', function() {
    it('quartiles matrix cols callback', function(t, done) {
        jStat([[1, 2], [3, 4], [5, 6]]).quartiles(function(val) {
            assert.deepStrictEqual(val, [[1, 3, 3], [2, 4, 4]]);
            done();
        });
    });
});
