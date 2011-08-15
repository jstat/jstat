// Copyright 2011 Florian Pons (florian.pons.tv). All Rights Reserved.
//
// Licensed under the MIT License

/**
 * @fileoverview Classe d'évaluation de coefficients de la formule de Makeham.
 *
 *
 */

/**
 * Fonction d'évaluation de coefficients de la formule de Makeham.
 *
 * @param {integer} date de demarrage de P
 * @param {LifeTable} Taux annuel de vitalité au dates x, x+1, x+2 ...
 * @constructor
 */
function MakehamEstim(x, L) {
	var P = L.P;
	var n = Math.floor(P.length/3);
	var A = [0,0,0];
  for (var i = 0; i<3; i++) {
		for (var j = 0; j<n; j++) {
			A[i] += Math.log(P[i*n+j]);
		}
	};
	this.c = Math.exp(Math.log((A[1]-A[2])/(A[0]-A[1]))/n);
	var cn_1 = Math.pow(this.c,n)-1;
	var V = (A[1]-A[0])/cn_1;
	this.g = Math.exp(V/(Math.pow(this.c,x)*cn_1));
	this.s = Math.exp((A[0]-V)/n)
	this.ec = 0;
	this.eg = 0;
	this.es = 0;
	this.A = [];
	this.SA = 0;
	this.lP = [];
	this.SAlP = 0;
	this.SAlP2 = 0;
	for (var i = 0; i<P.length; i++) {
		var a = L.L[i]*L.P[i]/L.Q[i];
		var lp = Math.log(L.P[i]);
		this.A.push(a);
		this.lP.push(lp);
		this.SA += a;
		this.SAlP += a*lp;
		this.SAlP2 += a*lp*lp;
	};
	this.getCompCLast = {};
};

// Calculate f components with c values
MakehamEstim.prototype.getCompC = function(c) {
	if (this.getCompCLast.c != c) {
		this.getCompCLast.AxCx = 0;
		this.getCompCLast.AxlPCx = 0;
		this.getCompCLast.AxC2x = 0;
		for (var i = this.A.length-1; i>-1; i--) {
			this.getCompCLast.AxCx += this.getCompCLast.AxCx*cx+this.A[i];
			this.getCompCLast.AxlPCx += this.getCompCLast.AxlPCx*cx+this.A[i]*this.lP[i];
			this.getCompCLast.AxC2x += this.getCompCLast.AxC2x*cx*cx+this.A[i];
		};
	};
	return this.getCompCLast
};

// return the f function
MakehamEstim.prototype.getF = function() {
	var that = this;
	return function(V) {
		that.getCompC(V[0]);
		var lg = Math.log(V[1]);
		var ls = Math.log(V[2]);
		var c_1lg = (V[0]-1)*lg;
		return that.SAlP2+(that.SA*ls-2*that.SAlP)*ls+(that.getCompCLast.AxC2x*c_1lg-2*(that.getCompCLast.AxlPCx+ls*that.getCompCLast.AxCx))*c_1lg;
	};
};

// return the gradient of f function
MakehamEstim.prototype.getDF = function() {
	var that = this;
	return function(V) {
		var res = [];
		that.getCompC(V[0]);
		var lg = Math.log(V[1]);
		var ls = Math.log(V[2]);
		var c_1lg = (V[0]-1)*lg;
		var cx = 1;
		res[0] = 0;
		for (var i = 0; i<that.A.length; i++) {
			res[0] += that.A[i]*(ls-that.lP[i]+c_1lg*cx)(V[0]*(i+1)-i)*cx;
			cx *= V[0];
		};
		res[0] *= l*lg/V[0];
		res[1] = (that.getCompCLast.AxC2x*c_1lg-that.getCompCLast.AxlPCx+ls*that.getCompCLast.AxCx)*2*(V[0]-1)/V[1];
		res[2] = (that.SA*ls-that.SAlP+c_1lg*that.getCompCLast.AxCx)*2/V[2];
		return j$(res);
	};
};

// Returns a process representation of the serie
MakehamEstim.prototype.improveValues = function() {
	bfgs = new BFGS(this.getF(),this.getDF(),j$([[this.c], [this.g], [this.s]]));
	bfgs.standardCalcul();
	this.ec = bfgs.s[0];
	this.eg = bfgs.s[1];
	this.es = bfgs.s[2];
};

// Returns a process representation of the serie
MakehamEstim.prototype.getProcess = function() {
	return new Makeham(this.c+this.ec, this.g+this.eg, this.s+this.es);
};