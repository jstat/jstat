const { describe, it } = require('node:test');
const { jStat, assertEpsilon } = require('../helpers.js');

describe('QR decomposition', function () {
  it('example1', function () {
    const A = [
      [12, -51, 4],
      [6, 167, -68],
      [-4, 24, -41]
    ];
    const QR = jStat.QR(A);
    const Q = QR[0];
    const R = QR[1];
    const tol = 0.0001;
    assertEpsilon(tol, Q[0][0], 0.8571428571428571);
    assertEpsilon(tol, Q[0][1], -0.39428571428571446);
    assertEpsilon(tol, Q[0][2], -0.3314285714285714);
    assertEpsilon(tol, Q[1][0], 0.4285714285714286);
    assertEpsilon(tol, Q[1][1], 0.902857142857143);
    assertEpsilon(tol, Q[1][2], 0.034285714285714315);
    assertEpsilon(tol, Q[2][0], -0.28571428571428575);
    assertEpsilon(tol, Q[2][1], 0.1714285714285711);
    assertEpsilon(tol, Q[2][2], -0.9428571428571428);
    assertEpsilon(tol, R[0][0], 13.999999999999998);
    assertEpsilon(tol, R[0][1], 21.00000000000001);
    assertEpsilon(tol, R[0][2], -14.0);
    assertEpsilon(tol, R[1][0], 5.506706202140777e-16);
    assertEpsilon(tol, R[1][1], 175.00000000000003);
    assertEpsilon(tol, R[1][2], -70.0);
    assertEpsilon(tol, R[2][0], 3.0198066269804255e-16);
    assertEpsilon(tol, R[2][1], 9.237055564881295e-16);
    assertEpsilon(tol, R[2][2], 35.0);
  });
});
