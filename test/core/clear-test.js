var { describe, it } = require('node:test');
var assert = require('node:assert/strict');
var { jStat } = require('../helpers.js');

describe('clear', function() {
    it('return clear', function() {
        var toclear = [[1, 2], [3, 4]];
        jStat.clear(toclear);
        assert.deepStrictEqual(toclear, [[0, 0], [0, 0]]);
    });
    it('clear from empty jStat object', function() {
        var toclear = jStat([[1, 2], [3, 4]]);
        toclear.clear();
        assert.strictEqual(toclear instanceof jStat, true);
        assert.deepStrictEqual(toclear.toArray(), [[0, 0], [0, 0]]);
    });
});
