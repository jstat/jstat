var vows = require('vows');
var assert = require('assert');
var suite = vows.describe('jStat.utils');

require('../env.js');

suite.addBatch({
  'jStat': {
    'topic': function() {
      return jStat.utils;
    },
    'calcRdx': function(utils) {
      assert.equal(utils.calcRdx(1e5, 1e10), 1e7);
    },
    'isArray': function(utils) {
      assert.isFalse(utils.isArray(true));
      assert.isFalse(utils.isArray({}));
      assert.isFalse(utils.isArray('123'));
      assert.isFalse(utils.isArray(/reg/));
      assert.isFalse(utils.isArray(1234));
      assert.isFalse(utils.isArray(function() {}));
      assert.isTrue(utils.isArray([]));
    },
    'isFunction': function(utils) {
      assert.isFalse(utils.isFunction(true));
      assert.isFalse(utils.isFunction([]));
      assert.isFalse(utils.isFunction({}));
      assert.isFalse(utils.isFunction('123'));
      assert.isFalse(utils.isFunction(/reg/));
      assert.isFalse(utils.isFunction(1234));
      assert.isTrue(utils.isFunction(function() {}));
    },
    'isNumber': function(utils) {
      assert.isFalse(utils.isNumber(true));
      assert.isFalse(utils.isNumber([]));
      assert.isFalse(utils.isNumber({}));
      assert.isFalse(utils.isNumber('123'));
      assert.isFalse(utils.isNumber(/reg/));
      assert.isFalse(utils.isNumber(function() {}));
      assert.isTrue(utils.isNumber(1234));
    }
  }
});

suite.export(module);
