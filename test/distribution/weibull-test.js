var { describe, it } = require('node:test');
var assert = require('node:assert/strict');
var { jStat, assertEpsilon } = require('../helpers.js');

var tol = 0.0000001;
var gamma = jStat.gammafn;

describe('weibull pdf', function() {
    it('check pdf calculation', function() {
        var pdf = jStat.weibull.pdf;

        assertEpsilon(tol, pdf(1, 1, 1), Math.exp(-1));
        assertEpsilon(tol, pdf(3, 1, 1), Math.exp(-3));

        //Scale parameter
        assertEpsilon(tol, pdf(1, 2, 1), 0.5 * Math.exp(-0.5));
        assertEpsilon(tol, pdf(1, 10, 1), 0.1 * Math.exp(-0.1));

        //Shape parameter
        assertEpsilon(tol, pdf(1, 1, 4), 4 * Math.exp(-1));
        assertEpsilon(tol, pdf(2, 1, 2), 4 * Math.exp(-4));

        //Negative test cases for invalid parameters
        assertEpsilon(tol, pdf(-1, 1, 1), 0);
        assertEpsilon(tol, pdf(1, -1, 1), 0);
        assertEpsilon(tol, pdf(1, 1, -1), 0);
    });
    it('check cdf calculation', function() {
        var cdf = jStat.weibull.cdf;

        assertEpsilon(tol, cdf(1, 1, 1), 1 - Math.exp(-1));

        assertEpsilon(tol, cdf(2, 1, 1), 1 - Math.exp(-2));
        assertEpsilon(tol, cdf(1, 2, 1), 1 - Math.exp(-0.5));
        assertEpsilon(tol, cdf(2, 1, 2), 1 - Math.exp(-4));
    });
    it('mean', function() {
        var mean = jStat.weibull.mean;

        assertEpsilon(tol, mean(1, 1), gamma(2));
        assertEpsilon(tol, mean(2, 1), 2 * gamma(2));

        assertEpsilon(tol, mean(1, 2), gamma(1.5));
    });
    it('median', function() {
        var median = jStat.weibull.median;

        assertEpsilon(tol, median(1, 1), Math.log(2));

        assertEpsilon(tol, median(1, 2), Math.pow(Math.log(2), 0.5));
        assertEpsilon(tol, median(2, 1), 2 * Math.log(2));
    });
    it('mode', function() {
        var mode = jStat.weibull.mode;

        assertEpsilon(tol, mode(1, 1), 0);
        assertEpsilon(tol, mode(1, 2), Math.pow(0.5, 0.5));
        assertEpsilon(tol, mode(3, 2), 3 * Math.pow(0.5, 0.5));
    });
    it('variance', function() {
        var variance = jStat.weibull.variance;

        assertEpsilon(tol, variance(1, 1), gamma(3) - Math.pow(gamma(2), 2));
        assertEpsilon(tol, variance(1, 2), gamma(2) - Math.pow(gamma(1.5), 2));
        assertEpsilon(tol, variance(3, 2), 9 * (gamma(2) - Math.pow(gamma(1.5), 2)));
    });
});
