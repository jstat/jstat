var { describe, it } = require('node:test');
var assert = require('node:assert/strict');
var { jStat } = require('../helpers.js');

describe('create', function() {
    it('return create', function() {
        assert.deepStrictEqual(jStat.create(2, 3, function(row, col) {
            return row + col;
        }), [[0, 1, 2], [1, 2, 3]]);
        assert.deepStrictEqual(jStat.create(2, function(row, col) {
            return row + col;
        }), [[0, 1], [1, 2]]);
    });
    it('create from empty jStat object', function() {
        assert.strictEqual(
            jStat().create(2, function() { return 1; }) instanceof jStat, true);
        assert.deepStrictEqual(jStat().create(2, function(row, col) {
            return row + col;
        }).toArray(), [[0, 1], [1, 2]]);
    });
});
