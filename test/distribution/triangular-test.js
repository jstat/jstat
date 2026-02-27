var { describe, it } = require('node:test');
var assert = require('node:assert/strict');
var { jStat, assertEpsilon } = require('../helpers.js');

describe('triangular pdf', function() {
    // checked against R's dtriang(x, min, mode, max, log=FALSE) from package 'mc2d':
    //   install.packages("mc2d")
    //   library("mc2d")
    //   dtriang(c(0.5, 1, 2.5, 5, 6.5, 11, 20), 1, 5, 11)
    //   dtriang(c(-20, -5, -2.5, 5, 10), -5, -5, 5)
    //   dtriang(c(-10, 0, 4, 8, 12), 0, 8, 8)
    //   dtriang(c(0, 7, 12), 5, 4, 10)
    //   dtriang(c(17, 30, 88), 23, 50, 47)
    //   dtriang(c(-17, -10, 0), -10, -10, -10)

    it('check pdf calculation, when a < c < b', function() {
      var tol = 0.0000001;
      assertEpsilon(tol, jStat.triangular.pdf(0.5, 1, 11, 5), 0);      // x < a
      assertEpsilon(tol, jStat.triangular.pdf(1, 1, 11, 5), 0);        // x = a
      assertEpsilon(tol, jStat.triangular.pdf(2.5, 1, 11, 5), 0.075);  // a < x < c
      assertEpsilon(tol, jStat.triangular.pdf(5, 1, 11, 5), 0.2);      // x = c
      assertEpsilon(tol, jStat.triangular.pdf(6.5, 1, 11, 5), 0.15);   // c < x < b
      assertEpsilon(tol, jStat.triangular.pdf(11, 1, 11, 5), 0);       // x = b
      assertEpsilon(tol, jStat.triangular.pdf(20, 1, 11, 5), 0);       // b < x
    });
    it('check pdf calculation, when a = c < b', function() {
      var tol = 0.0000001;
      assertEpsilon(tol, jStat.triangular.pdf(-20, -5, 5, -5), 0);     // x < a
      assertEpsilon(tol, jStat.triangular.pdf(-5, -5, 5, -5), 0.2);    // x = a = c
      assertEpsilon(tol, jStat.triangular.pdf(-2.5, -5, 5, -5), 0.15); // a = c < x < b
      assertEpsilon(tol, jStat.triangular.pdf(5, -5, 5, -5), 0);       // x = b
      assertEpsilon(tol, jStat.triangular.pdf(10, -5, 5, -5), 0);      // b < x
    });
    it('check pdf calculation, when a < c = b', function() {
      var tol = 0.0000001;
      assertEpsilon(tol, jStat.triangular.pdf(-10, 0, 8, 8), 0);       // x < a
      assertEpsilon(tol, jStat.triangular.pdf(0, 0, 8, 8), 0);         // x = a < c = b
      assertEpsilon(tol, jStat.triangular.pdf(4, 0, 8, 8), 0.125);     // a = c < x < b
      assertEpsilon(tol, jStat.triangular.pdf(8, 0, 8, 8), 0.25);      // x = c = b
      assertEpsilon(tol, jStat.triangular.pdf(12, 0, 8, 8), 0);        // b < x
    });
    it('check pdf calculation, when c < a', function() {
      assert.ok(Number.isNaN(jStat.triangular.pdf(0, 5, 10, 4)));                  // x < a
      assert.ok(Number.isNaN(jStat.triangular.pdf(7, 5, 10, 4)));                  // a < x < b
      assert.ok(Number.isNaN(jStat.triangular.pdf(12, 5, 10, 4)));                 // b < x
    });
    it('check pdf calculation, when b < c', function() {
      assert.ok(Number.isNaN(jStat.triangular.pdf(17, 23, 47, 50)));               // x < a
      assert.ok(Number.isNaN(jStat.triangular.pdf(30, 23, 47, 50)));               // a < x < b
      assert.ok(Number.isNaN(jStat.triangular.pdf(88, 23, 47, 50)));               // b < x
    });
    it('check pdf calculation, when a = b', function() {
      assert.ok(Number.isNaN(jStat.triangular.pdf(-17, -10, -10, -10)));           // x < a
      assert.ok(Number.isNaN(jStat.triangular.pdf(-10, -10, -10, -10)));           // a = x = b
      assert.ok(Number.isNaN(jStat.triangular.pdf(0, -10, -10, -10)));             // b < x
    });
});

