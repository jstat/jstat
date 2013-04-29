(function(jStat, Math) {

// generate all distribution instance methods
(function(list) {
	for (var i = 0; i < list.length; i++) (function(func) {
		// distribution instance method
		jStat[ func ] = function(a, b, c) {
			if (!(this instanceof arguments.callee)) return new arguments.callee(a, b, c);
			this._a = a;
			this._b = b;
			this._c = c;
			return this;
		};
		// distribution method to be used on a jStat instance
		jStat.fn[ func ] = function(a, b, c) {
			var newthis = jStat[ func ](a, b, c);
			newthis.data = this;
			return newthis;
		};
		// sample instance method
		jStat[ func ].prototype.sample = function(arr) {
			var a = this._a,
				b = this._b,
				c = this._c;
			if (arr)
				return jStat.alter(arr, function() {
					return jStat[ func ].sample(a, b, c);
				});
			else
				return jStat[ func ].sample(a, b, c);
		};
		// generate the pdf, cdf and inv instance methods
		(function(vals) {
			for (var i = 0; i < vals.length; i++) (function(fnfunc) {
				jStat[ func ].prototype[ fnfunc ] = function(x) {
					var a = this._a,
						b = this._b,
						c = this._c;
					if (!x) x = this.data;
					if (typeof x !== 'number') {
						return jStat.fn.map.call(x, function(x) {
							return jStat[ func ][ fnfunc ](x, a, b, c);
						});
					}
					return jStat[ func ][ fnfunc ](x, a, b, c);
				};
			})(vals[ i ]);
		})('pdf cdf inv'.split(' '));
		// generate the mean, median, mode and variance instance methods
		(function(vals) {
			for (var i = 0; i < vals.length; i++) (function(fnfunc) {
				jStat[ func ].prototype[ fnfunc ] = function() {
					return jStat[ func ][ fnfunc ](this._a, this._b, this._c);
				};
			})(vals[ i ]);
		})('mean median mode variance'.split(' '));
	})(list[ i ]);
})((
	'beta centralF cauchy chisquare exponential gamma invgamma kumaraswamy lognormal normal ' +
	'pareto studentt weibull uniform  binomial negbin hypgeom poisson triangular'
).split(' '));



// extend beta function with static methods
jStat.extend(jStat.beta, {
	pdf : function(x, alpha, beta) {
		return (x > 1 || x < 0) ? 0 : (Math.pow(x, alpha - 1) * Math.pow(1 - x, beta - 1)) / jStat.betafn(alpha, beta);
	},

	cdf : function(x, alpha, beta) {
		return (x > 1 || x < 0) ? (x > 1) * 1 : jStat.ibeta(x, alpha, beta);
	},

	inv : function(x, alpha, beta) {
		return jStat.ibetainv(x, alpha, beta);
	},

	mean : function(alpha, beta) {
		return alpha / (alpha + beta);
	},

	median : function(alpha, beta) {
		// TODO: implement beta median
	},

	mode : function(alpha, beta) {
		return (alpha * beta) / (Math.pow(alpha + beta, 2) * (alpha + beta + 1));
	},

	// return a random sample
	sample : function(alpha, beta) {
		var u = jStat.randg(alpha);
		return u / (u + jStat.randg(beta));
	},

	variance : function(alpha, beta) {
		return (alpha * beta) / (Math.pow(alpha + beta, 2) * (alpha + beta + 1));
	}
});

// extend F function with static methods
jStat.extend(jStat.centralF, {
	pdf : function(x, df1, df2) {
		return  (x >= 0) ?  
			Math.sqrt((Math.pow(df1 * x, df1) * Math.pow(df2, df2)) / (Math.pow(df1 * x + df2, df1 + df2))) / (x * jStat.betafn(df1/2, df2/2)) : undefined;
		
	},

	cdf : function(x, df1, df2) {
		return jStat.ibeta((df1 * x) / (df1 * x + df2), df1 / 2, df2 / 2);
	},

	inv : function(x, df1, df2) {
		return df2 / (df1 * (1 / jStat.ibetainv(x, df1 / 2, df2 / 2) - 1));
	},

	mean : function(df1, df2) {
		return (df2 > 2) ? df2 / (df2 - 2) : undefined;
	},

	mode : function(df1, df2) {
		return (df1 > 2) ? (df2 * (df1 - 2)) / (df1 * (df2 + 2)) : undefined;
	},

	// return a random sample
	sample : function(df1, df2) {
		var x1 = jStat.randg(df1 / 2) * 2;
		var x2 = jStat.randg(df2 / 2) * 2;
		return (x1 / df1) / (x2 / df2);
	},

	variance : function(df1, df2) {
		return (df2 > 4) ? 2 * df2 * df2 * (df1 + df2 - 2) / (df1 * (df2 - 2) * (df2 - 2) * (df2 - 4)): undefined;
	}
});


// extend cauchy function with static methods
jStat.extend(jStat.cauchy, {
	pdf : function(x, local, scale) {
		return (scale / (Math.pow(x - local, 2) + Math.pow(scale, 2))) / Math.PI;
	},

	cdf : function(x, local, scale) {
		return Math.atan((x - local) / scale) / Math.PI + 0.5;
	},

	inv : function(p, local, scale) {
		return local + scale * Math.tan(Math.PI * (p - 0.5));
	},

	median: function(local, scale) {
		return local;
	},

	mode : function(local, scale) {
		return local;
	},

	sample : function(local, scale) {
		return jStat.randn() * Math.sqrt(1 / (2 * jStat.randg(0.5))) * scale + local;
	}
});



// extend chisquare function with static methods
jStat.extend(jStat.chisquare, {
	pdf : function(x, dof) {
		return Math.exp((dof / 2 - 1) * Math.log(x) - x / 2 - (dof / 2) * Math.log(2) - jStat.gammaln(dof / 2));
	},

	cdf : function(x, dof) {
		return jStat.gammap(dof / 2, x / 2);
	},

	inv : function(p, dof) {
		return 2 * jStat.gammapinv(p, 0.5 * dof);
	},

	mean : function(dof) {
		return dof;
	},

	//TODO: this is an approximation (is there a better way?)
	median : function(dof) {
		return dof * Math.pow(1 - (2 / (9 * dof)), 3);
	},

	mode : function(dof) {
		return (dof - 2 > 0) ? dof - 2 : 0;
	},

	sample : function(dof) {
		return jStat.randg(dof / 2) * 2;
	},

	variance: function(dof) {
		return 2 * dof;
	}
});



// extend exponential function with static methods
jStat.extend(jStat.exponential, {
	pdf : function(x, rate) {
		return x < 0 ? 0 : rate * Math.exp(-rate * x);
	},

	cdf : function(x, rate) {
		return x < 0 ? 0 : 1 - Math.exp(-rate * x);
	},

	inv : function(p, rate) {
		return -Math.log(1 - p) / rate;
	},

	mean : function(rate) {
		return 1 / rate;
	},

	median : function (rate) {
		return (1 / rate) * Math.log(2);
	},

	mode : function(rate) {
		return 0;
	},

	sample : function(rate) {
		return -1 / rate * Math.log(Math.random());
	},

	variance : function(rate) {
		return Math.pow(rate, -2);
	}
});



// extend gamma function with static methods
jStat.extend(jStat.gamma, {
	pdf : function(x, shape, scale) {
		return Math.exp((shape - 1) * Math.log(x) - x / scale - jStat.gammaln(shape) - shape * Math.log(scale));
	},

	cdf : function(x, shape, scale) {
		return jStat.gammap(shape, x / scale);
	},

	inv : function(p, shape, scale) {
		return jStat.gammapinv(p, shape) * scale;
	},

	mean : function(shape, scale) {
		return shape * scale;
	},

	mode : function(shape, scale) {
		if(shape > 1) return (shape - 1) * scale;
		return undefined;
	},

	sample : function(shape, scale) {
		return jStat.randg(shape) * scale;
	},

	variance: function(shape, scale) {
		return shape * scale * scale;
	}
});

// extend inverse gamma function with static methods
jStat.extend(jStat.invgamma, {
	pdf : function(x, shape, scale) {
		return Math.exp(-(shape + 1) * Math.log(x) - scale/x - jStat.gammaln(shape) + shape * Math.log(scale));
	},

	cdf : function(x, shape, scale) {
		return 1 - jStat.gammap(shape, scale / x);
	},

	inv : function(p, shape, scale) {
		return scale / jStat.gammapinv(1 - p, shape);
	},

	mean : function(shape, scale) {
		return (shape > 1) ? scale / (shape - 1) : undefined;
	},

	mode : function(shape, scale) {
		return scale / (shape + 1);
	},

	sample : function(shape, scale) {
		return scale / jStat.randg(shape);
	},

	variance: function(shape, scale) {
		return (shape > 2) ? scale * scale / ((shape - 1) * (shape - 1) * (shape - 2)): undefined;
	}
});


// extend kumaraswamy function with static methods
jStat.extend(jStat.kumaraswamy, {
	pdf : function(x, alpha, beta) {
		return Math.exp(Math.log(alpha) + Math.log(beta) + (alpha - 1) * Math.log(x) + (beta - 1) * Math.log(1 - Math.pow(x, alpha)));
	},

	cdf : function(x, alpha, beta) {
		return (1 - Math.pow(1 - Math.pow(x, alpha), beta));
	},

	mean : function(alpha, beta) {
		return (beta * jStat.gammafn(1 + 1 / alpha) * jStat.gammafn(beta)) / (jStat.gammafn(1 + 1 / alpha + beta));
	},

	median : function(alpha, beta) {
		return Math.pow(1 - Math.pow(2, -1 / beta), 1 / alpha);
	},

	mode : function(alpha, beta) {
		return (alpha >= 1 && beta >= 1 && (alpha !== 1 && beta !== 1)) ? Math.pow((alpha - 1) / (alpha * beta - 1), 1 / alpha) : undefined;
	},

	variance: function(alpha, beta) {
		// TODO: complete this
	}
});



// extend lognormal function with static methods
jStat.extend(jStat.lognormal, {
	pdf : function(x, mu, sigma) {
		return Math.exp(-Math.log(x) - 0.5 * Math.log(2 * Math.PI) - Math.log(sigma) - Math.pow(Math.log(x) - mu, 2) / (2 * sigma * sigma));
	},

	cdf : function(x, mu, sigma) {
		return 0.5 + (0.5 * jStat.erf((Math.log(x) - mu) / Math.sqrt(2 * sigma * sigma)));
	},

	inv : function(p, mu, sigma) {
		return Math.exp(-1.41421356237309505 * sigma * jStat.erfcinv(2 * p) + mu);
	},

	mean : function(mu, sigma) {
		return Math.exp(mu + sigma * sigma / 2);
	},

	median : function(mu, sigma) {
		return Math.exp(mu);
	},

	mode : function(mu, sigma) {
		return Math.exp(mu - sigma * sigma);
	},

	sample : function(mu, sigma) {
		return Math.exp(jStat.randn() * sigma + mu);
	},

	variance : function(mu, sigma) {
		return (Math.exp(sigma * sigma) - 1) * Math.exp(2 * mu + sigma * sigma);
	}
});



// extend normal function with static methods
jStat.extend(jStat.normal, {
	pdf : function(x, mean, std) {
		return Math.exp(-0.5 * Math.log(2 * Math.PI) - Math.log(std) - Math.pow(x - mean, 2) / (2 * std * std));
	},

	cdf : function(x, mean, std) {
		return 0.5 * (1 + jStat.erf((x - mean) / Math.sqrt(2 * std * std)));
	},

	inv : function(p, mean, std) {
		return -1.41421356237309505 * std * jStat.erfcinv(2 * p) + mean;
	},

	mean : function(mean, std) {
		return mean;
	},

	median : function(mean, std) {
		return mean;
	},

	mode : function (mean, std) {
		return mean;
	},

	sample : function(mean, std) {
		return jStat.randn() * std + mean;
	},

	variance : function(mean, std) {
		return std * std;
	}
});



// extend pareto function with static methods
jStat.extend(jStat.pareto, {
	pdf : function(x, scale, shape) {
		return (x > scale) ? (shape * Math.pow(scale, shape)) / Math.pow(x, shape + 1) : undefined;
	},

	cdf : function(x, scale, shape) {
		return 1 - Math.pow(scale / x, shape);
	},

	mean : function(scale, shape) {
		return (shape > 1) ? (shape * Math.pow(scale, shape)) / (shape - 1) : undefined;
	},

	median : function(scale, shape) {
		return scale * (shape * Math.SQRT2);
	},

	mode : function(scale, shape) {
		return scale;
	},

	variance : function(scale, shape) {
		return (shape > 2) ? (scale*scale * shape) / (Math.pow(shape - 1, 2) * (shape - 2)) : undefined;
	}
});



// extend studentt function with static methods
jStat.extend(jStat.studentt, {
	pdf : function(x, dof) {
		return (jStat.gammafn((dof + 1) / 2) / (Math.sqrt(dof * Math.PI) * jStat.gammafn(dof / 2))) * Math.pow(1 + ((x*x) / dof), -((dof + 1) / 2));
	},

	cdf : function(x, dof) {
		var dof2 = dof / 2;
		return jStat.ibeta((x + Math.sqrt(x * x + dof)) / (2 * Math.sqrt(x * x + dof)), dof2, dof2);
	},

	inv : function(p, dof) {
		var x = jStat.ibetainv(2 * Math.min(p, 1 - p), 0.5 * dof, 0.5);
		x = Math.sqrt(dof * (1 - x) / x);
		return (p > 0) ? x : -x;
	},

	mean : function(dof) {
		return (dof > 1) ? 0 : undefined;
	},

	median : function (dof) {
		return 0;
	},

	mode : function(dof) {
		return 0;
	},

	sample : function(dof) {
		return jStat.randn() * Math.sqrt(dof / (2 * jStat.randg(dof / 2)));
	},

	variance : function(dof) {
		return (dof  > 2) ? dof / (dof - 2) : (dof > 1) ? Infinity : undefined;
	}
});



// extend weibull function with static methods
jStat.extend(jStat.weibull, {
	pdf : function(x, scale, shape) {
		return x < 0 ? 0 : (shape / scale) * Math.pow((x / scale),(shape - 1)) * Math.exp(-(Math.pow((x / scale), shape)));
	},

	cdf : function(x, scale, shape) {
		return x < 0 ? 0 : 1 - Math.exp(-Math.pow((x / scale), shape));
	},

	inv : function(p, scale, shape) {
		return scale * Math.pow(-Math.log(1 - p), 1 / shape);
	},

	mean : function(scale, shape) {
		return scale * jStat.gammafn(1 + 1 / shape);
	},

	median : function(scale, shape) {
		return scale * Math.pow(Math.log(2), 1 / shape);
	},

	mode : function(scale, shape) {
		return (shape > 1) ? scale * Math.pow((shape - 1) / shape, 1 / shape) : undefined;
	},

	sample : function(scale, shape) {
		return scale * Math.pow(-Math.log(Math.random()), 1 / shape);
	},

	variance : function(scale, shape) {
		return scale * scale * jStat.gammafn(1 + 2 / shape) - Math.pow(this.mean(scale, shape), 2);
	}
});



// extend uniform function with static methods
jStat.extend(jStat.uniform, {
	pdf : function(x, a, b) {
		return (x < a || x > b) ? 0 : 1 / (b - a);
	},

	cdf : function(x, a, b) {
		if (x < a) {
			return 0;
		} else if (x < b) {
			return (x - a) / (b - a);
		}
		return 1;
	},

	mean : function(a, b) {
		return 0.5 * (a + b);
	},

	median : function(a, b) {
		return jStat.mean(a, b);
	},

	mode : function(a, b) {
		// TODO: complete this
	},

	sample : function(a, b) {
		return (a / 2 + b / 2) + (b / 2 - a / 2) * (2 * Math.random() - 1);
	},

	variance : function(a, b) {
		return Math.pow(b - a, 2) / 12;
	}
});



// extend uniform function with static methods
jStat.extend(jStat.binomial, {
	pdf : function(k, n, p) {
		return (p === 0 || p === 1) ?
			((n * p) === k ? 1 : 0) :
		jStat.combination(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k);
	},

	cdf : function(x, n, p) {
		var binomarr = [],
			k = 0;
		if (x < 0) {
			return 0;
		}
		if (x < n) {
			for (; k <= x; k++) {
				binomarr[ k ] = jStat.binomial.pdf(k, n, p);
			}
			return jStat.sum(binomarr);
		}
		return 1;
	}
});



// extend uniform function with static methods
jStat.extend(jStat.negbin, {
	pdf : function(k, r, p) {
		return k !== k | 0
			? false
		: k < 0
			? 0
		: jStat.combination(k + r - 1, k) * Math.pow(1 - p, r) * Math.pow(p, k);
	},

	cdf : function(x, r, p) {
		var sum = 0,
			k = 0;
		if (x < 0) return 0;
		for (; k <= x; k++) {
			sum += jStat.negbin.pdf(k, r, p);
		}
		return sum;
	}
});



// extend uniform function with static methods
jStat.extend(jStat.hypgeom, {
	pdf : function(k, N, m, n) {
		return k !== k | 0
			? false
		: (k < 0)
			? 0
		: jStat.combination(m, k) * jStat.combination(N - m , n - k) / jStat.combination(N, n);
	},

	cdf : function(x, N, m, n) {
		var sum = 0,
			k = 0;
		if (x < 0) return 0;
		for (; k <= x; k++) {
			sum += jStat.hypgeom.pdf(k, N, m, n);
		}
		return sum;
	}
});



// extend uniform function with static methods
jStat.extend(jStat.poisson, {
	pdf : function(k, l) {
		return Math.pow(l, k) * Math.exp(-l) / jStat.factorial(k);
	},

	cdf : function(x, l) {
		var sumarr = [],
			k = 0;
		if (x < 0) return 0;
		for (; k <= x; k++) {
			sumarr.push(jStat.poisson.pdf(k, l));
		}
		return jStat.sum(sumarr);
	},

	mean : function(l) {
		return l;
	},

	variance : function(l) {
		return l;
	},

	sample : function(l) {
		var p = 1, k = 0, L = Math.exp(-l);
		do {
			k++;
			p *= Math.random();
		} while (p > L);
		return k - 1;
	}
});

// extend triangular function with static methods
jStat.extend(jStat.triangular, {
	pdf : function(x, a, b, c) {
		return (b <= a || c < a || c > b)
			? undefined
		: (x < a || x > b)
			? 0
		: (x <= c)
			? (2 * (x - a)) / ((b - a) * (c - a))
		: (2 * (b - x)) / ((b - a) * (b - c));
	},

	cdf : function(x, a, b, c) {
		if (b <= a || c < a || c > b)
			return undefined;
		if (x < a) {
			return 0;
		} else {
			if (x <= c)
				return Math.pow(x - a, 2) / ((b - a) * (c - a));
			return 1 - Math.pow(b - x, 2) / ((b - a) * (b - c));
		}
		// never reach this
		return 1;
	},

	mean : function(a, b, c) {
		return (a + b + c) / 3;
	},

	median : function(a, b, c) {
		if (c <= (a + b) / 2) {
			return b - Math.sqrt((b - a) * (b - c)) / Math.sqrt(2);
		} else if (c > (a + b) / 2) {
			return a + Math.sqrt((b - a) * (c - a)) / Math.sqrt(2);
		}
	},

	mode : function(a, b, c) {
		return c;
	},

	sample : function(a, b, c) {
		var u = Math.random();
		return u < ((c - a) / (b - a)) ?
			a + Math.sqrt(u * (b - a) * (c - a)) : b - Math.sqrt((1 - u) * (b - a) * (b - c));
	},

	variance : function(a, b, c) {
		return (a * a + b * b + c * c - a * b - a * c - b * c) / 18;
	}
});

}(this.jStat, Math));
