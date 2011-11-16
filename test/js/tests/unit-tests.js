$(function() {
	var singleArr = [ 1, 2, 3 ],
		doubleArr = [[ 1, 2, 3 ],[ 4, 5, 6 ],[ 7, 8, 9 ]];

	module( 'core' );

	test( 'sequence generation', function() {
		deepEqual( jStat.seq( 0, 1, 5 ), [ 0, 0.25, 0.5, 0.75, 1 ], 'seq( 0, 1, 5 )' );
	});

	test( 'row count', function() {
		equals( jStat( singleArr.slice() ).rows(), 1, 'fn.rows()' );
		equals( jStat( doubleArr.slice() ).rows(), 3, 'fn.rows()' );
	});

	test( 'column count', function() {
		equals( jStat( singleArr.slice() ).cols(), 3, 'fn.cols()' );
		equals( jStat( doubleArr.slice() ).cols(), 3, 'fn.cols()' );
	});

	test( 'dimensions', function() {
		deepEqual( jStat( singleArr.slice()).dimensions(), {
			rows : 1,
			cols : 3
		}, 'fn.dimensions()' );
		deepEqual( jStat( doubleArr.slice()).dimensions(), {
			rows : 3,
			cols : 3
		}, 'fn.dimensions()' );
	});

	test( 'row vector', function() {
		deepEqual( jStat( singleArr.slice()).row( 0 ).toArray(), [[ 1, 2, 3 ]], 'fn.row()' );
		deepEqual( jStat( doubleArr.slice()).row( 1 ).toArray(), [[ 4, 5, 6 ]], 'fn.row()' );
	});

	test( 'column vector', function() {
		deepEqual( jStat( singleArr.slice()).col( 0 ).toArray(), [[ 1 ]], 'fn.col()' );
		deepEqual( jStat( doubleArr.slice()).col( 1 ).toArray(), [[ 2 ],[ 5 ],[ 8 ]], 'fn.col()' );
	});

	test( 'matrix diagonal', function() {
		deepEqual( jStat( doubleArr.slice()).diag().toArray(), [[ 1 ],[ 5 ],[ 9 ]], 'fn.diag()' );
	});

	test( 'matrix anti-diagonal', function() {
		deepEqual( jStat( doubleArr.slice()).antidiag().toArray(), [[ 3 ],[ 5 ],[ 7 ]], 'fn.antidiag()' );
	});

	test( 'matrix transpose', function() {
		deepEqual( jStat.transpose( doubleArr ), [[ 1, 4, 7 ],[ 2, 5, 8 ],[ 3, 6, 9 ]], 'transpose()' );
	});

	test( 'map', function() {
		deepEqual( jStat.map( doubleArr, function( x ) {
			return x * 2;
		}), [[ 2, 4, 6 ],[ 8, 10, 12 ],[ 14, 16, 18 ]], 'map()' );
	});

	test( 'add', function() {
		deepEqual( jStat.add( doubleArr, 2 ), [[ 3, 4, 5 ],[ 6, 7, 8 ],[ 9, 10, 11 ]], 'add()' );
	});

	test( 'subtract', function() {
		deepEqual( jStat.subtract( doubleArr, 2 ), [[ -1, 0, 1 ],[ 2, 3, 4 ],[ 5, 6, 7 ]], 'subtract()' );
		deepEqual( jStat.subtract([[ 1, 2 ],[ 3, 4 ]],[[ 2, 1 ],[ 4, 3 ]]), [[ -1, 1 ],[ -1, 1 ]], 'subtract()' );
	});

	test( 'multiply', function() {
		deepEqual( jStat.multiply( doubleArr, 2 ), [[ 2, 4, 6 ],[ 8, 10, 12 ],[ 14, 16, 18 ]], 'multiply()' );
	});

	test( 'divide', function() {
		deepEqual( jStat.divide( singleArr, 2 ), [ 1 / 2, 1, 3 / 2 ], 'divide()' );
	});

	test( 'dot', function() {
		deepEqual( jStat.dot([[ 1, 2 ],[ 3, 4 ]],[[ 5, 6 ],[ 7, 8 ]]), [ 17, 53 ], 'dot()' );
	});

	test( 'pow', function() {
		deepEqual( jStat.pow( singleArr, 2 ), [ 1, 4, 9 ], 'pow()' );
	});

	test( 'abs', function() {
		deepEqual( jStat.abs([ 1, -1, -2 ]), [ 1, 1, 2 ], 'abs()' );
	});

	test( 'vector norm', function() {
		equals( jStat.norm([ 1, 2, 3 ], 1 ), 6, 'norm()' );
		equals( jStat.norm([ 1, 2, 3 ]), 3.7416573867739413, 'norm()' );
	});

	test( 'vector angle', function() {
		equals( jStat.angle([ 1, 0, 1 ],[ 0, 1, 0 ]), Math.PI / 2, 'angle()' );
	});

	test( 'symmetric', function() {
		equals( jStat.symmetric( singleArr ), false, 'symmetric()' );
		equals( jStat.symmetric( doubleArr ), false, 'symmetric()' );
		equals( jStat.symmetric([[ 1, 2 ],[ 2, 1 ]]), true, 'symmetric()' );
	});

	test('sum',function(){
		equals(jStat.sum([1,2,3,4,5,6]),21,'sum([1,2,3,4,5,6])');
	});

	test('sumsqrd',function(){
		equals(jStat.sumsqrd([1,2,3,4]),30,'sumsqrt([1,2,3,4])');
	});

	test('sumsqerr',function(){
		equals(jStat.sumsqerr([1,2,3,4,5,6]),17.5,'sumsqerr([1,2,3,4,5,6])');
	});

	test('product',function(){
		equals(jStat.product([1,2,3,4,5,6]),720,'product([1,2,3,4,5,6])');
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

	test('meansqerr',function(){
		equals(jStat.meansqerr([1,2,3,4,5]),2,'meansqerr([1,2,3,4,5])');
	});

	test('geomean',function(){
		equals(jStat.geomean([1,2,3,4,5,6]),2.993795165523909,'geomean([1,2,3,4,5,6])');
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
		equals(jStat.variance([3,4,5,6,7]),2,'variance([3,4,5,6,7])');
		equals(jStat.variance([1,2,3,4,5,6], 1),3.5,'variance([1,2,3,4,5,6], 1)');
	});

	test('stdev',function(){
		equals(jStat.stdev([3,4,5], 1),1,'stdev([3,4,5], 1)');
		equals(jStat.stdev([-3,-4,-5], 1),1,'stdev([-3,-4,-5], 1)');
		equals(jStat.stdev([1,2,3]), 0.816496580927726, 'stdev([1,2,3])');
	});

	test('meandev',function(){
		equals(jStat.meandev([2,2,3,4,14]),3.6,'meandev([2,2,3,4,14])');
	});

	test('meddev',function(){
		equals(jStat.meddev([2,2,3,4,14]),2.8,'meddev([2,2,3,4,14])');
	});

	test('factorial',function(){
		equals(jStat.factorial(5),120,'factorial(5)');
		equals(jStat.factorial(.5).toFixed(7),'0.8862269','factorial(.5)');
	});

	test('combination',function(){
		equals(jStat.combination(10,4),210,'combination(10,4)');
	});

	test('permutation',function(){
		equals(jStat.permutation(10,4),5040,'permutation(10,4)');
	});

	test('gamma',function(){
		equals(jStat.gammafn(.5).toFixed(7),'1.7724539','gamma(.5)');
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

	test('beta',function(){
		equals(jStat.beta.pdf(0,1,1),1,'beta.pdf(0,1,1)');
		equals(jStat.beta.pdf(0.5,0.5,0.5),0.6366197687940683,'beta.pdf(0.5,0.5,0.5)');
		equals(jStat.beta.cdf(0,1,1),0,'beta.cdf(0,1,1)');
		equals(jStat.beta.cdf(0.5,0.5,0.5).toFixed(4),'0.5000','beta.cdf(0.5,0.5,0.5)');
	});

	test('cauchy',function(){
		equals(jStat.cauchy.pdf(0,1,1),0.15915494309189535,'cauchy.pdf(0,1,1)');
		equals(jStat.cauchy.pdf(0.5,0.5,0.5),0.6366197723675814,'cauchy.pdf(0.5,0.5,0.5)');
		equals(jStat.cauchy.cdf(0,1,1),0.25,'cauchy.cdf(0,1,1)');
		equals(jStat.cauchy.cdf(0.5,0.5,0.5),0.5,'cauchy.cdf(0.5,0.5,0.5)');
	});

	test('chisquare',function(){
		equals(jStat.chisquare.pdf(0.5,0.5),0.3037807865917943,'chisquare.pdf(0.5,0.5)');
		equals(jStat.chisquare.pdf(0.5,1),0.43939128823451334,'chisquare.pdf(0.5,1)');
		equals(jStat.chisquare.cdf(0.5,0.5),2.6962861099717164,'chisquare.cdf(0.5,0.5)');
		equals(jStat.chisquare.cdf(0.5,1),3.0690276591232104,'chisquare.cdf(0.5,1)');
	});

	test('exponential',function(){
		equals(jStat.exponential.pdf(0.5,0.5),0.38940039153570244,'exponential.pdf(0.5,0.5)');
		equals(jStat.exponential.pdf(0.5,1),0.6065306597126334,'exponential.pdf(0.5,1)');
		equals(jStat.exponential.cdf(0.5,0.5),0.22119921692859512,'exponential.cdf(0.5,0.5)');
		equals(jStat.exponential.cdf(0.5,1),0.3934693402873666,'exponential.cdf(0.5,1)');
	});

	test('gamma',function(){
		equals(jStat.gamma.pdf(0.5,0.5,0.5),0.41510749625554133,'gamma.pdf(0.5,0.5,0.5)');
		equals(jStat.gamma.pdf(0.5,1,1),0.6065306597126334,'gamma.pdf(0.5,1,1)');
		equals(jStat.gamma.cdf(0.5,0.5,0.5),0.3934693402873665,'gamma.cdf(0.5,0.5,0.5)');
		equals(jStat.gamma.cdf(0.5,1,1),1.493648269786591,'gamma.cdf(0.5,1,1)');
	});

	test('kumaraswamy',function(){
		equals(jStat.kumaraswamy.pdf(0.5,0.5,0.5),0.6532814824381883,'kumaraswamy.pdf(0.5,0.5,0.5)');
		equals(jStat.kumaraswamy.pdf(0.5,1,1),1,'kumaraswamy.pdf(0.5,1,1)');
		equals(jStat.kumaraswamy.cdf(0.5,0.5,0.5),0.4588038998538031,'kumaraswamy.cdf(0.5,0.5,0.5)');
		equals(jStat.kumaraswamy.cdf(0.5,1,1),0.5,'kumaraswamy.cdf(0.5,1,1)');
	});

	test('lognormal',function(){
		equals(jStat.lognormal.pdf(0.5,0.5,0.5),0.09256496459388698,'lognormal.pdf(0.5,0.5,0.5)');
		equals(jStat.lognormal.pdf(0.5,1,1),0.19029780481010555,'lognormal.pdf(0.5,1,1)');
		equals(jStat.lognormal.cdf(0.5,0.5,0.5),0.008509561256088927,'lognormal.cdf(0.5,0.5,0.5)');
		equals(jStat.lognormal.cdf(0.5,1,1),0.045213727790224145,'lognormal.cdf(0.5,1,1)');
	});

	test('normal',function(){
		equals(jStat.normal.pdf(0.5,0.5,0.5),0.7978845608028654,'normal.pdf(0.5,0.5,0.5)');
		equals(jStat.normal.pdf(0.5,1,1),0.3520653267642995,'normal.pdf(0.5,1,1)');
		equals(jStat.normal.cdf(0.5,0.5,0.5),0.5,'normal.cdf(0.5,0.5,0.5)');
		equals(jStat.normal.cdf(0.5,1,1),0.3085375387259869,'normal.cdf(0.5,1,1)');
	});

	test('pareto',function(){
		equals(jStat.pareto.pdf(0.5,0.4,0.5),0.8944271909999159,'pareto.pdf(0.5,0.4,0.5)');
		equals(jStat.pareto.pdf(1,1,1),undefined,'pareto.pdf(1,1,1)');
		equals(jStat.pareto.cdf(0.5,0.4,0.5),0.10557280900008414,'pareto.cdf(0.5,0.4,0.5)');
		equals(jStat.pareto.cdf(1,1,1),0,'pareto.cdf(1,1,1)');
	});

	test('studentt',function(){
		equals(jStat.studentt.pdf(0.5,0.5),0.19896393257609168,'studentt.pdf(0.5,0.5)');
		equals(jStat.studentt.pdf(1,1),0.15915494264520624,'studentt.pdf(1,1)');
		equals(jStat.studentt.cdf(0.5,0.5),0.6213409636390478,'studentt.cdf(0.5,0.5)');
		equals(jStat.studentt.cdf(1,1).toFixed(5),'0.75000','studentt.cdf(1,1)');
	});

	test('weibull',function(){
		equals(jStat.weibull.pdf(1,1,1),0.36787944117144233,'weibull.pdf(1,1,1)');
		equals(jStat.weibull.pdf(2,1,2),0.07326255555493671,'weibull.pdf(2,1,2)');
		equals(jStat.weibull.cdf(1,1,1),0.6321205588285577,'weibull.cdf(1,1,1)');
		equals(jStat.weibull.cdf(2,1,2),0.9816843611112658,'weibull.cdf(2,1,2)');
	});

	test('uniform',function(){
		equals(jStat.uniform.pdf(1,0,2),0.5,'uniform.pdf(1,0,2)');
		equals(jStat.uniform.pdf(1,0,1),1,'uniform.pdf(1,0,1)');
		equals(jStat.uniform.cdf(0.5,0,2),0.25,'uniform.cdf(0.5,0,2)');
		equals(jStat.uniform.cdf(1,0,2),0.5,'uniform.cdf(1,0,2)');
	});

	test('binomial',function(){
		equals(jStat.binomial.pdf(2,5,0.5),0.3125,'binomial.pdf(2,5,0.5)');
		equals(jStat.binomial.pdf(1,4,0.5),0.25,'binomial.pdf(1,4,0.5)');
		equals(jStat.binomial.cdf(2,5,0.5),0.5,'binomial.cdf(2,5,0.5)');
		equals(jStat.binomial.cdf(1,4,0.5),0.3125,'binomial.cdf(1,4,0.5)');
	});

	test('negbin',function(){
		equals(jStat.negbin.pdf(1,2,2),4,'negbin.pdf(1,2,2)');
		equals(jStat.negbin.pdf(1,2,3),24,'negbin.pdf(1,2,3)');
		equals(jStat.negbin.cdf(1,2,2),5,'negbin.cdf(1,2,2)');
		equals(jStat.negbin.cdf(1,2,3),28,'negbin.cdf(1,2,3)');
	});

	test('hypgeom',function(){
		equals(jStat.hypgeom.pdf(1,6,2,4),8/15,'hypgeom.pdf(1,6,2,4)');
		equals(jStat.hypgeom.pdf(1,7,3,5),1/7,'hypgeom.pdf(1,7,3,5)');
		equals(jStat.hypgeom.cdf(1,6,2,4),0.6,'hypgeom.cdf(1,6,4,2)');
		equals(jStat.hypgeom.cdf(1,8,3,5),0.2857142857142857,'hypgeom.cdf(1,8,3,5)');
	});

	test('poisson',function(){
		equals(jStat.poisson.pdf(1,3),0.14936120510359183,'poisson.pdf(1,3)');
		equals(jStat.poisson.pdf(1,5),0.03368973499542734,'poisson.pdf(1,5)');
		equals(jStat.poisson.cdf(1,3),0.19914827347145578,'poisson.cdf(1,3)');
		equals(jStat.poisson.cdf(1,5),0.040427681994512805,'poisson.cdf(1,5)');
	});

});
