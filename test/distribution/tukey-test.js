const { describe, it } = require('node:test');
const { jStat, assertEpsilon } = require('../helpers.js');

describe('tukey cdf', function () {
  it('check cdf calculation', function () {
    const tol = 0.0000001;
    // Answers obtained from R's ptukey()
    const q = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    const k2v2 = [
      0.0, 0.4472266, 0.7071328, 0.8320894, 0.8944794, 0.9285421, 0.948762, 0.961616, 0.9702482,
      0.9763065
    ];
    const k2v100 = [
      0.0, 0.5188553, 0.8395949, 0.9636331, 0.9943478, 0.9993817, 0.9999506, 0.999997, 0.9999999,
      1.0
    ];
    const k100v100 = [
      0.0, 0.0, 0.0, 5.654157e-5, 5.078565e-2, 5.034959e-1, 9.022779e-1, 9.906062e-1, 9.994254e-1,
      9.999738e-1
    ];
    const k100v500 = [
      0.0, 0.0, 0.0, 7.227379e-6, 3.438621e-2, 5.170646e-1, 9.304461e-1, 9.960479e-1, 9.998819e-1,
      9.999979e-1
    ];
    for (let i = 0; i < q.length; ++i) {
      assertEpsilon(tol, jStat.tukey.cdf(q[i], 2, 2), k2v2[i]);
      assertEpsilon(tol, jStat.tukey.cdf(q[i], 2, 100), k2v100[i]);
      assertEpsilon(tol, jStat.tukey.cdf(q[i], 100, 100), k100v100[i]);
      assertEpsilon(tol, jStat.tukey.cdf(q[i], 100, 500), k100v500[i]);
    }
  });
});

describe('tukey inv', function () {
  it('check inv calculation', function () {
    const tol = 0.0001;
    // Answers obtained from R's qtukey()
    const p = [0.9, 0.95, 0.997, 0.9995];
    const k2v2 = [4.128183, 6.079637, 24.226336, 40.51483];
    const k2v100 = [2.347926, 2.805759, 4.302286, 5.08882];
    const k100v100 = [5.988671, 6.312643, 7.424273, 8.046847];
    const k100v500 = [5.8485, 6.130686, 7.084854, 7.607542];
    for (let i = 0; i < p.length; ++i) {
      assertEpsilon(tol, jStat.tukey.inv(p[i], 2, 2), k2v2[i]);
      assertEpsilon(tol, jStat.tukey.inv(p[i], 2, 100), k2v100[i]);
      assertEpsilon(tol, jStat.tukey.inv(p[i], 100, 100), k100v100[i]);
      assertEpsilon(tol, jStat.tukey.inv(p[i], 100, 500), k100v500[i]);
    }
  });
});
