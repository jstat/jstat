const { describe, it } = require('node:test');
const { jStat, assertEpsilon } = require('../helpers.js');

const tol = 0.0000001;

describe('poisson pdf', function () {
  it('check pdf calculation', function () {
    const pdf = jStat.poisson.pdf;

    assertEpsilon(tol, pdf(1, 1), Math.exp(-1));
    assertEpsilon(tol, pdf(2, 1), Math.exp(-1) / 2);

    assertEpsilon(tol, pdf(1, 3), 3 * Math.exp(-3));
    assertEpsilon(tol, pdf(1, 1.5), 1.5 * Math.exp(-1.5));

    //Negative test cases outside of support
    assertEpsilon(tol, pdf(1.4, 1), 0);
    assertEpsilon(tol, pdf(1, -2), 0);
  });
  it('check cdf calculation', function () {
    const curriedCdf = function (k) {
      return jStat.poisson.cdf(k, 1);
    };

    const pdfValues = [
      Math.exp(-1),
      Math.exp(-1),
      Math.exp(-1) / 2,
      Math.exp(-1) / 6,
      Math.exp(-1) / 24
    ];

    assertEpsilon(tol, curriedCdf(0.5), pdfValues[0]);
    assertEpsilon(tol, curriedCdf(3.5), pdfValues[0] + pdfValues[1] + pdfValues[2] + pdfValues[3]);

    assertEpsilon(tol, curriedCdf(-1), 0);
    assertEpsilon(tol, curriedCdf(2), pdfValues[0] + pdfValues[1] + pdfValues[2]);
  });
  it('mean', function () {
    const mean = jStat.poisson.mean;

    assertEpsilon(tol, mean(1), 1);
    assertEpsilon(tol, mean(3.5), 3.5);
  });
  it('check sample', function () {
    const samplingTol = 10;
    const lambdaToTest = [10, 100, 1000, 10000, 100000];
    const sampleSize = 10000;
    for (const i in lambdaToTest) {
      const lambda = lambdaToTest[i];
      let sum = 0;
      for (let j = 0; j < sampleSize; j++) {
        sum += jStat.poisson.sample(lambda);
      }
      const mean = sum / sampleSize;
      assertEpsilon(samplingTol, mean, lambda);
    }
  });
});
