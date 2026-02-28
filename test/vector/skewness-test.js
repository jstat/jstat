const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { jStat } = require('../helpers.js');

describe('skewness', function () {
  it('returns accurate skewness value', function () {
    // from normal distribution in R: > rnorm(12); skewness(set) => -0.03270
    const set = [
      -0.28157961, -0.7557735, 0.61554139, 0.26864022, -0.42703435, -0.99927791, -0.07113527,
      -1.39327183, 0.34871138, 1.17909042, -0.22951562, 0.22341714
    ];
    const skew = jStat.skewness(set);

    assert.strictEqual(skew > -0.03271, true);
    assert.strictEqual(skew < -0.03269, true);
  });
  it('skewness from instance', function () {
    const set = [
      -0.28157961, -0.7557735, 0.61554139, 0.26864022, -0.42703435, -0.99927791, -0.07113527,
      -1.39327183, 0.34871138, 1.17909042, -0.22951562, 0.22341714
    ];
    const skew = jStat(set).skewness();

    assert.strictEqual(skew > -0.03271, true);
    assert.strictEqual(skew < -0.03269, true);
  });
});
