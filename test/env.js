jStat = require('../dist/jstat.js').jStat;

// Bad global variable hack to make this accessible
assertAlmostEqual = function assertAlmostEqual(x, y, tol) {
	// This handles positive and negative infinity
	if (x == y)
		return true;

	var diff = Math.abs(x - y);

	if (isNaN(diff))
		assert(false, "Number difference is NaN.");
	if (diff > tol)
		assert(false, "Number difference greater than tolerance");

	return true;
}
