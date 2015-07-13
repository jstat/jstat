var vows = require('vows');
var assert = require('assert');
var suite = vows.describe('jStat.distribution');

require('../env.js');

suite.addBatch({
  'triangular pdf': {
    'topic': function() {
      return jStat;
    },
    // checked against R's dtriang(x, min, mode, max, log=FALSE) from package 'mc2d':
    //   install.packages("mc2d")
    //   library("mc2d")
    //   dtriang(c(0.5, 1, 2.5, 5, 6.5, 11, 20), 1, 5, 11)
    //   dtriang(c(-20, -5, -2.5, 5, 10), -5, -5, 5)
    //   dtriang(c(-10, 0, 4, 8, 12), 0, 8, 8)
    //   dtriang(c(0, 7, 12), 5, 4, 10)
    //   dtriang(c(17, 30, 88), 23, 50, 47)
    //   dtriang(c(-17, -10, 0), -10, -10, -10)
    
    'check pdf calculation, when a < c < b': function(jStat) {
      var tol = 0.0000001;
      assert.epsilon(tol, jStat.triangular.pdf(0.5, 1, 11, 5), 0);      // x < a
      assert.epsilon(tol, jStat.triangular.pdf(1, 1, 11, 5), 0);        // x = a
      assert.epsilon(tol, jStat.triangular.pdf(2.5, 1, 11, 5), 0.075);  // a < x < c
      assert.epsilon(tol, jStat.triangular.pdf(5, 1, 11, 5), 0.2);      // x = c
      assert.epsilon(tol, jStat.triangular.pdf(6.5, 1, 11, 5), 0.15);   // c < x < b
      assert.epsilon(tol, jStat.triangular.pdf(11, 1, 11, 5), 0);       // x = b
      assert.epsilon(tol, jStat.triangular.pdf(20, 1, 11, 5), 0);       // b < x
    },
    'check pdf calculation, when a = c < b': function(jStat) {
      var tol = 0.0000001;
      assert.epsilon(tol, jStat.triangular.pdf(-20, -5, 5, -5), 0);     // x < a
      assert.epsilon(tol, jStat.triangular.pdf(-5, -5, 5, -5), 0.2);    // x = a = c
      assert.epsilon(tol, jStat.triangular.pdf(-2.5, -5, 5, -5), 0.15); // a = c < x < b
      assert.epsilon(tol, jStat.triangular.pdf(5, -5, 5, -5), 0);       // x = b
      assert.epsilon(tol, jStat.triangular.pdf(10, -5, 5, -5), 0);      // b < x
    },
    'check pdf calculation, when a < c = b': function(jStat) {
      var tol = 0.0000001;
      assert.epsilon(tol, jStat.triangular.pdf(-10, 0, 8, 8), 0);       // x < a
      assert.epsilon(tol, jStat.triangular.pdf(0, 0, 8, 8), 0);         // x = a < c = b
      assert.epsilon(tol, jStat.triangular.pdf(4, 0, 8, 8), 0.125);     // a = c < x < b
      assert.epsilon(tol, jStat.triangular.pdf(8, 0, 8, 8), 0.25);      // x = c = b
      assert.epsilon(tol, jStat.triangular.pdf(12, 0, 8, 8), 0);        // b < x
    },
    'check pdf calculation, when c < a': function(jStat) {
      var tol = 0.0000001;
      assert.isNaN(jStat.triangular.pdf(0, 5, 10, 4));                  // x < a
      assert.isNaN(jStat.triangular.pdf(7, 5, 10, 4));                  // a < x < b
      assert.isNaN(jStat.triangular.pdf(12, 5, 10, 4));                 // b < x
    },
    'check pdf calculation, when b < c': function(jStat) {
      var tol = 0.0000001;
      assert.isNaN(jStat.triangular.pdf(17, 23, 47, 50));               // x < a
      assert.isNaN(jStat.triangular.pdf(30, 23, 47, 50));               // a < x < b
      assert.isNaN(jStat.triangular.pdf(88, 23, 47, 50));               // b < x
    },
    'check pdf calculation, when a = b': function(jStat) {
      var tol = 0.0000001;
      assert.isNaN(jStat.triangular.pdf(-17, -10, -10, -10));           // x < a
      assert.isNaN(jStat.triangular.pdf(-10, -10, -10, -10));           // a = x = b
      assert.isNaN(jStat.triangular.pdf(0, -10, -10, -10));             // b < x
    },
  }
});

suite.export(module);
