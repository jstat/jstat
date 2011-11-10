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

	test('uniformcdf',function(){
		equals(jStat.uniform.cdf(0.5, 0, 2),0.25,'uniform.cdf(0, 2, 0.5)');
	});

	test('binomial',function(){
		equals(jStat.binomial.pdf(2, 5, 0.5),0.3125,'binomial.pdf(5, 1/2, 2)');
	});

	test('weibull',function(){
		equals(jStat.weibull.pdf(1,1,1),0.36787944117144233,'weibull(1,1,1)');
		equals(jStat.weibull.pdf(2,1,2),0.18393972058572117,'weibull(2,1,2)');
	});

	test('weibullcdf',function(){
		equals(jStat.weibull.cdf(1,1,1),0.6321205588285577,'weibull.cdf(1,1,1)');
		equals(jStat.weibull.cdf(2,1,2),0.6321205588285577,'weibull.cdf(2,1,2)');
	});

});
