var vows = require('vows');
var assert = require('assert');
var suite = vows.describe('jStat.distribution');

require('../env.js');

suite.addBatch({
  'central F distribution': {
    'topic': function() {
      return jStat;
    },
    //Check against R's df(x, df1, df2)
    'check pdf calculation': function(jStat) {
      var tol = 0.0000001;

      var zeroth = jStat.centralF.pdf(0.2, 1, 3);
      assert.epsilon(tol, zeroth, 0.722349);

      var first = jStat.centralF.pdf(1, 100, 100);
      assert.epsilon(tol, first, 1.989731);

      var second = jStat.centralF.pdf(2.5, 50, 200);
      assert.epsilon(tol, second, 0.00003610325);

      var third = jStat.centralF.pdf(0.8, 2, 10);
      assert.epsilon(tol, third, 0.4104423);

      var fourth = jStat.centralF.pdf(0.4, 3, 10);
      assert.epsilon(tol, fourth, 0.6733766);

      var first_at_zero = jStat.centralF.pdf(0.0, 3, 5);
      assert.epsilon(tol, first_at_zero, 0);

      var second_at_zero = jStat.centralF.pdf(0.0, 2, 1);
      assert.epsilon(tol, second_at_zero, 1);

      var third_at_zero = jStat.centralF.pdf(0.0, 1, 1);
      assert.strictEqual(third_at_zero, Infinity);

      // When x = 0, and df1 = 2, return 1
      //   df(0, 2, 15)
      assert.epsilon(tol, jStat.centralF.pdf(0, 2, 15), 1);

      // When x = 0, and df1 < 2, return Infinity
      //   df(0, 1, 20)
      assert.equal(jStat.centralF.pdf(0, 1, 20), Infinity);      
    }
  },
});

suite.export(module);
