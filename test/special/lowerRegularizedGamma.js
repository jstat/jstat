var vows = require('vows');
var assert = require('assert');
var suite = vows.describe('jStat.gammap');

require('../env.js');

suite.addBatch({
  'gammap': {
    'topic': function() {
      return jStat;
    },

    //Checked against Mathematica Gamma[a, 0, x]
    //Also checked against R's gammainc(x, a) via the pracma library
    //gammainc() outputs three values, this matches 'reginc'
    'check gammap': function(jStat) {
      var tol = 0.000001;
      assert.epsilon(tol, jStat.gammap(5, 5), 0.5595067);
      assert.epsilon(tol, jStat.gammap(5, 4), 0.7349741);
      assert.epsilon(tol, jStat.gammap(10, 11), 0.04169602);
    }
  }
});

suite.export(module);

