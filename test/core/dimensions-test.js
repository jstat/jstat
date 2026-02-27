var { describe, it } = require('node:test');
var assert = require('node:assert/strict');
var { jStat } = require('../helpers.js');

function noop() { }

describe('dimensions', function() {
    it('dimention of matrix', function() {
        assert.deepStrictEqual(jStat.dimensions([[1], [4], [5]]), { rows: 3, cols: 1 });
        assert.deepStrictEqual(jStat([[1], [4], [5]]).dimensions(),
                               { rows: 3, cols: 1 });
        assert.strictEqual(jStat([[1], [3]]).dimensions(noop) instanceof jStat, true);
    });
});

describe('#dimensions', function() {
    it('dimensions sends value', function(t, done) {
        jStat([[1, 2, 3], [4, 5, 6]]).dimensions(function(val) {
            assert.deepStrictEqual(val, { rows: 2, cols: 3 });
            done();
        });
    });
});
