var { describe, it } = require('node:test');
var assert = require('node:assert/strict');
var { jStat, assertEpsilon } = require('../helpers.js');

describe('binomial pdf', function() {
    //checked against R's dbinom(k, n, p)
    it('check pdf calculation', function() {
      var tol = 0.0000001;
      assertEpsilon(tol, jStat.binomial.pdf(10, 25, 0.5), 0.09741664);
      assertEpsilon(tol, jStat.binomial.pdf(50, 1000, 0.05), 0.05778798);
    });
    //Checked against r's pbinom(k, n, p)
    it('check cdf calculation', function() {
      var tol = 0.0000001;
      assertEpsilon(tol, jStat.binomial.cdf(10, 25, 0.5), 0.2121781);
      assertEpsilon(tol, jStat.binomial.cdf(50, 1000, 0.05), 0.537529);

      assert.ok(Number.isNaN(jStat.binomial.cdf(10, 12, -1)));
      assert.ok(Number.isNaN(jStat.binomial.cdf(10, 12, 2)));
      assert.strictEqual(jStat.binomial.cdf(12, 10, 0.5), 1);
      assert.strictEqual(jStat.binomial.cdf(12, -1, 0.5), 1);
      assertEpsilon(tol,
                     jStat.binomial.cdf(101073, 101184, 0.9988219676207195),
                     0.7857313651);
    });
});
