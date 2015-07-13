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
  
  'triangular inv': {
    'topic': function() {
      return jStat;
    },
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
    'check inv calculation, when a < c < b': function(jStat) {
      var tol = 0.0000001;
      assert.epsilon(tol, jStat.triangular.inv(0, 1, 11, 5), 1);
      assert.epsilon(tol, jStat.triangular.inv(0.25, 1, 11, 5), 4.162277660);
      assert.epsilon(tol, jStat.triangular.inv(0.5, 1, 11, 5), 5.522774425);
      assert.epsilon(tol, jStat.triangular.inv(0.75, 1, 11, 5), 7.127016654);
      assert.epsilon(tol, jStat.triangular.inv(1, 1, 11, 5), 11);
    },
    'check inv calculation, when a = c < b': function(jStat) {
      var tol = 0.0000001;
      assert.epsilon(tol, jStat.triangular.inv(0, -5, 5, -5), -5);
      assert.epsilon(tol, jStat.triangular.inv(0.5, -5, 5, -5), -2.071067812);
      assert.epsilon(tol, jStat.triangular.inv(1, -5, 5, -5), 5);
    },
    'check inv calculation, when a < c = b': function(jStat) {
      var tol = 0.0000001;
      assert.epsilon(tol, jStat.triangular.inv(0, 0, 8, 8), 0);
      assert.epsilon(tol, jStat.triangular.inv(0.5, 0, 8, 8), 5.656854249);
      assert.epsilon(tol, jStat.triangular.inv(1, 0, 8, 8), 8);
    },
    'check inv calculation, when c < a': function(jStat) {
      var tol = 0.0000001;
      assert.isNaN(jStat.triangular.inv(0, 5, 10, 4));
      assert.isNaN(jStat.triangular.inv(0.5, 5, 10, 4));
      assert.isNaN(jStat.triangular.inv(1, 5, 10, 4));
    },
    'check inv calculation, when b < c': function(jStat) {
      var tol = 0.0000001;
      assert.isNaN(jStat.triangular.inv(0, 23, 47, 50));
      assert.isNaN(jStat.triangular.inv(0.5, 23, 47, 50));
      assert.isNaN(jStat.triangular.inv(1, 23, 47, 50));
    },
    'check inv calculation, when a = b': function(jStat) {
      var tol = 0.0000001;
      assert.isNaN(jStat.triangular.inv(0, -10, -10, -10));
      assert.isNaN(jStat.triangular.inv(0.5, -10, -10, -10));
      assert.isNaN(jStat.triangular.inv(1, -10, -10, -10));
    }
  }
});

suite.export(module);
