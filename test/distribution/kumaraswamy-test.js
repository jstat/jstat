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
	//	 dkumar(c(-5, 5), 2, 2)
	'check pdf calculation': function(jStat) {
      var tol = 0.0000001;
      // outside support
      assert.epsilon(tol, jStat.kumaraswamy.pdf(-5, 2, 2), 0);
      assert.epsilon(tol, jStat.kumaraswamy.pdf(5, 2, 2), 0);
    }
  },
});

suite.export(module);