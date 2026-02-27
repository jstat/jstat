var { describe, it } = require('node:test');
var assert = require('node:assert/strict');
var { jStat, assertEpsilon } = require('../helpers.js');

var tol = 0.0000001;

describe('quantiles', function() {
    it('return basic quantiles', function() {
        assert.deepStrictEqual(jStat.quantiles([1, 2, 3, 4, 5, 6],
                                               [0.25, 0.5, 0.75]),
                                               [1.9375, 3.5, 5.0625]);
    });
    it('quantiles from instance', function() {
        assert.deepStrictEqual(jStat([1, 2, 3, 4, 5, 6]).quantiles([0.25, 0.5, 0.75]),
                               [1.9375, 3.5, 5.0625]);
    });
    it('quantiles matrix cols', function() {
        assert.deepStrictEqual(
            jStat([[1, 2], [3, 4], [5, 6]]).quantiles([0.25, 0.5, 0.75]),
            [[1.375, 3, 4.625], [2.375, 4, 5.625]]);
    });
    it('quantiles normal dist', function() {
        var arr = [-2.57313203,  9.84802638,  6.13625057,  8.41780777,
                   1.06749265, 2.1530631,  4.46082094,  8.26291053,
                   -9.28064583,  0.13434825];

        var quantiles = [0.1, 0.3, 0.5, 0.8];
        var results = jStat(arr).quantiles(quantiles);
        var expected = [-6.59764031,  0.55426323,  3.30694202,  8.35197644];
        var i;

        for (i = 0; i < quantiles.length; i++) {
            assertEpsilon(tol, results[i], expected[i]);
        }
    });
    it('quantiles gamma dist', function() {
        var arr = [6.20504472,   7.18983495,   6.29331634,   7.72493799,
            6.44628893,   7.73877221,   8.26542627,   7.00870595,
            6.72238426,   7.09363385,   6.60325838,   5.90180641,
            5.79957376,  13.07687722,   6.65942804,   6.75392592,
            6.41813748,   7.97086739,   9.36773336];

        var quantiles = [0.83, 0.1, 0.3, 0.5, 0.8];
        var results = jStat(arr).quantiles(quantiles, 0.4, 0.4);
        var expected = [8.06983917, 5.99884267,
                        6.47140404, 6.75392592, 7.91516455];

        for (var i=0; i < quantiles.length; i++)
            assertEpsilon(tol, results[i], expected[i]);
    });
});

describe('#quantiles vector', function() {
    it('quantiles callback', function(t, done) {
        jStat([1, 2, 3, 4, 5, 6]).quantiles([0.25, 0.5, 0.75], function(val) {
            assert.deepStrictEqual(val, [1.9375, 3.5, 5.0625]);
            done();
        });
    });
});

describe('#quantiles matrix cols', function() {
    it('quantiles matrix cols callback', function(t, done) {
        jStat([[1, 2], [3, 4], [5, 6]]).quantiles([0.25, 0.5, 0.75],
                                                    function(val) {
            assert.deepStrictEqual(val, [[1.375, 3, 4.625], [2.375, 4, 5.625]]);
            done();
        });
    });
});
