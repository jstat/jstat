// Copyright 2011 Florian Pons (florian.pons.tv). All Rights Reserved.
//
// Licensed under the MIT License

/**
 * @fileoverview Classe d'évaluation de coefficients de la formule de Makeham.
 *
 *
 */

define(["plugin/sylvester/sylv", "plugin/sylvester/estim/BFGS", "plugin/sylvester/process/process"],function(sylv, BFGS) {
	/**
	 * Fonction d'évaluation de coefficients de la formule de Makeham.
	 *
	 * @param {integer} first date of L
	 * @param {LifeTable} Annual rate of vitality at dates x, x+1, x+2 ... or an array of l_x, l_x+n, l_x+2n, l_x+3n
	 * @param {integer} step between values
	 * @constructor
	 */
	sylv.MakehamEstim = function(x, L, n) {
		var B = [0,0,0];
		if (n == undefined) {
			var P = L.P;
			n = Math.floor(P.length/3);
			for (var i = 0; i<3; i++) {
				for (var j = 0; j<n; j++) {
					B[i] += Math.log(P[i*n+j]);
				}
			};
		} else {
			for (var i = 0; i<3; i++) {
				B[i] = Math.log(L[i+1])-Math.log(L[i]);
			};
		};
		this.c = Math.exp(Math.log((B[1]-B[2])/(B[0]-B[1]))/n);
		var cn_1 = Math.pow(this.c,n)-1;
		var V = (B[1]-B[0])/cn_1;
		this.g = Math.exp(V/(Math.pow(this.c,x)*cn_1));
		this.s = Math.exp((B[0]-V)/n);
		this.ec = 0;
		this.eg = 0;
		this.es = 0;
		if (L instanceof sylv.LifeTable) {
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
	};

	sylv.extend(sylv.MakehamEstim, {
		// Calculate f components with c values
		getCompC: function(c) {
			if (this.getCompCLast.c != c) {
				this.getCompCLast.c = c;
				this.getCompCLast.AxCx = 0;
				this.getCompCLast.AxlPCx = 0;
				this.getCompCLast.AxC2x = 0;
				for (var i = this.A.length-1; i>-1; i--) {
					this.getCompCLast.AxCx += this.getCompCLast.AxCx*c+this.A[i];
					this.getCompCLast.AxlPCx += this.getCompCLast.AxlPCx*c+this.A[i]*this.lP[i];
					this.getCompCLast.AxC2x += this.getCompCLast.AxC2x*c*c+this.A[i];
				};
			};
			return this.getCompCLast
		},

		// return the f function
		getF: function() {
			var that = this;
			return function(V) {
				if(isNaN(V[0])) V = V[0];
				that.getCompC(V[0]);
				var lg = Math.log(Math.abs(V[1]));
				var ls = Math.log(Math.abs(V[2]));
				var c_1lg = (V[0]-1)*lg;
				return that.SAlP2+(that.SA*ls-2*that.SAlP)*ls+(that.getCompCLast.AxC2x*c_1lg-2*(that.getCompCLast.AxlPCx+ls*that.getCompCLast.AxCx))*c_1lg;
			};
		},

		// return the gradient of f function
		getDF: function() {
			var that = this;
			return function(V) {
				if(isNaN(V[0])) V = V[0];
				var res = [];
				that.getCompC(V[0]);
				var lg = Math.log(V[1]);
				var ls = Math.log(V[2]);
				var c_1lg = (V[0]-1)*lg;
				var cx = 1;
				res[0] = 0;
				for (var i = 0; i<that.A.length; i++) {
					res[0] += that.A[i]*(ls-that.lP[i]+c_1lg*cx)*(V[0]*(i+1)-i)*cx;
					cx *= V[0];
				};
				res[0] *= lg/V[0];
				res[1] = (that.getCompCLast.AxC2x*c_1lg-that.getCompCLast.AxlPCx+ls*that.getCompCLast.AxCx)*2*(V[0]-1)/V[1];
				res[2] = (that.SA*ls-that.SAlP+c_1lg*that.getCompCLast.AxCx)*2/V[2];
				return j$(res);
			};
		},

		// Returns a process representation of the serie
		improveValues: function() {
			bfgs = new BFGS(this.getF(),this.getDF(),j$([this.c, this.g, this.s]));
			bfgs.standardCalcul();
			this.ec = bfgs.s[0][0];
			this.eg = bfgs.s[0][1];
			this.es = bfgs.s[0][2];
		},

		// Returns a process representation of the serie
		getProcess: function() {
			return new sylv.Makeham(this.c+this.ec, this.g+this.eg, this.s+this.es);
		}
	});
	return sylv.MakehamEstim;

});