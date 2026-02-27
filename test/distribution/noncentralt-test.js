var { describe, it } = require('node:test');
var assert = require('node:assert/strict');
var { jStat, assertEpsilon } = require('../helpers.js');

describe('non-central-t cdf', function() {
    //Checked against R pt(x,df,ncp)
    it('check cdf calculation', function() {
      var tol = 0.0000001;
        assertEpsilon(tol, jStat.noncentralt.cdf(-0.5, 3, 2), 0.007800301076444027);
        assertEpsilon(tol, jStat.noncentralt.cdf(0.5, 3, 2), 0.06547898556460677);
        assertEpsilon(tol, jStat.noncentralt.cdf(7, 3, 2), 0.9527511310481739);

        assertEpsilon(tol, jStat.noncentralt.cdf(23, 8, 25), 0.3084615014611897);
        assertEpsilon(tol, jStat.noncentralt.cdf(30, 8, 25), 0.695466162732754);

        assertEpsilon(tol, jStat.noncentralt.cdf(2, 28, 5), 0.001787373536766708);
        assertEpsilon(tol, jStat.noncentralt.cdf(8, 28, 5), 0.9790186262147481);
    });
    //Checked against R's dt(x, df, ncp)
    it('check pdf calculation', function() {
      var tol = 0.0000001;
        assertEpsilon(tol, jStat.noncentralt.pdf(-0.5, 3, 2), 0.0159905834194889);
        assertEpsilon(tol, jStat.noncentralt.pdf(0.5, 3, 2), 0.1296653879954894);
        assertEpsilon(tol, jStat.noncentralt.pdf(7, 3, 2), 0.01796331192039574);

        assertEpsilon(tol, jStat.noncentralt.pdf(23, 8, 25), 0.06329514733502346);
        assertEpsilon(tol, jStat.noncentralt.pdf(30, 8, 25), 0.04088472607966773);

        assertEpsilon(tol, jStat.noncentralt.pdf(2, 28, 5), 0.006044279465609167);
        assertEpsilon(tol, jStat.noncentralt.pdf(8, 28, 5), 0.02883829067311495);
    });
});
