const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { jStat, assertEpsilon } = require('../helpers.js');

//could be compared against MS Excel percentile function
describe('percentile', function () {
  it('30th percentile of the list in the range', function () {
    assert.deepStrictEqual(jStat.percentile([1, 2, 3, 4], 0.3), 1.9);
  });
  it('30th percentile of the list in the range with exclusive flag true', function () {
    assert.deepStrictEqual(jStat.percentile([1, 2, 3, 4], 0.3, true), 1.5);
  });
  it('30th percentile of the list in the range, unsorted', function () {
    assert.deepStrictEqual(jStat.percentile([3, 1, 4, 2], 0.3), 1.9);
  });
  it('40th percentile of the list in the range with exclusive flag false', function () {
    assertEpsilon(0.0000001, jStat.percentile([15, 20, 35, 40, 50], 0.4, false), 29);
  });
  it('40th percentile of the list in the range with exclusive flag true', function () {
    assertEpsilon(0.0000001, jStat.percentile([15, 20, 35, 40, 50], 0.4, true), 26);
  });
  it('10th percentile of the list in the range with exclusive flag false', function () {
    assertEpsilon(0.0000001, jStat.percentile([15, 20, 35, 40, 50], 0.1, false), 17);
  });
  it('10th percentile of the list in the range with exclusive flag true', function () {
    assert.ok(isNaN(jStat.percentile([15, 20, 35, 40, 50], 0.1, true)));
  });
  it('100th percentile of the list in the range with exclusive flag false', function () {
    assertEpsilon(0.0000001, jStat.percentile([15, 20, 35, 40, 50], 1, false), 50);
  });
  it('100th percentile of the list in the range with exclusive flag true', function () {
    assert.ok(isNaN(jStat.percentile([15, 20, 35, 40, 50], 1, true)));
  });
});
