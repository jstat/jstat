$(function() {
	module('main');

	test('sum',function(){
		equals(jstat.sum([1,2,3,4,5,6]),21,'sum([1,2,3,4,5,6])');
	});

	test('min',function(){
		equals(jstat.min([1,2,3,4,5,6]),1,'min([1,2,3,4,5,6])');
	});

	test('max',function(){
		equals(jstat.max([1,2,3,4,5,6]),6,'max([1,2,3,4,5,6])');
	});

	test('mean',function(){
		equals(jstat.mean([1,2,3,4,5,6]),3.5,'mean([1,2,3,4,5,6])');
	});

	test('median',function(){
		equals(jstat.median([1,2,3,3,4,5,6]),3,'median([1,2,3,3,4,5,6])');
		equals(jstat.median([1,2,3,4,5,6]),3.5,'median([1,2,3,4,5,6])');
	});

	test('mode',function(){
		equals(jstat.mode([1,2,3,3,4,5,6]),3,'mode([1,2,3,3,4,5,6])');
		equals(jstat.mode([1,1,2,3,3,4,5,6]),false,'mode([1,1,2,3,3,4,5,6])');
	});

	test('range',function(){
		equals(jstat.range([1,2,3,3,4,5,6]),5,'range([1,2,3,3,4,5,6])');
		equals(jstat.range([-3,-6,-4]),3,'range([-3,-6,-4])');
	});

	test('variance',function(){
		equals(jstat.variance([1,2,3,4,5,6]),3.5,'variance([1,2,3,4,5,6])');
	});

	test('stdev',function(){
		equals(jstat.stdev([3,4,5]),1,'stdev([3,4,5])');
		equals(jstat.stdev([-3,-4,-5]),1,'stdev([-3,-4,-5])');
	});

	test('meandev',function(){
		equals(jstat.meandev([2,2,3,4,14]),3.6,'meandev([2,2,3,4,14])');
	});

	test('meddev',function(){
		equals(jstat.meddev([2,2,3,4,14]),2.8,'meddev([2,2,3,4,14])');
	});

	test('factorial',function(){
		equals(jstat.factorial(5),120,'factorial(5)');
		equals(jstat.factorial(.5),0.8862269254527566,'factorial(.5)');
	});

	test('combination',function(){
		equals(jstat.combination(10,4),210,'combination(10,4)');
	});

	test('permutation',function(){
		equals(jstat.permutation(10,4),5040,'permutation(10,4)');
	});

	test('gamma',function(){
		equals(jstat.gammafn(.5),1.7724538509055165,'gamma(.5)');
		equals(jstat.gammafn(15),87178291200,'gamma(5)');
	});

	module('distribution');

	test('quartiles',function(){
		equals(jstat.quartiles([1,2,3,6,9,3,1,2,5]).toString(),'1,3,5','quartiles([1,2,3,6,9,3,1,2,5])');
	});

	test('covariance',function(){
		equals(jstat.covariance([1,2,3,6,9,3,1,2,5],[2,3,5,2,5,7,8,9,6]),-1.1234567901234565,'covariance([1,2,3,6,9,3,1,2,5],[2,3,5,2,5,7,8,9,6])');
	});

	test('corrcoeff',function(){
		equals(jstat.corrcoeff([1,2,3,6,9,3,1,2,5],[2,3,5,2,5,7,8,9,6]),-0.16693777514921238,'corrcoeff([1,2,3,6,9,3,1,2,5],[2,3,5,2,5,7,8,9,6])');
	});

	test('uniformcdf',function(){
		equals(jstat.uniformcdf(0.5, 0, 2),0.25,'uniformcdf(0, 2, 0.5)');
	});

	test('binomial',function(){
		equals(jstat.binomial(2, 5, 0.5),0.3125,'binomial(5, 1/2, 2)');
	});

	test('weibull',function(){
		equals(jstat.weibull(1,1,1),0.36787944117144233,'weibull(1,1,1)');
		equals(jstat.weibull(2,1,2),0.18393972058572117,'weibull(2,1,2)');
	});

	test('weibullcdf',function(){
		equals(jstat.weibullcdf(1,1,1),0.6321205588285577,'weibullcdf(1,1,1)');
		equals(jstat.weibullcdf(2,1,2),0.6321205588285577,'weibullcdf(2,1,2)');
	});

	module('vector');

	// two vector objects used in the tests
	var v1 = jstat.Vector(1,2,3,4,5,6,7,8,9);
	var v2 = jstat.Vector(9,8,7,6,5,4,3,2,1);


	test('Vector.e', function() {
		for(var i = 1; i <= 9; i++) {
			equals(v1.e(i),i,'v1.e(' + i + ')');
		}
	});

	test('Vector.add', function() {
		var v3 = v1.add(5.7);	// vector + scalar addition
		var v4 = v1.add(v2);	// vector + vector addition
		for(var i = 1; i <= 9; i++) {
			equals(v3.e(i),i+5.7,'v1.add(5.7)');
			equals(v4.e(i),v1.e(i) + v2.e(i), 'v1.add(v2)');
		}
	});

	test('Vector.divide', function() {
		var v3 = v1.divide(2.5);
		var v4 = v1.divide(v2);
		for(var i = 1; i <= 9; i++) {
			equals(v3.e(i),i/2.5,'v1.divide(2.5)');
			equals(v4.e(i),v1.e(i) / v2.e(i), 'v1.divide(v2)');
		}
	});

	test('Vector.multiply', function() {
		var v3 = v1.multiply(3.141);
		var v4 = v1.multiply(v2);
		for(var i = 1; i <= 9; i++) {
			equals(v3.e(i),i*3.141,'v1.multiply(3.141)');
			equals(v4.e(i),v1.e(i) * v2.e(i), 'v1.multiply(v2)');
		}
	});

	test('Vector.subtract', function() {
		var v3 = v1.subtract(3.141);
		var v4 = v1.subtract(v2);
		for(var i = 1; i <= 9; i++) {
			equals(v3.e(i),i-3.141,'v1.subtract(3.141)');
			equals(v4.e(i),v1.e(i) - v2.e(i), 'v1.subtract(v2)');
		}
	});

	test('Vector.pow', function() {
		var v3 = v1.pow(3.141);
		var v4 = v1.pow(v2);
		for(var i = 1; i <= 9; i++) {
			equals(v3.e(i),Math.pow(i,3.141),'v1.pow(3.141)');
			equals(v4.e(i), Math.pow(v1.e(i), v2.e(i)), 'v1.pow(v2)');
		}
	});

	test('Vector.abs', function() {
		var v3 = v1.subtract(5);
		v3 = v3.abs();
		for(var i = 1; i <= 9; i++) {
			equals(v3.e(i),Math.abs(v1.e(i) - 5),'v1.abs()');
		}
	});

	test('Vector.max', function() {
		equals(v1.max(), 9, 'v1.max()');
		equals(v2.max(), 9, 'v2.max()');
	});

	test('Vector.min', function() {
		equals(v1.min(), 1, 'v1.min()');
		equals(v2.min(), 1, 'v2.min()');
	});

	test('Vector.sum', function() {
		equals(v1.sum(), 45, 'v1.sum()');
		equals(v2.sum(), 45, 'v2.sum()');
	});

	test('Vector.length', function() {
		equals(v1.length(), 9, 'v1.length()');
		equals(v2.length(), 9, 'v2.length()');
	});

	test('Vector.size', function() {
		equals(v1.size(), 9, 'v1.size()');
		equals(v2.size(), 9, 'v2.size()');
	});

	test('Vector.dot', function() {
		var v1dotv2 = v1.dot(v2);
		var v2dotv1 = v2.dot(v1);
		equals(v1dotv2, 165, 'v1.dot(v2)');
		equals(v2dotv1, 165, 'v2.dot(v1)');
	});

	test('Vector.clear', function() {
		var v3 = jstat.Vector(1,2,3,4,5,6,7,8,9);	// create a clone of v1
		v3.clear();
		for(var i = 1; i <= 9; i++) {
			equals(v3.e(i),0,'v1.clear()');
		}
	});

	test('Vector.norm', function() {
		var v1norm = v1.norm();
		var v2norm = v2.norm();

		equals(v1norm, Math.sqrt(v1.dot(v1)), 'v1.norm()');
		equals(v2norm, Math.sqrt(v2.dot(v2)), 'v2.norm()');
	});

	test('Vector.angle', function() {
		var v1angv2 = v1.angle(v2);
		var v2angv1 = v2.angle(v1);

		equals(v1angv2.toFixed(10), 0.9533592232, 'v1.angle(v2)');	// testing to 10 d.p.
		equals(v2angv1.toFixed(10), 0.9533592232, 'v2.angle(v1)');	// testing to 10 d.p.
	});

	test('Vector.sort', function() {
		var v3 = v2.sort();
		for(var i = 1; i <= 9; i++) {
			equals(v1.e(i), v3.e(i),'v1.e('+i+') == v3.e('+i+')');
		}
		var v4 = v2.sort('desc');
		for(var i = 1; i <= 9; i++) {
			equals(v2.e(i), v4.e(i),'v2.e('+i+') == v4.e(' + i + ')');
		}
	});

	test('Vector.right', function() {
		var v3 = v1.right(4);
		for(var i = 1; i <= 4; i++) {
			equals(v1.e(i+5), v3.e(i),'v1.e('+i+' + 5) == v3.e('+i+')');
		}
	});

	test('Vector.left', function() {
		var v3 = v1.left(4);
		for(var i = 1; i <= 4; i++) {
			equals(v1.e(i), v3.e(i),'v1.e('+i+') == v3.e('+i+')');
		}
	});

	test('Vector.mid', function() {
		var v3 = v1.mid(3, 3);
		for(var i = 1; i <= 3; i++) {
			equals(v1.e(i+2), v3.e(i),'v1.e('+i+' + 2) == v3.e('+i+')');
		}
	});

	test('Vector.transpose', function() {
		var m = v1.transpose();	// should return a single row matrix
		var row = m.row(1);
		for(var i = 1; i <= 9; i++) {
			equals(row.e(i), v1.e(i), 'row.e(' + i + ')');
		}
	});

	test('Vector.fill', function() {
		var v3 = jstat.Vector.fill(5.6, 5);
		for(var i = 1; i <= 5; i++) {
			equals(v3.e(i), 5.6, 'v3.e(' + i + ')');
		}
	});

	test('Vector.zeros', function() {
		var v3 = jstat.Vector.zeros(5);
		for(var i = 1; i <= 5; i++) {
			equals(v3.e(i), 0, 'v3.e(' + i + ')');
		}
	});
	
	test('Vector.fill', function() {
		var v3 = jstat.Vector.ones(5);
		for(var i = 1; i <= 5; i++) {
			equals(v3.e(i), 1, 'v3.e(' + i + ')');
		}
	});
});
