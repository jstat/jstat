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
      assert.isNumber(zeroth);
      assert.epsilon(tol, zeroth, 0.722349);

      var first = jStat.centralF.pdf(1, 100, 100);
      assert.isNumber(first);
      assert.epsilon(tol, first, 1.989731);

      var second = jStat.centralF.pdf(2.5, 50, 200);
      assert.isNumber(second);
      assert.epsilon(tol, second, 0.00003610325);

      var third = jStat.centralF.pdf(0.8, 2, 10);
      assert.isNumber(third);
      assert.epsilon(tol, third, 0.4104423);

      var value = jStat.centralF.pdf(0.4, 3, 10);
      assert.isNumber(value);
      assert.epsilon(tol, value, 0.6733766);
    }
  },
});

suite.export(module);
