$(function() {
	module('main');

	test('sum',function(){
		equals(jStat.sum([1,2,3,4,5,6]),21,'sum([1,2,3,4,5,6])');
	});

	test('min',function(){
		equals(jStat.min([1,2,3,4,5,6]),1,'min([1,2,3,4,5,6])');
	});

	test('max',function(){
		equals(jStat.max([1,2,3,4,5,6]),6,'max([1,2,3,4,5,6])');
	});

	test('mean',function(){
		equals(jStat.mean([1,2,3,4,5,6]),3.5,'mean([1,2,3,4,5,6])');
	});

	test('median',function(){
		equals(jStat.median([1,2,3,3,4,5,6]),3,'median([1,2,3,3,4,5,6])');
		equals(jStat.median([1,2,3,4,5,6]),3.5,'median([1,2,3,4,5,6])');
	});

	test('mode',function(){
		equals(jStat.mode([1,2,3,3,4,5,6]),3,'mode([1,2,3,3,4,5,6])');
		equals(jStat.mode([1,1,2,3,3,4,5,6]),false,'mode([1,1,2,3,3,4,5,6])');
	});

	test('range',function(){
		equals(jStat.range([1,2,3,3,4,5,6]),5,'range([1,2,3,3,4,5,6])');
		equals(jStat.range([-3,-6,-4]),3,'range([-3,-6,-4])');
	});

	test('variance',function(){
		equals(jStat.variance([1,2,3,4,5,6]),3.5,'variance([1,2,3,4,5,6])');
	});

	test('stdev',function(){
		equals(jStat.stdev([3,4,5]),1,'stdev([3,4,5])');
		equals(jStat.stdev([-3,-4,-5]),1,'stdev([-3,-4,-5])');
	});

	test('meandev',function(){
		equals(jStat.meandev([2,2,3,4,14]),3.6,'meandev([2,2,3,4,14])');
	});

	test('meddev',function(){
		equals(jStat.meddev([2,2,3,4,14]),2.8,'meddev([2,2,3,4,14])');
	});

	test('factorial',function(){
		equals(jStat.factorial(5),120,'factorial(5)');
		equals(jStat.factorial(.5),0.8862269254527566,'factorial(.5)');
	});

	test('combination',function(){
		equals(jStat.combination(10,4),210,'combination(10,4)');
	});

	test('permutation',function(){
		equals(jStat.permutation(10,4),5040,'permutation(10,4)');
	});

	test('gamma',function(){
		equals(jStat.gammafn(.5),1.7724538509055165,'gamma(.5)');
		equals(jStat.gammafn(15),87178291200,'gamma(5)');
	});

	test('quartiles',function(){
		equals(jStat.quartiles([1,2,3,6,9,3,1,2,5]).toString(),'1,3,5','quartiles([1,2,3,6,9,3,1,2,5])');
	});

	test('covariance',function(){
		equals(jStat.covariance([1,2,3,6,9,3,1,2,5],[2,3,5,2,5,7,8,9,6]),-1.1234567901234565,'covariance([1,2,3,6,9,3,1,2,5],[2,3,5,2,5,7,8,9,6])');
	});

	test('corrcoeff',function(){
		equals(jStat.corrcoeff([1,2,3,6,9,3,1,2,5],[2,3,5,2,5,7,8,9,6]),-0.16693777514921238,'corrcoeff([1,2,3,6,9,3,1,2,5],[2,3,5,2,5,7,8,9,6])');
	});

	module('distribution');

	test('uniformcdf',function(){
		equals(jDist.uniform.cdf(0.5, 0, 2),0.25,'uniform.cdf(0, 2, 0.5)');
	});

	test('binomial',function(){
		equals(jDist.binomial.pdf(2, 5, 0.5),0.3125,'binomial.pdf(5, 1/2, 2)');
	});

	test('weibull',function(){
		equals(jDist.weibull.pdf(1,1,1),0.36787944117144233,'weibull(1,1,1)');
		equals(jDist.weibull.pdf(2,1,2),0.18393972058572117,'weibull(2,1,2)');
	});

	test('weibullcdf',function(){
		equals(jDist.weibull.cdf(1,1,1),0.6321205588285577,'weibull.cdf(1,1,1)');
		equals(jDist.weibull.cdf(2,1,2),0.6321205588285577,'weibull.cdf(2,1,2)');
	});

});
