var { describe, it } = require('node:test');
var assert = require('node:assert/strict');
var { jStat, assertEpsilon } = require('../helpers.js');

var data = [
  [31, 35, 35, 37, 37, 39, 40, 41, 41, 43, 44, 44, 44, 44, 44, 44, 46, 46, 46, 47, 49, 49, 49, 49, 50, 52, 54, 54, 54, 54, 55, 57, 57, 57, 59, 59, 60, 60, 62, 62, 62, 62, 65, 65, 65, 65, 65],
  [31, 31, 31, 33, 33, 36, 37, 39, 39, 39, 40, 41, 41, 41, 41, 41, 41, 42, 44, 44, 44, 44, 44, 45, 46, 46, 46, 46, 46, 46, 47, 49, 49, 49, 49, 50, 52, 52, 52, 52, 52, 52, 52, 52, 53, 54, 54, 54, 54, 54, 54, 54, 54, 54, 55, 55, 57, 57, 57, 57, 57, 57, 57, 59, 59, 59, 59, 59, 59, 59, 59, 59, 59, 59, 59, 59, 59, 59, 59, 61, 62, 62, 62, 62, 62, 62, 62, 62, 63, 65, 65, 65, 65, 67, 67],
  [33, 33, 36, 38, 39, 40, 41, 41, 42, 44, 49, 49, 49, 52, 52, 52, 52, 52, 52, 54, 54, 54, 54, 57, 57, 59, 59, 59, 59, 59, 59, 59, 60, 60, 61, 61, 61, 62, 62, 62, 62, 62, 62, 63, 63, 63, 65, 65, 65, 65, 65, 65, 65, 67, 67, 67, 67, 67]
];

var sd = jStat.pooledstdev(data);
var n = data[0].length + data[1].length + data[2].length;
var k = data.length;

var tol = 0.0000001;
var pvalues = [
  // Results from R's TukeyHSD()
  [[0, 1], 0.7096950],
  [[0, 2], 0.0114079],
  [[1, 2], 0.0289035]
];

describe('qtest ', function() {
  it('(qscore, n, k) pattern works', function() {
    for (var i = 0; i < pvalues.length; ++i) {
      var pair = pvalues[i][0];
      var p = jStat.qtest(jStat.qscore(data[pair[0]], data[pair[1]], sd), n, k);
      assertEpsilon(tol, p, pvalues[i][1]);
    }
  });
  it('(mean1, mean2, n1, n2, sd, n, k) pattern works', function() {
    for (var i = 0; i < pvalues.length; ++i) {
      var pair = pvalues[i][0];
      var mean1 = jStat.mean(data[pair[0]]);
      var mean2 = jStat.mean(data[pair[1]]);
      var p = jStat.qtest(mean1, mean2, data[pair[0]].length, data[pair[1]].length, sd, n, k);
      assertEpsilon(tol, p, pvalues[i][1]);
    }
  });
  it('(array1, array2, sd, n, k) pattern works', function() {
    for (var i = 0; i < pvalues.length; ++i) {
      var pair = pvalues[i][0];
      var p = jStat.qtest(data[pair[0]], data[pair[1]], sd, n, k);
      assertEpsilon(tol, p, pvalues[i][1]);
    }
  });
});

describe('tukeyhsd ', function() {
  it('works', function() {
    var results = jStat.tukeyhsd(data);
    for (var i = 0; i < results.length; ++i) {
      assert.deepStrictEqual(results[i][0], pvalues[i][0]);
      assertEpsilon(tol, results[i][1], pvalues[i][1]);
    }
  });
});
