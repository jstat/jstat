var vows = require('vows');
var assert = require('assert');
var suite = vows.describe('jStat');

require('../env.js');

suite.addBatch({
  'model test': {
    'topic': function() {
      return jStat;
    },
    'array call': function(jStat) {
      var A = [
        [1, 2, 3],
        [1, 1, 0],
        [1, -2, 3],
        [1, 3, 4],
        [1, -10, 2],
        [1, 4, 4],
        [1, 10, 2],
        [1, 3, 2],
        [1, 4, -1]
      ];
        var b = [1, -2, 3, 4, -5, 6, 7, -8, 9];
        var model = jStat.models.ols(b, A);
        var tol = 0.01;
        //R2
        assert.epsilon(tol, model.R2, 0.309);
        // t test
        assert.epsilon(tol, model.t.p[0], 0.8377444317889267);
        assert.epsilon(tol, model.t.p[1], 0.1529673615844231);
        assert.epsilon(tol, model.t.p[2], 0.9909627983826588);
        // f test
        assert.epsilon(tol, model.f.pvalue, 0.33063636718598743);
    }
  }
});

suite.export(module);
