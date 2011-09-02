(function( jStat, Math ) {

// add beta distribution object
jStat.beta = function( alpha, beta ) {
	if (!( this instanceof arguments.callee )) return new jStat.beta( alpha, beta );
	this.alpha = alpha;
	this.beta = beta;
	for ( var i in jStat.beta.prototype ) this[i] = this[i].bind( this );
};
jStat.fn.beta = function( alpha, beta ) {
	var newthis = jStat.beta( alpha, beta );
	newthis.data = this.toArray();
	return newthis;
}

// extend beta function with static methods
jStat.extend( jStat.beta, {
	pdf : function( x, alpha, beta ) {
		return ( Math.pow( x, alpha - 1 ) * Math.pow( 1 - x, beta - 1 )) / jStat.betafn( alpha, beta );
	},

	cdf : function( x, alpha, beta ) {
		return jStat.incompleteBeta( x, alpha, beta );
	},

	inv : function( x, alpha, beta ) {
		return jStat.incompleteBetaInv( x, alpha, beta );
	},

	mean : function( alpha, beta ) {
		return alpha / ( alpha + beta );
	},

	median : function( alpha, beta ) {
		// TODO: implement beta median
	},

	mode : function( alpha, beta ) {
		return ( alpha * beta ) / ( Math.pow( alpha + beta, 2 ) * ( alpha + beta + 1 ));
	},

	// return a random sample
	sample : function( alpha, beta ) {
		var u = jStat.randg( alpha );
		return u / ( u + jStat.randg( beta ));
	},

	variance : function( alpha, beta ) {
		return ( alpha * beta ) / ( Math.pow( alpha + beta, 2 ) * ( alpha + beta + 1 ) );
	}
});

// extend the beta distribution prototype
jStat.beta.prototype.sample = function( arr ) {
	if ( arr ) {
		return jStat.alter( arr, function() {
			return jStat.beta.sample( this.alpha, this.beta );
		});
	} else {
		return jStat.beta.sample( this.alpha, this.beta );
	}
};
(function( vals ) {
	for ( var item in vals ) (function( item ) {
		jStat.beta.prototype[ item ] = function( x ) {
			var alpha = this.alpha,
				beta = this.beta;
			if ( isNaN( x )) {
				return jStat( this.data ).map( function( x ) {
					return jStat.beta[item]( x, alpha, beta );
				});
			}
			return jStat.beta[ item ]( x, alpha, beta );
		};
	})( vals[ item ]);
})( 'pdf cdf inv'.split( ' ' ));
(function( vals ) {
	for ( var item in vals ) (function( item ) {
		jStat.beta.prototype[ item ] = function() {
			return jStat.beta[ item ]( this.alpha, this.beta );
		};
	})( vals[ item ]);
})( 'mean median mode variance'.split( ' ' ));



// add cauchy distribution
jStat.cauchy = function( local, scale ) {
	if (!( this instanceof arguments.callee )) return new jStat.cauchy( local, scale );
	this.local = local;
	this.scale = scale;
	for ( var i in jStat.cauchy.prototype ) this[i] = this[i].bind( this );
};
jStat.fn.cauchy = function( local, scale ) {
	var newthis = jStat.cauchy( local, scale );
	newthis.data = this.toArray();
	return newthis;
};

// extend cauchy function with static methods
jStat.extend( jStat.cauchy, {
	pdf : function( x, local, scale ) {
		return ( scale / ( Math.pow( x - local, 2 ) + Math.pow( scale, 2 ))) / Math.PI;
	},

	cdf : function( x, local, scale ) {
		return Math.atan(( x - local) / scale ) / Math.PI + 0.5;
	},

	inv : function( p, local, scale ) {
		return local + scale * Math.tan( Math.PI * ( p - 0.5 ) );
	},

	mean : function( local, scale ) {
		// TODO: implement this
	},

	median: function( local, scale ) {
		return local;
	},

	mode : function( local, scale ) {
		return local;
	},

	sample : function( local, scale ) {
		return jStat.randn() * Math.sqrt( 1 / ( 2 * jStat.randg( 0.5 ) ) ) * scale + local;
	},

	variance : function( local, scale ) {
		// TODO: implement this
	}
});

// extend the cauchy distribution prototype
jStat.cauchy.prototype.sample = function( arr ) {
	if ( arr ) {
		return jStat.alter( arr, function() {
			return jStat.cauchy.sample( this.local, this.scale );
		});
	} else {
		return jStat.cauchy.sample( this.local, this.scale );
	}
};
(function( vals ) {
	for ( var item in vals ) (function( item ) {
		jStat.cauchy.prototype[ item ] = function( x ) {
			var local = this.local,
				scale = this.scale;
			if ( isNaN( x )) {
				return jStat( this.data ).map( function( x ) {
					return jStat.cauchy[item]( x, local, scale );
				});
			}
			return jStat.cauchy[ item ]( x, local, scale );
		};
	})( vals[ item ]);
})( 'pdf cdf inv'.split( ' ' ));
(function( vals ) {
	for ( var item in vals ) (function( item ) {
		jStat.cauchy.prototype[ item ] = function() {
			return jStat.cauchy[ item ]( this.local, this.scale );
		};
	})( vals[ item ]);
})( 'mean median mode variance'.split( ' ' ));



// add chisquare distribution
jStat.chisquare = function( dof ) {
	if (!( this instanceof arguments.callee )) return new jStat.chisquare( dof );
	this.dof = dof;
	for ( var i in jStat.chisquare.prototype ) this[i] = this[i].bind( this );
};
jStat.fn.chisquare = function( dof ) {
	var newthis = jStat.chisquare( dof );
	newthis.data = this.toArray();
	return newthis;
};

// extend chisquare function with static methods
jStat.extend( jStat.chisquare, {
	pdf : function( x, dof ) {
		return (Math.pow( x, dof / 2 - 1) * Math.exp( -x / 2 )) / ( Math.pow( 2, dof / 2) * jStat.gammafn( dof / 2 ));
	},

	cdf : function( x, dof ) {
		return jStat.gammap( x / 2, dof / 2 );
	},

	inv : function( p, dof ) {
		return 2 * jStat.gammapInv( p, 0.5 * dof );
	},

	mean : function( dof ) {
		return dof;
	},

	//TODO: this is an approximation (is there a better way?)
	median : function( dof ) {
		return dof * Math.pow( 1 - ( 2 / ( 9 * dof )), 3 );
	},

	mode : function( dof ) {
		return ( dof - 2 > 0 ) ? dof - 2 : 0;
	},

	sample : function( dof ) {
		return jStat.randg( dof/2 ) * 2;
	},

	variance: function( dof ) {
		return 2 * dof;
	}
});

// extend the chisquare distribution prototype
jStat.chisquare.prototype.sample = function( arr ) {
	if ( arr ) {
		return jStat.alter( arr, function() {
			return jStat.chisquare.sample( this.dof );
		});
	} else {
		return jStat.chisquare.sample( this.dof );
	}
};
(function( vals ) {
	for ( var item in vals ) (function( item ) {
		jStat.chisquare.prototype[ item ] = function( x ) {
			var dof = this.dof;
			if ( isNaN( x )) {
				return jStat( this.data ).map( function( x ) {
					return jStat.chisquare[item]( x, dof );
				});
			}
			return jStat.chisquare[ item ]( x, dof );
		};
	})( vals[ item ]);
})( 'pdf cdf inv'.split( ' ' ));
(function( vals ) {
	for ( var item in vals ) (function( item ) {
		jStat.chisquare.prototype[ item ] = function() {
			return jStat.chisquare[ item ]( this.dof );
		};
	})( vals[ item ]);
})( 'mean median mode variance'.split( ' ' ));



// add exponential distribution
jStat.exponential = function( rate ) {
	if (!( this instanceof arguments.callee )) return new jStat.exponential( rate );
	this.rate = rate;
	for ( var i in jStat.exponential.prototype ) this[i] = this[i].bind( this );
};
jStat.fn.exponential = function( rate ) {
	var newthis = jStat.exponential( rate );
	newthis.data = this;
	return newthis;
};

// extend exponential function with static methods
jStat.extend( jStat.exponential, {
	pdf : function( x, rate ) {
		return x < 0 ? 0 : rate * Math.exp( -rate * x );
	},

	cdf : function( x, rate ) {
		return x < 0 ? 0 : 1 - Math.exp( -rate * x );
	},

	inv : function( p, rate ) {
		return -Math.log( 1 - p ) / rate;
	},

	mean : function( rate ) {
		return 1 / rate;
	},

	median : function ( rate ) {
		return ( 1 / rate ) * Math.log(2);
	},

	mode : function( rate ) {
		return 0;
	},

	sample : function( rate ) {
		return -1 / rate * Math.log( Math.random() );
	},

	variance : function( rate ) {
		return Math.pow( rate, -2 );
	}
});

// extend the exponential distribution prototype
jStat.exponential.prototype.sample = function( arr ) {
	if ( arr ) {
		return jStat.alter( arr, function() {
			return jStat.exponential.sample( this.rate );
		});
	} else {
		return jStat.exponential.sample( this.rate );
	}
};
(function( vals ) {
	for ( var item in vals ) (function( item ) {
		jStat.exponential.prototype[ item ] = function( x ) {
			var rate = this.rate;
			if ( isNaN( x )) {
				return jStat( this.data ).map( function( x ) {
					return jStat.exponential[item]( x, rate );
				});
			}
			return jStat.exponential[ item ]( x, rate );
		};
	})( vals[ item ]);
})( 'pdf cdf inv'.split( ' ' ));
(function( vals ) {
	for ( var item in vals ) (function( item ) {
		jStat.exponential.prototype[ item ] = function() {
			return jStat.exponential[ item ]( this.rate );
		};
	})( vals[ item ]);
})( 'mean median mode variance'.split( ' ' ));



// add gamma distribution
jStat.gamma = function( shape, scale ) {
	if (!( this instanceof arguments.callee )) return new jStat.gamma( shape, scale );
	this.shape = shape;
	this.scale = scale;
	for ( var i in jStat.gamma.prototype ) this[i] = this[i].bind( this );
};
jStat.fn.gamma = function( shape, scale ) {
	var newthis = jStat.gamma( shape, scale );
	newthis.data = this;
	return newthis;
};

// extend gamma function with static methods
jStat.extend( jStat.gamma, {
	pdf : function( x, shape, scale ) {
		return Math.pow( x, shape - 1 ) * ( Math.exp( -x / scale ) / ( jStat.gammafn( shape ) * Math.pow( scale, shape ) ) );
	},

	cdf : function( x, shape, scale ) {
		return jStat.gammap( x / scale, shape );
	},

	inv : function( p, shape, scale ) {
		return jStat.gammapInv( p, shape ) * scale;
	},

	mean : function( shape, scale ) {
		return shape * scale;
	},

	mode : function( shape, scale ) {
		if( shape > 1 ) return ( shape - 1 ) * scale;
		return undefined;
	},

	sample : function( shape, scale ) {
		return jStat.randg( shape ) * scale;
	},

	variance: function( shape, scale ) {
		return shape * scale * scale;
	}
});

// extend the gamma distribution  prototype
jStat.gamma.prototype.sample = function( arr ) {
	if ( arr ) {
		return jStat.alter( arr, function() {
			return jStat.gamma.sample( this.shape, this.scale );
		});
	} else {
		return jStat.gamma.sample( this.shape, this.scale );
	}
};
(function( vals ) {
	for ( var item in vals ) (function( item ) {
		jStat.gamma.prototype[ item ] = function( x ) {
			var shape = this.shape,
				scale = this.scale;
			if ( isNaN( x )) {
				return jStat( this.data ).map( function( x ) {
					return jStat.gamma[item]( x, shape, scale );
				});
			}
			return jStat.gamma[ item ]( x, shape, scale );
		};
	})( vals[ item ]);
})( 'pdf cdf inv'.split( ' ' ));
(function( vals ) {
	for ( var item in vals ) (function( item ) {
		jStat.gamma.prototype[ item ] = function() {
			return jStat.gamma[ item ]( this.shape, this.scale );
		};
	})( vals[ item ]);
})( 'mean median mode variance'.split( ' ' ));



// add kumaraswamy distribution
jStat.kumaraswamy = function( alpha, beta ) {
	if (!( this instanceof arguments.callee )) return new jStat.kumaraswamy( alpha, beta );
	this.alpha = alpha;
	this.beta = beta;
	for ( var i in jStat.kumaraswamy.prototype ) this[i] = this[i].bind( this );
};
jStat.fn.kumaraswamy = function( alpha, beta ) {
	var newthis = jStat.kumaraswamy( alpha, beta );
	newthis.data = this;
	return newthis;
};

// extend kumaraswamy function with static methods
jStat.extend( jStat.kumaraswamy, {
	pdf : function( x, alpha, beta ) {
		return alpha * beta * Math.pow( x, alpha - 1 ) * Math.pow( 1 - Math.pow( x, alpha ), beta - 1 );
	},

	cdf : function( x, alpha, beta ) {
		return ( 1 - Math.pow( 1 - Math.pow( x, alpha ), beta ) );
	},

	mean : function( alpha, beta ) {
		return ( beta * jStat.gammafn( 1 + 1 / alpha ) * jStat.gammafn( beta ) ) / ( jStat.gammafn( 1 + 1 / alpha + beta ) );
	},

	median : function( alpha, beta ) {
		return Math.pow( 1 - Math.pow( 2, -1 / beta ), 1 / alpha );
	},

	mode : function( alpha, beta ) {
		return ( alpha >= 1 && beta >= 1 && ( alpha !== 1 && beta !== 1 ) ) ? Math.pow( ( alpha - 1 ) / ( alpha * beta - 1 ), 1 / alpha ) : undefined;
	},

	variance: function( alpha, beta ) {
	}
});

// extend the kumaraswamy objects prototype
(function( vals ) {
	for ( var item in vals ) (function( item ) {
		jStat.kumaraswamy.prototype[ item ] = function( x ) {
			var alpha = this.alpha,
				beta = this.beta;
			if ( isNaN( x )) {
				return jStat( this.data ).map( function( x ) {
					return jStat.kumaraswamy[item]( x, alpha, beta );
				});
			}
			return jStat.kumaraswamy[ item ]( x, alpha, beta );
		};
	})( vals[ item ]);
})( 'pdf cdf'.split( ' ' ));
(function( vals ) {
	for ( var item in vals ) (function( item ) {
		jStat.kumaraswamy.prototype[ item ] = function() {
			return jStat.kumaraswamy[ item ]( this.alpha, this.beta );
		};
	})( vals[ item ]);
})( 'mean median mode variance'.split( ' ' ));



// add lognormal distribution
jStat.lognormal = function( mu, sigma ) {
	if (!( this instanceof arguments.callee )) return new jStat.lognormal( mu, sigma );
	this.mu = mu;
	this.sigma = sigma;
	for ( var i in jStat.lognormal.prototype ) this[i] = this[i].bind( this );
};
jStat.fn.lognormal = function( mu, sigma ) {
	var newthis = jStat.lognormal( mu, sigma );
	newthis.data = this;
	return newthis;
};

// extend lognormal function with static methods
jStat.extend( jStat.lognormal, {
	pdf : function( x, mu, sigma ) {
		return ( 1 / ( x * sigma * Math.sqrt( 2 * Math.PI ) ) ) * Math.exp( -Math.pow( Math.log( x ) - mu, 2) / ( 2 * sigma*sigma ) );
	},

	cdf : function( x, mu, sigma ) {
		return 0.5 + ( 0.5 * jStat.erf( ( Math.log( x ) - mu ) / Math.sqrt( 2 * sigma*sigma ) ) );
	},

	inv : function( p, mu, sigma ) {
		return Math.exp( -1.41421356237309505 * sigma * jStat.erfcinv( 2 * p ) + mu);
	},

	mean : function( mu, sigma ) {
		return Math.exp( mu + sigma*sigma / 2);
	},

	median : function( mu, sigma ) {
		return Math.exp(mu);
	},

	mode : function( mu, sigma ) {
		return Math.exp( mu - sigma*sigma );
	},

	sample : function( mu, sigma ) {
		return Math.exp( jStat.randn() * sigma + mu );
	},

	variance : function( mu, sigma ) {
		return ( Math.exp( sigma*sigma ) - 1 ) * Math.exp( 2 * mu + sigma*sigma );
	}
});

// extend the lognormal distribution prototype
jStat.lognormal.prototype.sample = function( arr ) {
	if ( arr ) {
		return jStat.alter( arr, function() {
			return jStat.lognormal.sample( this.mu, this.sigma );
		});
	} else {
		return jStat.lognormal.sample( this.mu, this.sigma );
	}
};
(function( vals ) {
	for ( var item in vals ) (function( item ) {
		jStat.lognormal.prototype[ item ] = function( x ) {
			var mu = this.mu,
				sigma = this.sigma;
			if ( isNaN( x )) {
				return jStat( this.data ).map( function( x ) {
					return jStat.lognormal[item]( x, mu, sigma );
				});
			}
			return jStat.lognormal[ item ]( x, mu, sigma );
		};
	})( vals[ item ]);
})( 'pdf cdf inv'.split( ' ' ));
(function( vals ) {
	for ( var item in vals ) (function( item ) {
		jStat.lognormal.prototype[ item ] = function() {
			return jStat.lognormal[ item ]( this.mu, this.sigma );
		};
	})( vals[ item ]);
})( 'mean median mode variance'.split( ' ' ));



// add normal distribution
jStat.normal = function( mean, std ) {
	if (!( this instanceof arguments.callee )) return new jStat.normal( mean, std );
	this.mean = mean;
	this.std = std;
	for ( var i in jStat.normal.prototype ) this[i] = this[i].bind( this );
};
jStat.fn.normal = function( mean, std ) {
	var newthis = jStat.normal( mean, std );
	newthis.data = this;
	return newthis;
};

// extend normal function with static methods
jStat.extend( jStat.normal, {
	pdf : function( x, mean, std ) {
		return ( 1 / ( Math.sqrt( 2 * Math.PI * std * std))) * Math.exp( -( Math.pow( x - mean, 2 ) / 2 * std * std ) );
	},

	cdf : function( x, mean, std ) {
		return 0.5 * ( 1 + jStat.erf( ( x - mean ) / Math.sqrt( 2 * std * std ) ) );
	},

	inv : function( p, mean, std ) {
		return -1.41421356237309505 * std * jStat.erfcinv( 2 * p ) + mean;
	},

	mean : function( mean, std ) {
		return mean;
	},

	median : function( mean, std ) {
		return mean;
	},

	mode : function ( mean, std ) {
		return mean;
	},

	sample : function( mean, std ) {
		return jStat.randn() * std + mean;
	},

	variance : function( mean, std ) {
		return std * std;
	}
});

// extend the normal distribution prototype
jStat.normal.prototype.sample = function( arr ) {
	if ( arr ) {
		return jStat.alter( arr, function() {
			return jStat.normal.sample( this.mean, this.std );
		});
	} else {
		return jStat.normal.sample( this.mean, this.std );
	}
};
(function( vals ) {
	for ( var item in vals ) (function( item ) {
		jStat.normal.prototype[ item ] = function( x ) {
			var mean = this.mean,
				std = this.std;
			if ( isNaN( x )) {
				return jStat( this.data ).map( function( x ) {
					return jStat.normal[item]( x, mean, std );
				});
			}
			return jStat.normal[ item ]( x, mean, std );
		};
	})( vals[ item ]);
})( 'pdf cdf inv'.split( ' ' ));
(function( vals ) {
	for ( var item in vals ) (function( item ) {
		jStat.normal.prototype[ item ] = function() {
			return jStat.normal[ item ]( this.mean, this.std );
		};
	})( vals[ item ]);
})( 'mean median mode variance'.split( ' ' ));



// add pareto distribution
jStat.pareto = function( scale, shape ) {
	if (!( this instanceof arguments.callee )) return new jStat.pareto( scale, shape );
	this.scale = scale;
	this.shape = shape;
	for ( var i in jStat.pareto.prototype ) this[i] = this[i].bind( this );
};
jStat.fn.pareto = function( scale, shape ) {
	var newthis = jStat.pareto( scale, shape );
	newthis.data = this;
	return newthis;
};

// extend pareto function with static methods
jStat.extend( jStat.pareto, {
	pdf : function( x, scale, shape ) {
		return ( x > scale ) ? ( shape * Math.pow( scale, shape ) ) / Math.pow( x, shape + 1 ) : undefined;
	},

	cdf : function( x, scale, shape ) {
		return 1 - Math.pow( scale / x, shape );
	},

	mean : function( scale, shape ) {
		return ( shape > 1 ) ? ( shape * Math.pow( scale, shape ) ) / ( shape - 1 ) : undefined;
	},

	median : function( scale, shape ) {
		return scale * ( shape * Math.SQRT2 );
	},

	mode : function( scale, shape ) {
		return scale;
	},

	variance : function( scale, shape ) {
		return ( shape > 2 ) ? ( scale*scale * shape ) / ( Math.pow( shape - 1, 2 ) * ( shape - 2 ) ) : undefined;
	}
});

// extend the pareto objects prototype
(function( vals ) {
	for ( var item in vals ) (function( item ) {
		jStat.pareto.prototype[ item ] = function( x ) {
			var shape = this.shape,
				scale = this.scale;
			if ( isNaN( x )) {
				return jStat( this.data ).map( function( x ) {
					return jStat.pareto[item]( x, shape, scale );
				});
			}
			return jStat.pareto[ item ]( x, shape, scale );
		};
	})( vals[ item ]);
})( 'pdf cdf'.split( ' ' ));
(function( vals ) {
	for ( var item in vals ) (function( item ) {
		jStat.pareto.prototype[ item ] = function() {
			return jStat.pareto[ item ]( this.scale, this.shape );
		};
	})( vals[ item ]);
})( 'mean median mode variance'.split( ' ' ));



// add studentt distribution
jStat.studentt = function( dof ) {
	if (!( this instanceof arguments.callee )) return new jStat.studentt( dof );
	this.dof = dof;
	for ( var i in jStat.studentt.prototype ) this[i] = this[i].bind( this );
};
jStat.fn.studentt = function( dof ) {
	var newthis = jStat.studentt( dof );
	newthis.data = this;
	return newthis;
};

// extend studentt function with static methods
jStat.extend( jStat.studentt, {
	pdf : function( x, dof ) {
		return ( jStat.gammafn( ( dof + 1 ) / 2 ) / ( Math.sqrt( dof * Math.PI ) * jStat.gammafn( dof / 2 ) ) ) * Math.pow( 1 + ( ( x*x ) / dof ), -( ( dof + 1 ) / 2 ) );
	},

	cdf : function( x, dof ) {
		var dof2 = dof / 2;
		return jStat.incompleteBeta( ( x + Math.sqrt( x*x + dof ) ) / ( 2 * Math.sqrt( x*x + dof ) ), dof2, dof2 );
	},

	inv : function( p, dof ) {
		var x = jStat.incompleteBetaInv( 2 * Math.min( p, 1 - p ), 0.5 * dof, 0.5 );
		x = Math.sqrt( dof * ( 1 - x ) / x );
		return ( p > 0 ) ? x : -x;
	},

	mean : function( dof ) {
		return ( dof > 1 ) ? 0 : undefined;
	},

	median : function ( dof ) {
		return 0;
	},

	mode : function( dof ) {
		return 0;
	},

	sample : function( dof ) {
		return jStat.randn() * Math.sqrt( dof / ( 2 * jStat.randg( dof / 2) ) );
	},

	variance : function( dof ) {
		return ( dof  > 2 ) ? dof / ( dof - 2 ) : ( dof > 1 ) ? Infinity : undefined;
	}
});

// extend the studentt distribution prototype
jStat.studentt.prototype.sample = function( arr ) {
	if ( arr ) {
		return jStat.alter( arr, function() {
			return jStat.studentt.sample( this.dof );
		});
	} else {
		return jStat.studentt.sample( this.dof );
	}
};
(function( vals ) {
	for ( var item in vals ) (function( item ) {
		jStat.studentt.prototype[ item ] = function( x ) {
			var dof = this.dof;
			if ( isNaN( x )) {
				return jStat( this.data ).map( function( x ) {
					return jStat.studentt[item]( x, dof );
				});
			}
			return jStat.studentt[ item ]( x, dof );
		};
	})( vals[ item ]);
})( 'pdf cdf inv'.split( ' ' ));
(function( vals ) {
	for ( var item in vals ) (function( item ) {
		jStat.studentt.prototype[ item ] = function() {
			return jStat.studentt[ item ]( this.dof );
		};
	})( vals[ item ]);
})( 'mean median mode variance'.split( ' ' ));



// add weibull distribution
jStat.weibull = function( scale, shape ) {
	if (!( this instanceof arguments.callee )) return new jStat.weibull( scale, shape );
	this.scale = scale;
	this.shape = shape;
	for ( var i in jStat.weibull.prototype ) this[i] = this[i].bind( this );
};
jStat.fn.weibull = function( scale, shape ) {
	var newthis = jStat.weibull( scale, shape );
	newthis.data = this;
	return newthis;
};

// extend weibull function with static methods
jStat.extend( jStat.weibull, {
	pdf : function( x, scale, shape ) {
		return x < 0 ? 0 : ( shape / scale ) * Math.pow(( x / scale ),( shape - 1 )) * Math.exp(-( Math.pow(( x / scale ), shape )));
	},

	cdf : function( x, scale, shape ) {
		return x < 0 ? 0 : 1 - Math.exp( -Math.pow(( x / scale ), shape ));
	},

	inv : function( p, scale, shape ) {
		return scale * Math.pow( -Math.log( 1 - p ), 1 / shape );
	},

	mean : function( scale, shape ) {
		return scale * jStat.gammafn( 1 + 1 / shape );
	},

	median : function( scale, shape ) {
		return scale * Math.pow( Math.log( 2 ), 1 / shape );
	},

	mode : function( scale, shape ) {
		return ( shape > 1 ) ? scale * Math.pow(( shape - 1 ) / shape, 1 / shape ) : undefined;
	},

	sample : function( scale, shape ) {
		return scale * Math.pow( -Math.log( Math.random() ), 1 / shape );
	},

	variance : function( scale, shape ) {
		return scale * scale * jStat.gammafn( 1 + 2 / shape ) - Math.pow( this.mean( scale, shape ), 2 );
	}
});

// extend the weibull distribution prototype
jStat.weibull.prototype.sample = function( arr ) {
	if ( arr ) {
		return jStat.alter( arr, function() {
			return jStat.weibull.sample( this.scale, this.shape );
		});
	} else {
		return jStat.weibull.sample( this.scale, this.shape );
	}
};
(function( vals ) {
	for ( var item in vals ) (function( item ) {
		jStat.weibull.prototype[ item ] = function( x ) {
			var scale = this.scale,
				shape = this.shape;
			if ( isNaN( x )) {
				return jStat( this.data ).map( function( x ) {
					return jStat.weibull[item]( x, scale, shape );
				});
			}
			return jStat.weinbull[ item ]( x, scale, shape );
		};
	})( vals[ item ]);
})( 'pdf cdf inv'.split( ' ' ));
(function( vals ) {
	for ( var item in vals ) (function( item ) {
		jStat.weibull.prototype[ item ] = function() {
			return jStat.weibull[ item ]( this.scale, this.shape );
		};
	})( vals[ item ]);
})( 'mean median mode variance'.split( ' ' ));



// add uniform distribution
jStat.uniform = function( a, b ) {
	if (!( this instanceof arguments.callee )) return new jStat.uniform( a, b );
	this.a = a;
	this.b = b;
	for ( var i in jStat.uniform.prototype ) this[i] = this[i].bind( this );
};
jStat.fn.uniform = function( a, b ) {
	var newthis = jStat.uniform( a, b );
	newthis.data = this;
	return newthis;
};

// extend uniform function with static methods
jStat.extend( jStat.uniform, {
	pdf : function( x, a, b ) {
		return ( x < a || x > b ) ? 0 : 1 / ( b - a );
	},

	cdf : function( x, a, b ) {
		if ( x < a ) {
			return 0;
		} else if ( x < b ) {
			return ( x - a ) / ( b - a );
		}
		return 1;
	},

	mean : function( a, b ) {
		return 0.5 * ( a + b );
	},

	median : function( a, b ) {
		return jStat.mean( a, b );
	},

	mode : function( a, b ) {

	},

	sample : function( a, b ) {
		return ( a / 2 + b / 2 ) + ( b / 2 - a / 2) * ( 2 * Math.random() - 1);
	},

	variance : function( a, b ) {
		return 0.08333333333333333 * Math.pow( b - a, 2 );
	}
});

// extend the uniform distribution prototype
jStat.uniform.prototype.sample = function( arr ) {
	if ( arr ) {
		return jStat.alter( arr, function() {
			return jStat.uniform.sample( this.a, this.b );
		});
	} else {
		return jStat.uniform.sample( this.a, this.b );
	}
};
(function( vals ) {
	for ( var item in vals ) (function( item ) {
		jStat.uniform.prototype[ item ] = function( x ) {
			var a = this.a,
				b = this.b;
			if ( isNaN( x )) {
				return jStat( this.data ).map( function( x ) {
					return jStat.uniform[item]( x, a, b );
				});
			}
			return jStat.uniform[ item ]( x, a, b );
		};
	})( vals[ item ]);
})( 'pdf cdf inv'.split( ' ' ));
(function( vals ) {
	for ( var item in vals ) (function( item ) {
		jStat.uniform.prototype[ item ] = function() {
			return jStat.uniform[ item ]( this.a, this.b );
		};
	})( vals[ item ]);
})( 'mean median mode variance'.split( ' ' ));



// add uniform distribution in terms of mean and standard deviation
jStat.uniformmv = function( m, s ) {
	if (!( this instanceof arguments.callee )) return new jStat.uniformmv( m, s );
	this.m = m;
	this.s = s;
	for ( var i in jStat.uniformmv.prototype ) this[i] = this[i].bind( this );
};
jStat.fn.uniformmv = function( m, s ) {
	var newthis = jStat.uniformmv( m, s );
	newthis.data = this;
	return newthis;
};

// extend uniform function with static methods
jStat.extend( jStat.uniformmv, {
	pdf : function( x, m, s ) {
		var sqrtt = Math.sqrt( -3 );
		return ( -s * sqrtt <= x - m || x - m <= s * sqrtt )
			? 1 / ( 2 * s * sqrtt )
		: 0;
	},

	cdf : function( x, m, s ) {
		var sqrtt = Math.sqrt( -3 );
		return ( x - m < -s * sqrtt )
			? 0
		: ( x - m >= s * sqrtt )
			? 1
		: 0.5 * (( x - m ) / ( s * sqrtt ) + 1 );
	}
});

// extend uniformmv prototype
(function( vals ) {
	for ( var item in vals ) (function( item ) {
		jStat.uniformmv.prototype[ item ] = function( x ) {
			var m = this.m,
				s = this.s;
			if ( isNaN( x )) {
				return jStat( this.data ).map( function( x ) {
					return jStat.uniformmv[item]( x, m, s );
				});
			}
			return jStat.uniformmv[ item ]( x, m, s );
		};
	})( vals[ item ]);
})( 'pdf cdf'.split( ' ' ));



// add binomial distribution
jStat.binomial = function( n, p ) {
	if (!( this instanceof arguments.callee )) return new jStat.binomial( n, p );
	this.n = n;
	this.p = p;
	for ( var i in jStat.binomial.prototype ) this[i] = this[i].bind( this );
};
jStat.fn.binomial = function( n, p ) {
	var newthis = jStat.binomial( n, p );
	newthis.data = this;
	return newthis;
};

// extend uniform function with static methods
jStat.extend( jStat.binomial, {
	pdf : function( k, n, p ) {
		return jStat.combination( n, k ) * Math.pow( p, k ) * Math.pow( 1 - p, n - k );
	},

	cdf : function( x, n, p ) {
		var binomarr = [],
			k = 0,
			i = 0,
			sum = 0;
		if ( x < 0 ) {
			return 0;
		}
		if ( x < n ) {
			for ( ; k < n; k++ ) {
				binomarr[ k ] = jStat.binomial( k, n, p );
			}
			for ( ; i <= x; i++ ) {
				sum += binomarr[ i ];
			}
			return sum;
		}
		return 1;
	}
});

// extend binomial prototype
(function( vals ) {
	for ( var item in vals ) (function( item ) {
		jStat.binomial.prototype[ item ] = function( x ) {
			var n = this.n,
				p = this.p;
			if ( isNaN( x )) {
				return jStat( this.data ).map( function( x ) {
					return jStat.binomial[item]( x, n, p );
				});
			}
			return jStat.binomial[ item ]( x, n, p );
		};
	})( vals[ item ]);
})( 'pdf cdf'.split( ' ' ));



// add negative binomial distribution
jStat.negbin = function( r, p ) {
	if (!( this instanceof arguments.callee )) return new jStat.negbin( r, p );
	this.r = r;
	this.p = p;
	for ( var i in jStat.negbin.prototype ) this[i] = this[i].bind( this );
};
jStat.fn.negbin = function( r, p ) {
	var newthis = jStat.negbin( r, p );
	newthis.data = this;
	return newthis;
};

// extend uniform function with static methods
jStat.extend( jStat.negbin, {
	pdf : function( k, r, p ) {
		return k !== k | 0
			? false
		: k < 0
			? 0
		: jStat.combination( k + r - 1, k ) * Math.pow( 1 - p, r ) * Math.pow( p, k );
	},

	cdf : function( x, r, p ) {
		var sum = 0,
			k = 0;
		if ( x < 0 ) return 0;
		for ( ; k <= x; k++ ) {
			sum += jStat.negbin( k, r, p );
		}
		return sum;
	}
});

// extend binomial prototype
(function( vals ) {
	for ( var item in vals ) (function( item ) {
		jStat.negbin.prototype[ item ] = function( x ) {
			var r = this.r,
				p = this.p;
			if ( isNaN( x )) {
				return jStat( this.data ).map( function( x ) {
					return jStat.negbin[item]( x, r, p );
				});
			}
			return jStat.negbin[ item ]( x, r, p );
		};
	})( vals[ item ]);
})( 'pdf cdf'.split( ' ' ));



// add hypergeometric distribution
jStat.hypgeom = function( N, m, n ) {
	if (!( this instanceof arguments.callee )) return new jStat.hypgeom( N, m, n );
	this.N = N;
	this.m = m;
	this.n = n;
	for ( var i in jStat.hypgeom.prototype ) this[i] = this[i].bind( this );
};
jStat.fn.hypogeom = function( N, m, n ) {
	var newthis = jStat.hypogeom( N, m, n );
	newthis.data = this;
	return newthis;
};

// extend uniform function with static methods
jStat.extend( jStat.hypgeom, {
	pdf : function( k, N, m, n ) {
		return k !== k | 0
			? false
		: ( k < 0)
			? 0
		: jStat.combination( m, k ) * jStat.combination( N - m , n - k ) / jStat.combination( N, n );
	},

	cdf : function( x, N, m, n ) {
		var sum = 0,
			k = 0;
		if ( x < 0 ) return 0;
		for ( ; k <= x; k++ ) {
			sum += jStat.hypgeom( k, N, m, n );
		}
		return sum;
	}
});

// extend hypgeom prototype
(function( vals ) {
	for ( var item in vals ) (function( item ) {
		jStat.hypgeom.prototype[ item ] = function( x ) {
			var N = this.N,
				m = this.m,
				n = this.n;
			if ( isNaN( x )) {
				return jStat( this.data ).map( function( x ) {
					return jStat.hypgeom[item]( x, N, m, n );
				});
			}
			return jStat.hypgeom[ item ]( x, N, m, n );
		};
	})( vals[ item ]);
})( 'pdf cdf'.split( ' ' ));



// add poisson distribution
jStat.poisson = function( l ) {
	if (!( this instanceof arguments.callee )) return new jStat.poisson( l );
	this.l = l;
	for ( var i in jStat.poisson.prototype ) this[i] = this[i].bind( this );
};
jStat.fn.poisson = function( l ) {
	var newthis = jStat.poisson( l );
	newthis.data = this;
	return newthis;
};

// extend uniform function with static methods
jStat.extend( jStat.poisson, {
	pdf : function( k, l ) {
		return Math.pow( l, k ) * Math.exp( -l ) / jStat.factorial( k );
	},

	cdf : function( x, l ) {
		var sum = 0,
			k = 0;
		if ( x < 0 ) return 0;
		for ( ; k <= x; k++ ) {
			sum += jStat.poisson( k, l );
		}
		return sum;
	}
});

// extend poisson prototype
(function( vals ) {
	for ( var item in vals ) (function( item ) {
		jStat.poisson.prototype[ item ] = function( x ) {
			var l = this.l;
			if ( isNaN( x )) {
				return jStat( this.data ).map( function( x ) {
					return jStat.poisson[item]( x, l );
				});
			}
			return jStat.poisson[ item ]( x, l );
		};
	})( vals[ item ]);
})( 'pdf cdf'.split( ' ' ));

})( this.jStat, Math );
