var { describe, it } = require('node:test');
var assert = require('node:assert/strict');
var { jStat } = require('../helpers.js');

describe('alter', function() {
    it('return alter', function() {
        assert.deepStrictEqual(jStat.alter([[1, 2], [3, 4]], function(x) {
            return x * 2;
        }), [[2, 4], [6, 8]]);
        assert.deepStrictEqual(jStat([[1, 2], [3, 4]]).alter(function(x) {
            return x * 2;
        }).toArray(), [[2, 4], [6, 8]]);
    });
});
