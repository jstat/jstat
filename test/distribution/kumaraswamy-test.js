var vows = require('vows');
var assert = require('assert');
var suite = vows.describe('jStat.distribution');

require('../env.js');

suite.addBatch({
  'kumaraswamy cdf': {
    'topic': function() {
      return jStat;
    },
    // Checked against R's pkumar(q, shape1, shape2, lower.tail = TRUE, log.p = FALSE) in package VGAM
    //   install.packages("VGAM")
    //   library("VGAM")
    //   options(digits=10)
    //   pkumar(c(0, 0.5, 1), 0.5, 0.5)
    //   pkumar(c(0, 0.5, 1), 0.8, 1) # Note: Incorrectly returns NaN for x = 1!
    //   pkumar(c(0, 0.5, 1), 1, 0.4) # Note: Incorrectly returns NaN for x = 0!
    //   pkumar(c(0, 0.5, 1), 0.6, 1.2)
    //   pkumar(c(0, 0.5, 1), 1.3, 0.5)
    //   pkumar(c(0, 0.5, 1), 1, 1) # Note: Incorrectly returns NaN for x = 0 and x = 1!
    //   pkumar(c(0, 0.5, 1), 2, 1) # Note: Incorrectly returns NaN for x = 1!
    //   pkumar(c(0, 0.5, 1), 1, 1.5) # Note: Incorrectly returns NaN for x = 0!
    //   pkumar(c(0, 0.5, 1), 1.5, 1.5)
    //   pkumar(c(0, 0.5, 1), 7, 25)
	//	 pkumar(c(-5, 5), 2, 2)
	'check cdf calculation': function(jStat) {
      var tol = 0.0000001;
      // 'U'-shaped distribution
      assert.epsilon(tol, jStat.kumaraswamy.cdf(0, 0.5, 0.5), 0);
      assert.epsilon(tol, jStat.kumaraswamy.cdf(0.5, 0.5, 0.5), 0.4588038999);
      assert.epsilon(tol, jStat.kumaraswamy.cdf(1, 0.5, 0.5), 1);

      // 'L'-shaped distribution
      assert.epsilon(tol, jStat.kumaraswamy.cdf(0, 0.8, 1), 0);
      assert.epsilon(tol, jStat.kumaraswamy.cdf(0.5, 0.8, 1), 0.5743491775);
      assert.epsilon(tol, jStat.kumaraswamy.cdf(1, 0.8, 1), 1);
      
      // reversed-'L'-shaped distribution
      assert.epsilon(tol, jStat.kumaraswamy.cdf(0, 1, 0.4), 0);
      assert.epsilon(tol, jStat.kumaraswamy.cdf(0.5, 1, 0.4), 0.2421417167);
      assert.epsilon(tol, jStat.kumaraswamy.cdf(1, 1, 0.4), 1);

      // sideways-'S'-shaped distribution
      assert.epsilon(tol, jStat.kumaraswamy.cdf(0, 0.6, 1.2), 0);
      assert.epsilon(tol, jStat.kumaraswamy.cdf(0.5, 0.6, 1.2), 0.7257468009);
      assert.epsilon(tol, jStat.kumaraswamy.cdf(1, 0.6, 1.2), 1);

      // sideways-'Z'-shaped distribution
      assert.epsilon(tol, jStat.kumaraswamy.cdf(0, 1.3, 0.5), 0);
      assert.epsilon(tol, jStat.kumaraswamy.cdf(0.5, 1.3, 0.5), 0.2293679206);
      assert.epsilon(tol, jStat.kumaraswamy.cdf(1, 1.3, 0.5), 1);

      // flat distribution
      assert.epsilon(tol, jStat.kumaraswamy.cdf(0, 1, 1), 0);
      assert.epsilon(tol, jStat.kumaraswamy.cdf(0.5, 1, 1), 0.5);
      assert.epsilon(tol, jStat.kumaraswamy.cdf(1, 1, 1), 1);

      // '/'-shaped distribution
      assert.epsilon(tol, jStat.kumaraswamy.cdf(0, 2, 1), 0);
      assert.epsilon(tol, jStat.kumaraswamy.cdf(0.5, 2, 1), 0.25);
      assert.epsilon(tol, jStat.kumaraswamy.cdf(1, 2, 1), 1);

      // '\'-shaped distribution
      assert.epsilon(tol, jStat.kumaraswamy.cdf(0, 1, 1.5), 0);
      assert.epsilon(tol, jStat.kumaraswamy.cdf(0.5, 1, 1.5), 0.6464466094);
      assert.epsilon(tol, jStat.kumaraswamy.cdf(1, 1, 1.5), 1);

      // inverted-'U'-shaped distribution
      assert.epsilon(tol, jStat.kumaraswamy.cdf(0, 1.5, 1.5), 0);
      assert.epsilon(tol, jStat.kumaraswamy.cdf(0.5, 1.5, 1.5), 0.4802446206);
      assert.epsilon(tol, jStat.kumaraswamy.cdf(1, 1.5, 1.5), 1);

      // peaked distribution
      assert.epsilon(tol, jStat.kumaraswamy.cdf(0, 7, 25), 0);
      assert.epsilon(tol, jStat.kumaraswamy.cdf(0.5, 7, 25), 0.1780530605);
      assert.epsilon(tol, jStat.kumaraswamy.cdf(1, 7, 25), 1);

      // outside support
      assert.epsilon(tol, jStat.kumaraswamy.cdf(-5, 2, 2), 0);
      assert.epsilon(tol, jStat.kumaraswamy.cdf(5, 2, 2), 1);
    }
  },
});

suite.export(module);