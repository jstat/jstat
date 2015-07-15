var vows = require('vows');
var assert = require('assert');
var suite = vows.describe('jStat.distribution');

require('../env.js');

suite.addBatch({
  'triangular pdf': {
    'topic': function() {
      return jStat;
    },
    // checked against R's dtriangle(x, a, b, c) from package 'triangle'
    'check pdf calculation': function(jStat) {
      var tol = 0.0000001;
      assert.epsilon(tol, jStat.triangular.pdf(5.5, 1, 10, 5), 0.2);
      assert.epsilon(tol, jStat.triangular.pdf(1.0, 1.0, 2.0, 1.0), 1.0);
      assert.epsilon(tol, jStat.triangular.pdf(3.0, 1.0, 3.0, 3.0), 1.0);
    },
  },
  'triangular cdf': {
    'topic': function() {
      return jStat;
    },
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
    'check cdf calculation, when a < c < b': function(jStat) {
      var tol = 0.0000001;
      assert.epsilon(tol, jStat.triangular.cdf(0, 1, 11, 5), 0);
      assert.epsilon(tol, jStat.triangular.cdf(1, 1, 11, 5), 0);
      assert.epsilon(tol, jStat.triangular.cdf(3, 1, 11, 5), 0.1);
      assert.epsilon(tol, jStat.triangular.cdf(5, 1, 11, 5), 0.4);
      assert.epsilon(tol, jStat.triangular.cdf(7, 1, 11, 5), 0.7333333333);
      assert.epsilon(tol, jStat.triangular.cdf(11, 1, 11, 5), 1);
      assert.epsilon(tol, jStat.triangular.cdf(13, 1, 11, 5), 1);
    },
    'check cdf calculation, when a = c < b': function(jStat) {
      var tol = 0.0000001;
      assert.epsilon(tol, jStat.triangular.cdf(-10, -5, 5, -5), 0);
      assert.epsilon(tol, jStat.triangular.cdf(-5, -5, 5, -5), 0);
      assert.epsilon(tol, jStat.triangular.cdf(0, -5, 5, -5), 0.75);
      assert.epsilon(tol, jStat.triangular.cdf(5, -5, 5, -5), 1);
      assert.epsilon(tol, jStat.triangular.cdf(10, -5, 5, -5), 1);
    },
    'check cdf calculation, when a < c = b': function(jStat) {
      var tol = 0.0000001;
      assert.epsilon(tol, jStat.triangular.cdf(-1, 0, 8, 8), 0);
      assert.epsilon(tol, jStat.triangular.cdf(0, 0, 8, 8), 0);
      assert.epsilon(tol, jStat.triangular.cdf(4, 0, 8, 8), 0.25);
      assert.epsilon(tol, jStat.triangular.cdf(8, 0, 8, 8), 1);
      assert.epsilon(tol, jStat.triangular.cdf(10, 0, 8, 8), 1);
    },
    'check cdf calculation, when c < a': function(jStat) {
      var tol = 0.0000001;
      assert.isNaN(jStat.triangular.cdf(6, 5, 10, 4));
    },
    'check cdf calculation, when b < c': function(jStat) {
      var tol = 0.0000001;
      assert.isNaN(jStat.triangular.cdf(30, 23, 47, 50));
    },
    'check cdf calculation, when a = b': function(jStat) {
      var tol = 0.0000001;
      assert.isNaN(jStat.triangular.cdf(-10, -10, -10, -10));
    }
  }
});

suite.export(module);
