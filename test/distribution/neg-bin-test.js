var { describe, it } = require('node:test');
var assert = require('node:assert/strict');
var { jStat, assertEpsilon } = require('../helpers.js');

describe('negbin pdf', function() {
    it('check pdf calculation', function() {
      var k = 10; // number of failures
      var r = 5; // threshold number of successes
      var p = 0.25; // probability of a success
      assert.ok(jStat.negbin.pdf(k, r, p), 0.05504866037517786);
    });
});

describe('negbin cdf', function() {
    it('check pdf calculation', function() {
      var k = 10; // number of failures
      var r = 5; // threshold number of successes
      var p = 0.25; // probability of a success
      assert.ok(jStat.negbin.cdf(k, r, p), 0.3135140584781766);
    });
});
