var vows = require('vows');
var assert = require('assert');
var suite = vows.describe('jStat');

require('../env.js');

suite.addBatch({
  'univariate no-intercept regression': {
    'topic': function() {
      return jStat;
    },
    'array call': function(jStat) {
      var exog = [[0], [4], [2], [3]];
      var endog = [1, 9, 5, 7];
      var model = jStat.models.ols(endog,exog);
      var tol   = 0.00000001;
      assert.epsilon(tol, model.coef[0], 2.310344828);
      assert.epsilon(tol, model.t.se[0], 0.117781043);
    }
  }
});

suite.export(module);
