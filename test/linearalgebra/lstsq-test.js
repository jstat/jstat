var { describe, it } = require('node:test');
var assert = require('node:assert/strict');
var { jStat, assertEpsilon } = require('../helpers.js');

describe('least squard solver by QR decomposition', function() {
    it('matrix call', function() {
        var A = jStat.arange(100).map(function() {
            return jStat.arange(3).map(function() {
                return jStat.normal.sample(0, 1)
            });
        });
        var e = jStat.arange(100).map(function() {
            return [jStat.normal.sample(0, 1) * 0.001];
        });
        var coef = [[1], [2], [3]];
        var y = jStat.add(jStat.multiply(A, coef), e);
        var coef_bar = jStat.lstsq(A, y);
        var tol = 0.1;
        assertEpsilon(tol, coef_bar[0][0], 1);
        assertEpsilon(tol, coef_bar[1][0], 2);
        assertEpsilon(tol, coef_bar[2][0], 3);
    });
    it('array call', function() {
        var A = jStat.arange(100).map(function() {
            return jStat.arange(3).map(function() {
                return jStat.normal.sample(0, 1);
            });
        });
        var e = jStat.arange(100).map(function() {
            return [jStat.normal.sample(0, 1) * 0.001];
        });
        var coef = [[1], [2], [3]];
        var y = jStat.add(jStat.multiply(A, coef), e);
        y = y.map(function(i) { return i[0] });
        var coef_bar = jStat.lstsq(A, y);
        var tol = 0.1;
        assertEpsilon(tol, coef_bar[0], 1);
        assertEpsilon(tol, coef_bar[1], 2);
        assertEpsilon(tol, coef_bar[2], 3);
    });
});
