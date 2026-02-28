const { describe, it } = require('node:test');
const { jStat, assertEpsilon } = require('../helpers.js');

describe('model test', function () {
  it('array call', function () {
    const A = [
      [1, 2, 3],
      [1, 1, 0],
      [1, -2, 3],
      [1, 3, 4],
      [1, -10, 2],
      [1, 4, 4],
      [1, 10, 2],
      [1, 3, 2],
      [1, 4, -1]
    ];
    const b = [1, -2, 3, 4, -5, 6, 7, -8, 9];
    const model = jStat.models.ols(b, A);
    const tol = 0.01;
    // R2
    assertEpsilon(tol, model.R2, 0.309);
    // Adjusted R^2
    // This Adjusted R^2 is variously called the:
    // - Wherry Formula
    // - Ezekiel Formula
    // - Wherry/McNemar Formula
    // - Cohen/Cohen Formula
    //
    // It is the same as the adjusted R^2 value given by R's linear model
    // summary method
    assertEpsilon(tol, model.adjust_R2, 0.078);
    // t test
    assertEpsilon(tol, model.t.p[0], 0.8377444317889267);
    assertEpsilon(tol, model.t.p[1], 0.1529673615844231);
    assertEpsilon(tol, model.t.p[2], 0.9909627983826588);
    // f test
    assertEpsilon(tol, model.f.pvalue, 0.33063636718598743);
  });
});
