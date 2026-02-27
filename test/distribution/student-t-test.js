var { describe, it } = require('node:test');
var assert = require('node:assert/strict');
var { jStat, assertEpsilon } = require('../helpers.js');

describe('studentt pdf', function() {
    //Checked against R dt(x,df)
    it('check pdf calculation', function() {
      var tol = 0.0000001;
      assertEpsilon(tol, jStat.studentt.pdf(0.5, 40), 0.3489195);
      assertEpsilon(tol, jStat.studentt.pdf(-1.0, 20), 0.2360456);
    });
    it('check pdf calculation for large parameters', function() {
      var tol = 0.0000001;
      assertEpsilon(tol, jStat.studentt.pdf(0.45, 400), 0.3602198);
      assertEpsilon(tol, jStat.studentt.pdf(2.95, 525), 0.005283244);
    });
    //Checked against R's pt(x, df)
    it('check cdf calculation', function() {
      var tol = 0.0000001;
      var x = 0.5;
      var df = 40;
      assertEpsilon(tol, jStat.studentt.cdf(x, df), 0.6900926);
    });
    //Checked against R's qt(x, df)
    it('check inv calculation', function() {
      var tol = 0.0000001;
      assertEpsilon(tol, jStat.studentt.inv(0.5, 40), 0);
      assertEpsilon(tol, jStat.studentt.inv(0.7, 20), 0.5328628);
      assertEpsilon(tol, jStat.studentt.inv(0.2, 10), -0.8790578);
    });
});
