const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { jStat } = require('../helpers.js');

describe('negbin pdf', function () {
  it('check pdf calculation', function () {
    const k = 10; // number of failures
    const r = 5; // threshold number of successes
    const p = 0.25; // probability of a success
    assert.ok(jStat.negbin.pdf(k, r, p), 0.05504866037517786);
  });
});

describe('negbin cdf', function () {
  it('check pdf calculation', function () {
    const k = 10; // number of failures
    const r = 5; // threshold number of successes
    const p = 0.25; // probability of a success
    assert.ok(jStat.negbin.cdf(k, r, p), 0.3135140584781766);
  });
});
