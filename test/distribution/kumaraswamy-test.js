var vows = require('vows');
var assert = require('assert');
var suite = vows.describe('jStat.distribution');

require('../env.js');

suite.addBatch({
  'kumaraswamy inv': {
    'topic': function() {
      return jStat;
    },
    // Checked against R's qkumar(p, shape1, shape2, lower.tail=TRUE, log.p=FALSE) in package VGAM
    //   install.packages("VGAM")
    //   library("VGAM")
    //   options(digits=10)
    //   qkumar(c(0, 0.5, 1), 0.5, 0.5)
    //   qkumar(c(0, 0.5, 1), 0.8, 1)
    //   qkumar(c(0, 0.5, 1), 1, 0.4)
    //   qkumar(c(0, 0.5, 1), 0.6, 1.2)
    //   qkumar(c(0, 0.5, 1), 1, 1)
    //   qkumar(c(0, 0.5, 1), 2, 1)
    //   qkumar(c(0, 0.5, 1), 1.5, 1.5)
    //   qkumar(c(0, 0.5, 1), 7, 25)
'check inv calculation': function(jStat) {
      var tol = 0.0000001;
      // 'U'-shaped distribution
      assert.epsilon(tol, jStat.kumaraswamy.inv(0, 0.5, 0.5), 0);
      assert.epsilon(tol, jStat.kumaraswamy.inv(0.5, 0.5, 0.5), 0.5625);
      assert.epsilon(tol, jStat.kumaraswamy.inv(1, 0.5, 0.5), 1);

      // 'L'-shaped distribution
      assert.epsilon(tol, jStat.kumaraswamy.inv(0, 0.8, 1), 0);
      assert.epsilon(tol, jStat.kumaraswamy.inv(0.5, 0.8, 1), 0.4204482076);
      assert.epsilon(tol, jStat.kumaraswamy.inv(1, 0.8, 1), 1);
      
      // reversed-'L'-shaped distribution
      assert.epsilon(tol, jStat.kumaraswamy.inv(0, 1, 0.4), 0);
      assert.epsilon(tol, jStat.kumaraswamy.inv(0.5, 1, 0.4), 0.8232233047);
      assert.epsilon(tol, jStat.kumaraswamy.inv(1, 1, 0.4), 1);

      // sideways-'S'-shaped distribution
      assert.epsilon(tol, jStat.kumaraswamy.inv(0, 0.6, 1.2), 0);
      assert.epsilon(tol, jStat.kumaraswamy.inv(0.5, 0.6, 1.2), 0.2533532737);
      assert.epsilon(tol, jStat.kumaraswamy.inv(1, 0.6, 1.2), 1);

      // flat distribution
      assert.epsilon(tol, jStat.kumaraswamy.inv(0, 1, 1), 0);
      assert.epsilon(tol, jStat.kumaraswamy.inv(0.5, 1, 1), 0.5);
      assert.epsilon(tol, jStat.kumaraswamy.inv(1, 1, 1), 1);

      // '/'-shaped distribution
      assert.epsilon(tol, jStat.kumaraswamy.inv(0, 2, 1), 0);
      assert.epsilon(tol, jStat.kumaraswamy.inv(0.5, 2, 1), 0.7071067812);
      assert.epsilon(tol, jStat.kumaraswamy.inv(1, 2, 1), 1);

      // inverted-'U'-shaped distribution
      assert.epsilon(tol, jStat.kumaraswamy.inv(0, 1.5, 1.5), 0);
      assert.epsilon(tol, jStat.kumaraswamy.inv(0.5, 1.5, 1.5), 0.5154248709);
      assert.epsilon(tol, jStat.kumaraswamy.inv(1, 1.5, 1.5), 1);

      // peaked distribution
      assert.epsilon(tol, jStat.kumaraswamy.inv(0, 7, 25), 0);
      assert.epsilon(tol, jStat.kumaraswamy.inv(0.5, 7, 25), 0.5979941923);
      assert.epsilon(tol, jStat.kumaraswamy.inv(1, 7, 25), 1);
    }
  },
});

suite.export(module);
