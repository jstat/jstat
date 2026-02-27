var assert = require('node:assert/strict');
var jStat = require('../dist/jstat.js');

function assertEpsilon(eps, actual, expected, message) {
    if (Number.isNaN(actual)) {
        assert.fail(
            message || 'expected ' + expected + ' ± ' + eps + ', but got NaN'
        );
    }
    var diff = Math.abs(actual - expected);
    if (diff > eps) {
        assert.fail(
            message || 'expected ' + expected + ' ± ' + eps +
            ', got ' + actual + ' (diff: ' + diff + ')'
        );
    }
}

function assertArrayEpsilon(eps, actual, expected, message) {
    assert.strictEqual(actual.length, expected.length,
        'array length mismatch: got ' + actual.length +
        ', expected ' + expected.length);
    for (var i = 0; i < expected.length; i++) {
        assertEpsilon(eps, actual[i], expected[i],
            (message || '') + '[' + i + ']: expected ' + expected[i] +
            ' ± ' + eps + ', got ' + actual[i]);
    }
}

module.exports = { jStat: jStat, assertEpsilon: assertEpsilon, assertArrayEpsilon: assertArrayEpsilon };
