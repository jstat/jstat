var vows = require('vows');
var assert = require('assert');
var suite = vows.describe('jStat.distribution');

require('../env.js');

suite.addBatch({
  'kumaraswamy pdf': {
    'topic': function() {
      return jStat;
    },
    // Checked against R's dkumar(p, shape1, shape2, log=FALSE) in package VGAM
    //   install.packages("VGAM")
    //   library("VGAM")
    //   options(digits=10)
    //   dkumar(c(0, 0.5, 1), 0.5, 0.5)
    //   dkumar(c(0, 0.5, 1), 0.8, 1) # Note: Incorrectly returns NaN for x = 1!
    //   dkumar(c(0, 0.5, 1), 1, 0.4) # Note: Incorrectly returns NaN for x = 0!
    //   dkumar(c(0, 0.5, 1), 0.6, 1.2)
    //   dkumar(c(0, 0.5, 1), 1.3, 0.5)
    //   dkumar(c(0, 0.5, 1), 1, 1) # Note: Incorrectly returns NaN for x = 0 and x = 1!
    //   dkumar(c(0, 0.5, 1), 2, 1) # Note: Incorrectly returns NaN for x = 1!
    //   dkumar(c(0, 0.5, 1), 1, 1.5) # Note: Incorrectly returns NaN for x = 0!
    //   dkumar(c(0, 0.5, 1), 1.5, 1.5)
    //   dkumar(c(0, 0.5, 1), 7, 25)
'check pdf calculation': function(jStat) {
      var tol = 0.0000001;
      // 'U'-shaped distribution
      assert.equal(jStat.kumaraswamy.pdf(0, 0.5, 0.5), Infinity);
      assert.epsilon(tol, jStat.kumaraswamy.pdf(0.5, 0.5, 0.5), 0.6532814824);
      assert.equal(jStat.kumaraswamy.pdf(1, 0.5, 0.5), Infinity);

      // 'L'-shaped distribution
      assert.equal(jStat.kumaraswamy.pdf(0, 0.8, 1), Infinity);
      assert.epsilon(tol, jStat.kumaraswamy.pdf(0.5, 0.8, 1), 0.918958684);
      assert.epsilon(tol, jStat.kumaraswamy.pdf(1, 0.8, 1), 0.8);
      
      // reversed-'L'-shaped distribution
      assert.epsilon(tol, jStat.kumaraswamy.pdf(0, 1, 0.4), 0.4);
      assert.epsilon(tol, jStat.kumaraswamy.pdf(0.5, 1, 0.4), 0.6062866266);
      assert.equal(jStat.kumaraswamy.pdf(1, 1, 0.4), Infinity);

      // sideways-'S'-shaped distribution
      assert.equal(jStat.kumaraswamy.pdf(0, 0.6, 1.2), Infinity);
      assert.epsilon(tol, jStat.kumaraswamy.pdf(0.5, 0.6, 1.2), 0.7657783992);
      assert.epsilon(tol, jStat.kumaraswamy.pdf(1, 0.6, 1.2), 0);

      // sideways-'Z'-shaped distribution
      assert.epsilon(tol, jStat.kumaraswamy.pdf(0, 1.3, 0.5), 0);
      assert.epsilon(tol, jStat.kumaraswamy.pdf(0.5, 1.3, 0.5), 0.6851052165);
      assert.equal(jStat.kumaraswamy.pdf(1, 1.3, 0.5), Infinity);

      // flat distribution
      assert.epsilon(tol, jStat.kumaraswamy.pdf(0, 1, 1), 1);
      assert.epsilon(tol, jStat.kumaraswamy.pdf(0.5, 1, 1), 1);
      assert.epsilon(tol, jStat.kumaraswamy.pdf(1, 1, 1), 1);

      // '/'-shaped distribution
      assert.epsilon(tol, jStat.kumaraswamy.pdf(0, 2, 1), 0);
      assert.epsilon(tol, jStat.kumaraswamy.pdf(0.5, 2, 1), 1);
      assert.epsilon(tol, jStat.kumaraswamy.pdf(1, 2, 1), 2);

      // '\'-shaped distribution
      assert.epsilon(tol, jStat.kumaraswamy.pdf(0, 1, 1.5), 1.5);
      assert.epsilon(tol, jStat.kumaraswamy.pdf(0.5, 1, 1.5), 1.060660172);
      assert.epsilon(tol, jStat.kumaraswamy.pdf(1, 1, 1.5), 0);

      // inverted-'U'-shaped distribution
      assert.epsilon(tol, jStat.kumaraswamy.pdf(0, 1.5, 1.5), 0);
      assert.epsilon(tol, jStat.kumaraswamy.pdf(0.5, 1.5, 1.5), 1.279186452);
      assert.epsilon(tol, jStat.kumaraswamy.pdf(1, 1.5, 1.5), 0);

      // peaked distribution
      assert.epsilon(tol, jStat.kumaraswamy.pdf(0, 7, 25), 0);
      assert.epsilon(tol, jStat.kumaraswamy.pdf(0.5, 7, 25), 2.265208101);
      assert.epsilon(tol, jStat.kumaraswamy.pdf(1, 7, 25), 0);
    }
  },
});

suite.export(module);