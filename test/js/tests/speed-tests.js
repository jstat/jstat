/*

jStat tests to run

jStat.seq
jStat.add
jStat.divide
jStat.multiply
jStat.subtract
jStat.dot
jStat.pow
jStat.abs
jStat.clear
jStat.norm
jStat.angle
jStat.symmetric
jStat.sum
jStat.min
jStat.max
jStat.mean
jStat.median
jStat.mode
jStat.range
jStat.variance
jStat.stdev
jStat.meandev
jStat.meddev
jStat.quartiles
jStat.covariance
jStat.corrcoeff
jStat.gammaln
jStat.gammafn
jStat.gammap
jStat.factorialln
jStat.factorial
jStat.combination
jStat.permutation
jStat.betafn

*/

(function(){

window.jStatTest = {
	seq : function() {
		test('jStat.seq', function(itter){
			for(;itter > 0; itter--){
				jStat.seq( 0, 10, 1001 );
			}
		}, 'inner');
	},
	add : function() {},
	divide : function() {},
	multiply : function() {},
	subtract : function() {},
	dot : function() {},
	pow : function() {},
	abs : function() {},
	clear : function() {},
	norm : function() {},
	angle : function() {},
	symmetric : function() {},
	sum : function() {},
	min : function() {},
	max : function() {},
	mean : function() {},
	median : function() {},
	mode : function() {},
	range : function() {},
	variance : function() {},
	stdev : function() {},
	meandev : function() {},
	meddev : function() {},
	quartiles : function() {},
	covariance : function() {},
	corrcoeff : function() {},
	gammaln : function() {},
	gammafn : function() {},
	gammap : function() {},
	factorialln : function() {},
	factorial : function() {},
	combination : function() {},
	permutation : function() {},
	betafn : function() {}
};

})();
