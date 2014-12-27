var vows = require('vows');
var assert = require('assert');
var suite = vows.describe('jStat.distribution');

require('../env.js');

suite.addBatch({
  'chisquare pdf': {
    'topic': function() {
      return jStat;
    },
    //Checked against R dchisq(x,df)
    'check pdf calculation': function(jStat) {
      var tol = 0.0000001;
      assert.epsilon(tol, jStat.chisquare.pdf(3.5, 10), 0.03395437);
    },
    'check pdf calculation at x = 0.0': function(jStat) {
      var tol = 0.0000001;
      assert.epsilon(tol, jStat.chisquare.pdf(0.0, 5), 0.0);
    },
    //Checked against R's pchisq(x, df)
    'check cdf calculation': function(jStat) {
      var tol = 0.0000001;
      assert.epsilon(tol, jStat.chisquare.cdf(2.5, 8), 0.03826905);
    },
    //Checked against R's qchisq(x, df)
    'check inv calculation': function(jStat) {
      var tol = 0.00001;
      assert.epsilon(tol, jStat.chisquare.inv(0.95, 10), 18.30704);
    },
    //Checked against R's qchisq(x, df)
    'check inv calculation again': function(jStat) {
      var tol = 0.00001;
      assert.epsilon(tol, jStat.chisquare.inv(0.85, 10), 14.53394);
    }
  },
});

suite.export(module);
