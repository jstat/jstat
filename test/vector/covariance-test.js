var { describe, it } = require('node:test');
var assert = require('node:assert/strict');
var { jStat, assertEpsilon } = require('../helpers.js');

describe('covariance', function() {
    it('return basic covariance', function() {
        assertEpsilon(0.0000001, jStat.covariance([1, 2, 3, 4], [4, 5, 6, 7]),
                      1.6666666666666667);
    });
});
