var { describe, it } = require('node:test');
var assert = require('node:assert/strict');
var { jStat } = require('../helpers.js');

describe('cols', function() {
    it('number of columns', function() {
        assert.strictEqual(jStat.cols([[1], [4], [5]]), 1);
        assert.strictEqual(jStat([[1], [4], [5]]).cols(), 1);
        assert.strictEqual(jStat([[1, 3]]).cols(function() {}) instanceof jStat, true);
    });
});

describe('#cols', function() {
    it('cols sends value', function(t, done) {
        jStat([[1, 2, 3], [4, 5, 6]]).cols(function(val) {
            assert.strictEqual(val, 3);
            done();
        });
    });
});
