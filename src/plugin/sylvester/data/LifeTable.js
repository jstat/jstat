// Copyright 2011 Florian Pons (florian.pons.tv). All Rights Reserved.
//
// Licensed under the MIT License

/**
 * @fileoverview Class for representing a life table.
 *
 *
 */
 
define(["plugin/sylvester/sylv"],function(sylv) { 
	/**
	 * Creates LifeTable
	 */
	sylv.LifeTable = function() {
		this.L = [1];
	};

	sylv.extend(sylv.LifeTable, {
		setP: function(P) {
			this.P = P;
			this.L = [this.L[0]];
			this.Q = [];
			for (var i = 0; i < P.length; i++) {
			  this.L.push(this.L[i]*P[i]);
			  this.Q.push(1-P[i]);
			};
		},

		setQ: function(Q) {
			this.Q = Q;
			this.L = [this.L[0]];
			this.P = [];
			for (var i = 0; i < Q.length; i++) {
			  this.P.push(1-Q[i]);
				this.L.push(this.L[i]*this.P[i]);
			};
		},

		setL: function(L) {
			this.L = L;
			this.P = [];
			this.Q = [];
			for (var i = 1; i < L.length; i++) {
			  this.P.push(this.L[i]/this.L[i-1]);
			  this.Q.push(1-this.P[i-1]);
			};
		},

		setL0: function(L0) {
			this.L = [L0];
			for (var i = 0; i < this.P.length; i++) {
			  this.L.push(this.L[i]*P[i]);
			};
		},
	});
	
	return sylv.LifeTable;
});
