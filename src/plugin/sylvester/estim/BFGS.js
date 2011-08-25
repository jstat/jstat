// Copyright 2011 Florian Pons (florian.pons.tv). All Rights Reserved.
//
// Licensed under the MIT License

/**
 * @fileoverview Classe d'implementation de la méthode Broyden-Fletcher-Goldfarb-Shanno.
 *
 *
 */

/**
 * Class to generate Gaussian random number
 *
 * @param {fonction} fonction à étudier
 * @param {fonction} gradient de la fonction (sous forme de matrice colonne)
 * @param {array[integer]} point de depart
 * @constructor
 */
function BFGS(F, Delta, x0) {
  this.f = F;
	this.D = Delta;
	this.x0 = x0;
	this.mu = 0.9;
	this.nu = 0.001;
	this.s = jStat.zeros(x0.rows(), x0.cols())
};

// calculate the next step
BFGS.prototype.nextStep = function() {
	// define the ref (this) for lambda function
	var that = this;
	// calcule des valeurs au point courrant
	this.fx = this.f(this.x0);
	var df = this.D(this.x0);
	var S = this.s;
	var X = this.x0.add(S);
	// initialisation ou calcul du prochain B
	if (this.B == undefined) {
		this.B = jStat.identity(df.cols());
	} else {
		var Y = this.D(X).subtract(df);
		var sy = S.transpose().x(Y);
		this.B = this.B.add(S.x((sy+Y.transpose().x(this.B).x(S))/(sy*sy)).x(S.transpose())).subtract(this.B.x(S).x(Y.transpose()).add(S.x(Y.transpose().x(this.B))).x(sy));
		this.x0 = X;
	};
	var p = this.B.x(df.x(-1).transpose()).transpose();
	var gs = new GoldenSection(0, 5, function(a) {return that.f(that.x0.add(p.x(a)))});
	var d = df.x(p.transpose())[0][0];
	// we use the Wolfe conditions
	while (gs.nextStep() < this.fx+this.nu*gs.a*d  && this.D(this.x0.add(p.x(gs.a))).x(p) > this.fx+this.mu*d);
	this.s = p.x(gs.a);
	return gs.fa;
};

// do the algo with a standard stop condition
BFGS.prototype.standardCalcul = function() {
	var fx;
	while((Math.abs((fx=this.nextStep())-this.fx)/Math.max(fx, this.fx, 1))<1e-15);
};