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

var tmpseq = jStat.seq( 0, 10, 1001 );

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
	sum : function() {
		test('jStat.sum', function(itter){
			for(;itter > 0; itter--){
				jStat.sum( tmpseq );
			}
		}, 'inner');
	},
	sumsqrd : function() {
		test('jStat.sumsqrd', function(itter){
			for(;itter > 0; itter--){
				jStat.sumsqrd( tmpseq );
			}
		}, 'inner');
	},
	sumsqerr : function() {
		test('jStat.sumsqerr', function(itter){
			for(;itter > 0; itter--){
				jStat.sumsqerr( tmpseq );
			}
		}, 'inner');
	},
	product : function() {
		test('jStat.product', function(itter){
			for(;itter > 0; itter--){
				jStat.product( tmpseq );
			}
		}, 'inner');
	},
	min : function() {
		test('jStat.min', function(itter){
			for(;itter > 0; itter--){
				jStat.min( tmpseq );
			}
		}, 'inner');
	},
	max : function() {
		test('jStat.max', function(itter){
			for(;itter > 0; itter--){
				jStat.max( tmpseq );
			}
		}, 'inner');
	},
	mean : function() {
		test('jStat.mean', function(itter){
			for(;itter > 0; itter--){
				jStat.mean( tmpseq );
			}
		}, 'inner');
	},
	meansqerr : function() {
		test('jStat.meansqerr', function(itter){
			for(;itter > 0; itter--){
				jStat.meansqerr( tmpseq );
			}
		}, 'inner');
	},
	geomean : function() {
		test('jStat.geomean', function(itter){
			for(;itter > 0; itter--){
				jStat.geomean( tmpseq );
			}
		}, 'inner');
	},
	median : function() {
		test('jStat.median', function(itter){
			for(;itter > 0; itter--){
				jStat.median( tmpseq );
			}
		}, 'inner');
	},
	mode : function() {
		test('jStat.mode', function(itter){
			for(;itter > 0; itter--){
				jStat.mode( tmpseq );
			}
		}, 'inner');
	},
	range : function() {
		test('jStat.range', function(itter){
			for(;itter > 0; itter--){
				jStat.range( tmpseq )
			}
		}, 'inner');
	},
	variance : function() {
		test('jStat.variance', function(itter){
			for(;itter > 0; itter--){
				jStat.variance( tmpseq );
			}
		}, 'inner');
	},
	stdev : function() {
		test('jStat.stdev', function(itter){
			for(;itter > 0; itter--){
				jStat.stdev( tmpseq );
			}
		}, 'inner');
	},
	meandev : function() {
		test('jStat.meandev', function(itter){
			for(;itter > 0; itter--){
				jStat.meandev( tmpseq );
			}
		}, 'inner');
	},
	meddev : function() {
		test('jStat.meddev', function(itter){
			for(;itter > 0; itter--){
				jStat.meddev( tmpseq );
			}
		}, 'inner');
	},
	quartiles : function() {
		test('jStat.quartiles', function(itter){
			for(;itter > 0; itter--){
				jStat.quartiles( tmpseq );
			}
		}, 'inner');
	},
	covariance : function() {
		test('jStat.covariance', function(itter){
			for(;itter > 0; itter--){
				jStat.covariance( tmpseq, tmpseq );
			}
		}, 'inner');
	},
	corrcoeff : function() {
		test('jStat.corrcoeff', function(itter){
			for(;itter > 0; itter--){
				jStat.corrcoeff( tmpseq, tmpseq );
			}
		}, 'inner');
	},
	gammaln : function() {
		test('jStat.gammaln', function(itter){
			for(;itter > 0; itter--){
				jStat.gammaln( 5 );
			}
		}, 'inner');
	},
	gammafn : function() {
		test('jStat.gammafn', function(itter){
			for(;itter > 0; itter--){
				jStat.gammafn( 5 );
			}
		}, 'inner');
	},
	gammap : function() {
		test('jStat.gammap', function(itter){
			for(;itter > 0; itter--){
				jStat.gammap( 5, 2 );
			}
		}, 'inner');
	},
	factorialln : function() {
		test('jStat.factorialln', function(itter){
			for(;itter > 0; itter--){
				jStat.factorialln( 5 );
			}
		}, 'inner');
	},
	factorial : function() {
		test('jStat.factorial', function(itter){
			for(;itter > 0; itter--){
				jStat.factorial( 5 );
			}
		}, 'inner');
	},
	combination : function() {
		test('jStat.combination', function(itter){
			for(;itter > 0; itter--){
				jStat.combination( 5, 3 );
			}
		}, 'inner');
	},
	permutation : function() {
		test('jStat.permutation', function(itter){
			for(;itter > 0; itter--){
				jStat.permutation( 5, 3 );
			}
		}, 'inner');
	},
	betafn : function() {
		test('jStat.betafn', function(itter){
			for(;itter > 0; itter--){
				jStat.betafn( 10, 2 );
			}
		}, 'inner');
	}
};

})();
