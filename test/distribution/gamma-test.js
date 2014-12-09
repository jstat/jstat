var vows = require('vows');
var assert = require('assert');
var suite = vows.describe('jStat.distribution');

require('../env.js');

suite.addBatch({
  'gamma pdf': {
    'topic': function() {
      return jStat;
    },
    'check instance and static pdf method': function (jStat) {
      var shape = 5;
      var scale = 1;
      var gamma = jStat.gamma(shape, scale);
      var xValues = [-1, 0, 1];
      var x;
      for (var i = 0; i < xValues.length; i++) {
        x = xValues[i];
        pStatic = jStat.gamma.pdf(x, shape, scale);
        pInstance = gamma.pdf(x);
        if (isNaN(pStatic)) {
          assert(isNaN(pInstance));
        } else {
          assert(pStatic === pInstance,
                 'Gamma pdf evaluated at ' +
                   x + ' should be equal for instance and static methods.');
        }
      }
    }
  },
});

suite.export(module);
