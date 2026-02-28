const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { jStat } = require('../helpers.js');

describe('jStat', function () {
  it('calcRdx', function () {
    assert.strictEqual(jStat.utils.calcRdx(1e5, 1e10), 1e7);
  });
  it('isArray', function () {
    assert.strictEqual(jStat.utils.isArray(true), false);
    assert.strictEqual(jStat.utils.isArray({}), false);
    assert.strictEqual(jStat.utils.isArray('123'), false);
    assert.strictEqual(jStat.utils.isArray(/reg/), false);
    assert.strictEqual(jStat.utils.isArray(1234), false);
    assert.strictEqual(
      jStat.utils.isArray(function () {}),
      false
    );
    assert.strictEqual(jStat.utils.isArray([]), true);
  });
  it('isFunction', function () {
    assert.strictEqual(jStat.utils.isFunction(true), false);
    assert.strictEqual(jStat.utils.isFunction([]), false);
    assert.strictEqual(jStat.utils.isFunction({}), false);
    assert.strictEqual(jStat.utils.isFunction('123'), false);
    assert.strictEqual(jStat.utils.isFunction(/reg/), false);
    assert.strictEqual(jStat.utils.isFunction(1234), false);
    assert.strictEqual(
      jStat.utils.isFunction(function () {}),
      true
    );
  });
  it('isNumber', function () {
    assert.strictEqual(jStat.utils.isNumber(5e3), true);
    assert.strictEqual(jStat.utils.isNumber(0xff), true);
    assert.strictEqual(jStat.utils.isNumber(-1.1), true);
    assert.strictEqual(jStat.utils.isNumber(0), true);
    assert.strictEqual(jStat.utils.isNumber(1), true);
    assert.strictEqual(jStat.utils.isNumber(1.1), true);
    assert.strictEqual(jStat.utils.isNumber(10), true);
    assert.strictEqual(jStat.utils.isNumber(10.1), true);
    assert.strictEqual(jStat.utils.isNumber(100), true);
    assert.strictEqual(jStat.utils.isNumber(parseInt('012')), true);
    assert.strictEqual(jStat.utils.isNumber(parseFloat('012')), true);

    assert.strictEqual(jStat.utils.isNumber('-1.1'), false);
    assert.strictEqual(jStat.utils.isNumber('0'), false);
    assert.strictEqual(jStat.utils.isNumber('012'), false);
    assert.strictEqual(jStat.utils.isNumber('0xff'), false);
    assert.strictEqual(jStat.utils.isNumber('1'), false);
    assert.strictEqual(jStat.utils.isNumber('1.1'), false);
    assert.strictEqual(jStat.utils.isNumber('10'), false);
    assert.strictEqual(jStat.utils.isNumber('10.10'), false);
    assert.strictEqual(jStat.utils.isNumber('100'), false);
    assert.strictEqual(jStat.utils.isNumber('5e3'), false);
    assert.strictEqual(jStat.utils.isNumber(Infinity), false);
    assert.strictEqual(jStat.utils.isNumber(NaN), false);
    assert.strictEqual(jStat.utils.isNumber(null), false);
    assert.strictEqual(jStat.utils.isNumber(undefined), false);
    assert.strictEqual(jStat.utils.isNumber(''), false);
    assert.strictEqual(jStat.utils.isNumber('   '), false);
    assert.strictEqual(jStat.utils.isNumber('foo'), false);
    assert.strictEqual(jStat.utils.isNumber([1]), false);
    assert.strictEqual(jStat.utils.isNumber([]), false);
    assert.strictEqual(
      jStat.utils.isNumber(function () {}),
      false
    );
    assert.strictEqual(jStat.utils.isNumber({}), false);
  });
});
