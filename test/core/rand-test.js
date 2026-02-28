const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { jStat } = require('../helpers.js');

describe('rand', function () {
  it('return rand', function () {
    assert.strictEqual(jStat.rand(2) instanceof Array, true);
  });
  it('rand from empty jStat object', function () {
    assert.strictEqual(jStat().rand(2) instanceof jStat, true);
  });
});
