jStat = require('../dist/jstat.js').jStat;

assertAlmostEqual = function (x, y, tol) {
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
