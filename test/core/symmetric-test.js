var { describe, it } = require('node:test');
var assert = require('node:assert/strict');
var { jStat } = require('../helpers.js');

describe('symmetric', function() {
    it('return symmetric', function() {
        assert.strictEqual(jStat.symmetric([[1, 2], [2, 1]]), true);
        assert.strictEqual(jStat.symmetric([[1, 2], [1, 2]]), false);
    });
    it('symmetric from jStat object', function() {
        assert.strictEqual(jStat([[1, 2], [2, 1]]).symmetric(), true);
        assert.strictEqual(jStat([[1, 2], [1, 2]]).symmetric(), false);
    });
});
