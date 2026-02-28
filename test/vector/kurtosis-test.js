const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { jStat } = require('../helpers.js');

describe('kurtosis', function () {
  it('returns accurate kurtosis value', function () {
    const set = [
      // from normal distribution in R: > rnorm(12); kurtosis(set) => -0.51156
      -0.28157961, -0.7557735, 0.61554139, 0.26864022, -0.42703435, -0.99927791, -0.07113527,
      -1.39327183, 0.34871138, 1.17909042, -0.22951562, 0.22341714
    ];
    const kurt = jStat.kurtosis(set);

    assert.strictEqual(kurt > -0.51157, true);
    assert.strictEqual(kurt < -0.51155, true);
  });
  it('kurtosis from instance', function () {
    const set = [
      -0.28157961, -0.7557735, 0.61554139, 0.26864022, -0.42703435, -0.99927791, -0.07113527,
      -1.39327183, 0.34871138, 1.17909042, -0.22951562, 0.22341714
    ];
    const kurt = jStat(set).kurtosis();

    assert.strictEqual(kurt > -0.51157, true);
    assert.strictEqual(kurt < -0.51155, true);
  });
});
