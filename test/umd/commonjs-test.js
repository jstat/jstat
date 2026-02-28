const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const jStat = require('../../dist/jstat.js');

describe('jStat', function () {
  it('should be defined', function () {
    assert.strictEqual(typeof jStat, 'function');

    // Check some random functions
    assert.strictEqual(typeof jStat.rows, 'function');
    assert.strictEqual(typeof jStat.min, 'function');
    assert.strictEqual(typeof jStat.betafn, 'function');
    assert.strictEqual(typeof jStat.beta.pdf, 'function');
    assert.strictEqual(typeof jStat.add, 'function');
    assert.strictEqual(typeof jStat.zscore, 'function');
  });
  it('should export jStat object under the "jStat" property for compatibility reasons', function () {
    assert.strictEqual(jStat.jStat, jStat);
  });
});
