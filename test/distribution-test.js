var vows = require('vows'),
assert = require('assert');
suite = vows.describe('jStat.distribution');

require('./env.js')

suite.addBatch({
	'beta pdf': {
	    'topic' : function() {
		return jStat;
	    },
	    'check pdf calculation' : function(jStat) {

		var assertAlmostEqual = function (x, y, tol) {

		    if (x == y) {
			// This handles positive
			// and negative infinity
			return true;
		    };
		    var diff = Math.abs(x-y);

		    if (isNaN(diff)) {
			assert(false, "Number difference is NaN.");
		    }

		    if (diff > tol) {
			assert(false, "Number difference greater than tolerance");
		    };

		    return true;
		};
    
		// Non-log form of the Beta pdf
		var pdf = function (x, alpha, beta) {
		    return (x > 1 || x < 0) ? 0 : ((Math.pow(x, alpha - 1)
						    * Math.pow(1 - x, beta - 1))
						   / jStat.betafn(alpha, beta));
		};

		var tol = 0.0000001;

		var args = [0, 0.1, 0.3, 0.5, 0.7, 0.9, 1];

		for (var i=0; i < args.length; i++) {
		    var arg = args[i];
		    assertAlmostEqual(jStat.beta.pdf(arg, 0.1, 0.1),
			              pdf(arg, 0.1, 0.1), tol);

		    assertAlmostEqual(jStat.beta.pdf(arg, 1, 1),
			              pdf(arg, 1, 1), tol);

		    assertAlmostEqual(jStat.beta.pdf(arg, 10, 50),
			              pdf(arg, 10, 50), tol);

		    // Show that the log form of the pdf performs
		    // better for large parameter values
		    assert(!isNaN(jStat.beta.pdf(arg, 1000, 5000)),
			   "New Beta pdf is NaN for large parameter values.");
		    assert(isNaN(pdf(arg, 1000, 5000)),
			   "Old Beta pdf is not NaN for large parameter values.");
		}
	    }
	}
});

suite.export(module);