describe('triangular cdf', function() {
    // checked against R's ptriang(q, min=-1, mode=0, max=1, lower.tail=TRUE, log.p=FALSE) from package 'mc2d':
    //   install.packages("mc2d")
    //   library("mc2d")
    //   options(digits=10)
    //   ptriang(c(0, 1, 3, 5, 7, 11, 13), 1, 5, 11)
    //   ptriang(c(-10, -5, 0, 5, 10), -5, -5, 5)
    //   ptriang(c(-1, 0, 4, 8, 10), 0, 8, 8)
    //   ptriang(6, 5, 4, 10)
    //   ptriang(30, 23, 50, 47)
    //   ptriang(-10, -10, -10, -10) # NOTE: This returns: [1] 1, but we don't allow a = b = c!
    it('check cdf calculation, when a < c < b', function() {
      var tol = 0.0000001;
      assertEpsilon(tol, jStat.triangular.cdf(0, 1, 11, 5), 0);
      assertEpsilon(tol, jStat.triangular.cdf(1, 1, 11, 5), 0);
      assertEpsilon(tol, jStat.triangular.cdf(3, 1, 11, 5), 0.1);
      assertEpsilon(tol, jStat.triangular.cdf(5, 1, 11, 5), 0.4);
      assertEpsilon(tol, jStat.triangular.cdf(7, 1, 11, 5), 0.7333333333);
      assertEpsilon(tol, jStat.triangular.cdf(11, 1, 11, 5), 1);
      assertEpsilon(tol, jStat.triangular.cdf(13, 1, 11, 5), 1);
    });
    it('check cdf calculation, when a = c < b', function() {
      var tol = 0.0000001;
      assertEpsilon(tol, jStat.triangular.cdf(-10, -5, 5, -5), 0);
      assertEpsilon(tol, jStat.triangular.cdf(-5, -5, 5, -5), 0);
      assertEpsilon(tol, jStat.triangular.cdf(0, -5, 5, -5), 0.75);
      assertEpsilon(tol, jStat.triangular.cdf(5, -5, 5, -5), 1);
      assertEpsilon(tol, jStat.triangular.cdf(10, -5, 5, -5), 1);
    });
    it('check cdf calculation, when a < c = b', function() {
      var tol = 0.0000001;
      assertEpsilon(tol, jStat.triangular.cdf(-1, 0, 8, 8), 0);
      assertEpsilon(tol, jStat.triangular.cdf(0, 0, 8, 8), 0);
      assertEpsilon(tol, jStat.triangular.cdf(4, 0, 8, 8), 0.25);
      assertEpsilon(tol, jStat.triangular.cdf(8, 0, 8, 8), 1);
      assertEpsilon(tol, jStat.triangular.cdf(10, 0, 8, 8), 1);
    });
    it('check cdf calculation, when c < a', function() {
      assert.ok(Number.isNaN(jStat.triangular.cdf(6, 5, 10, 4)));
    });
    it('check cdf calculation, when b < c', function() {
      assert.ok(Number.isNaN(jStat.triangular.cdf(30, 23, 47, 50)));
    });
    it('check cdf calculation, when a = b', function() {
      assert.ok(Number.isNaN(jStat.triangular.cdf(-10, -10, -10, -10)));
    });
});

describe('triangular inv', function() {
    // checked against R's qtriang(p, min=-1, mode=0, max=1, lower.tail=TRUE, log.p=FALSE) from package 'mc2d':
    //   install.packages("mc2d")
    //   library("mc2d")
    //   options(digits=10)
    //   qtriang(c(0, 0.25, 0.5, 0.75, 1), 1, 5, 11)
    //   qtriang(c(0, 0.5, 1), -5, -5, 5)
    //   qtriang(c(0, 0.5, 1), 0, 8, 8)
    //   qtriang(c(0, 0.5, 1), 5, 4, 10)
    //   qtriang(c(0, 0.5, 1), 23, 50, 47)
    //   qtriang(c(0, 0.5, 1), -10, -10, -10) # NOTE: This returns: [1] 1 1 1, but we don't allow a = b = c!
    it('check inv calculation, when a < c < b', function() {
      var tol = 0.0000001;
      assertEpsilon(tol, jStat.triangular.inv(0, 1, 11, 5), 1);
      assertEpsilon(tol, jStat.triangular.inv(0.25, 1, 11, 5), 4.162277660);
      assertEpsilon(tol, jStat.triangular.inv(0.5, 1, 11, 5), 5.522774425);
      assertEpsilon(tol, jStat.triangular.inv(0.75, 1, 11, 5), 7.127016654);
      assertEpsilon(tol, jStat.triangular.inv(1, 1, 11, 5), 11);
    });
    it('check inv calculation, when a = c < b', function() {
      var tol = 0.0000001;
      assertEpsilon(tol, jStat.triangular.inv(0, -5, 5, -5), -5);
      assertEpsilon(tol, jStat.triangular.inv(0.5, -5, 5, -5), -2.071067812);
      assertEpsilon(tol, jStat.triangular.inv(1, -5, 5, -5), 5);
    });
    it('check inv calculation, when a < c = b', function() {
      var tol = 0.0000001;
      assertEpsilon(tol, jStat.triangular.inv(0, 0, 8, 8), 0);
      assertEpsilon(tol, jStat.triangular.inv(0.5, 0, 8, 8), 5.656854249);
      assertEpsilon(tol, jStat.triangular.inv(1, 0, 8, 8), 8);
    });
    it('check inv calculation, when c < a', function() {
      assert.ok(Number.isNaN(jStat.triangular.inv(0, 5, 10, 4)));
      assert.ok(Number.isNaN(jStat.triangular.inv(0.5, 5, 10, 4)));
      assert.ok(Number.isNaN(jStat.triangular.inv(1, 5, 10, 4)));
    });
    it('check inv calculation, when b < c', function() {
      assert.ok(Number.isNaN(jStat.triangular.inv(0, 23, 47, 50)));
      assert.ok(Number.isNaN(jStat.triangular.inv(0.5, 23, 47, 50)));
      assert.ok(Number.isNaN(jStat.triangular.inv(1, 23, 47, 50)));
    });
    it('check inv calculation, when a = b', function() {
      assert.ok(Number.isNaN(jStat.triangular.inv(0, -10, -10, -10)));
      assert.ok(Number.isNaN(jStat.triangular.inv(0.5, -10, -10, -10)));
      assert.ok(Number.isNaN(jStat.triangular.inv(1, -10, -10, -10)));
    });
});
