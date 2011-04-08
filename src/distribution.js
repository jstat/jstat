this.d$ = this.jDist = (function( Math, j$ ) {

var jDist = function() {
	// TODO: finish implemenation of jDist object
	};

j$.extend( jDist, {
	beta : {
		pdf : function( x, alpha, beta ) {
			return ( Math.pow( x, alpha - 1 ) * Math.pow( 1 - x, beta - 1 ) ) / j$.betafn( alpha, beta );
		},

		cdf : function( x, alpha, beta ) {
			return j$.incompleteBeta( x, alpha, beta );
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

		sample : function( x, alpha, beta ) {
			if( x ) {
				// return a jstat object filled with random samples
				return x.alter( function() {
					var u = j$.randg( alpha );
					return u / ( u + j$.randg( beta ) );
				});
			} else {
				// return a random sample
				var u = j$.randg( alpha );
				return u / ( u + j$.randg( beta ) );
			}
		},

		variance : function( alpha, beta ) {
			return ( alpha * beta ) / ( Math.pow( alpha + beta, 2 ) * ( alpha + beta + 1 ) );
		}
	},

	cauchy : {
		pdf : function( x, location, scale ) {
			return ( scale / ( Math.pow( x - location, 2 ) + Math.pow( scale, 2 ) ) ) / Math.PI;
		},

		cdf : function( x, location, scale ) {
			return Math.atan(( x - location) / scale ) / Math.PI + 0.5;
		},

		inv : function( p, location, scale ) {
			return location + scale * Math.tan( Math.PI * ( p - 0.5 ) );
		},

		mean : function( location, scale ) {
			xerror();
		},

		median: function( location, scale ) {
			return location;
		},

		mode : function( location, scale ) {
			return location;
		},

		sample : function( x, location, scale ) {
			if ( x ) {
				return x.alter( function() {
					return j$.randn() * Math.sqrt( 1 / ( 2 * j$.randg( 0.5 ) ) ) * scale + location;
				});
			} else {
				return j$.randn() * Math.sqrt( 1 / ( 2 * j$.randg( 0.5 ) ) ) * scale + location;
			}
		},

		variance : function( location, scale ) {
			xerror();
		}
	},

	chisquare : {
		pdf : function( x, dof ) {
			return (Math.pow( x, dof / 2 - 1) * Math.exp( -x / 2 )) / ( Math.pow( 2, dof / 2) * j$.gammafn( dof / 2 ));
		},

		cdf : function( x, dof ) {
			return j$.gammap( x / 2, dof / 2 );
		},

		mean : function( dof ) {
			return dof;
		},

		//TODO: this is an approximation (is there a better way?)
		median : function( dof ) {
			return dof * Math.pow( 1 - ( 2 / ( 9 * dof ) ), 3 );
		},

		mode : function( dof ) {
			return ( dof - 2 > 0 ) ? dof - 2 : 0;
		},

		sample : function( x,dof ) {
			if( x ) {
				// return a jstat object filled with random samples
				return x.alter( function() {
					return j$.randg( dof/2 ) * 2;
				});
			} else {
				// return a random sample
				return j$.randg( dof/2 ) * 2;
			}
		},

		variance: function( dof ) {
			return 2 * dof;
		}
	},

	exponential : {
		pdf : function( x, rate ) {
			return x < 0 ? 0 : rate * Math.exp( -rate * x );
		},

		cdf : function( x, rate ) {
			return x < 0 ? 0 : 1 - Math.exp( -rate * x );
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

		sample : function( x, rate ) {
			if( x ) {
				return x.alter( function() {
					return -rate * Math.log( Math.random() );
				})
			} else {
				return -rate * Math.log( Math.random() );
			}
		},

		variance : function( rate ) {
			return Math.pow( rate, -2 );
		}
	},

	gamma : {
		pdf : function( x, shape, scale ) {
			return Math.pow( x, shape - 1 ) * ( Math.exp( -x / scale ) / ( j$.gammafn( shape ) * Math.pow( scale, shape ) ) );
		},

		cdf : function( x, shape, scale ) {
			return j$.gammap( x / scale, shape );
		},

		mean : function( shape, scale ) {
			return shape * scale;
		},

		mode : function( shape, scale ) {
			if( shape > 1 ) return ( shape - 1 ) * scale;
			return undefined;
		},

		sample : function( x, shape, scale ) {
			if( x ) {
				// return a jstat object filled with random samples
				return x.alter( function() {
					return j$.randg( shape ) * scale;
				});
			} else {
				// return a random sample
				return j$.randg( shape ) * scale;
			}
		},

		variance: function( shape, scale ) {
			return shape * scale * scale;
		}
	},

	kumaraswamy : {
		pdf : function( x, alpha, beta ) {
			return alpha * beta * Math.pow( x, alpha - 1 ) * Math.pow( 1 - Math.pow( x, alpha ), beta - 1 );
		},

		cdf : function( x, alpha, beta ) {
			return ( 1 - Math.pow( 1 - Math.pow( x, alpha ), beta ) );
		},

		mean : function( alpha, beta ) {
			return ( beta * j$.gammafn( 1 + 1 / alpha ) * j$.gammafn( beta ) ) / ( j$.gammafn( 1 + 1 / alpha + beta ) );
		},

		median : function( alpha, beta ) {
			return Math.pow( 1 - Math.pow( 2, -1 / beta ), 1 / alpha );
		},

		mode : function( alpha, beta ) {
			return ( alpha >= 1 && beta >= 1 && ( alpha !== 1 && beta !== 1 ) ) ? Math.pow( ( alpha - 1 ) / ( alpha * beta - 1 ), 1 / alpha ) : undefined;
		},
		
		variance: function( alpha, beta ) {
			xerror();
		}
	},

	lognormal : {
		pdf : function( x, mu, sigma ) {
			return ( 1 / ( x * sigma * Math.sqrt( 2 * Math.PI ) ) ) * Math.exp( -Math.pow( Math.log( x ) - mu, 2) / ( 2 * sigma*sigma ) );
		},

		cdf : function( x, mu, sigma ) {
			return 0.5 + ( 0.5 * j$.erf( ( Math.log( x ) - mu ) / Math.sqrt( 2 * sigma*sigma ) ) );
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

		sample : function( x, mu, sigma ) {
			if( x ) {
				return x.alter( function() {
					return Math.exp( j$.randn() * sigma + mu );
				})
			} else {
				return Math.exp( j$.randn() * sigma + mu );
			}
		},

		variance : function( mu, sigma ) {
			return ( Math.exp( sigma*sigma ) - 1 ) * Math.exp( 2 * mu + sigma*sigma );
		}
	},

	normal : {
		pdf : function( x, mean, std ) {
			return ( 1 / ( Math.sqrt( 2 * Math.PI * std * std))) * Math.exp( -( Math.pow( x - mean, 2 ) / 2 * std * std ) );
		},

		cdf : function( x, mean, std ) {
			return 0.5 * ( 1 + j$.erf( ( x - mean ) / Math.sqrt( 2 * std * std ) ) );
		},

		inv : function( p, mean, std ) {
			return -1.41421356237309505 * std * j$.erfcinv( 2 * p ) + mean;
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

		sample : function( x, mean, std ) {
			if( x ) {
				// return a jstat object filled with random samples
				return x.alter( function() {
					return j$.randn() * std + mean;
				});
			} else {
				// return a random sample
				return j$.randn() * std + mean;
			}
		},

		variance : function( mean, std ) {
			return std * std;
		}
	},

	pareto : {
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
	},

	studentt : {
		pdf : function( x, dof ) {
			return ( j$.gammafn( ( dof + 1 ) / 2 ) / ( Math.sqrt( dof * Math.PI ) * j$.gammafn( dof / 2 ) ) ) * Math.pow( 1 + ( ( x*x ) / dof ), -( ( dof + 1 ) / 2 ) );
		},

		cdf : function( x, dof ) {
			var dof2 = dof / 2;
			return j$.incompleteBeta( ( x + Math.sqrt( x*x + dof ) ) / ( 2 * Math.sqrt( x*x + dof ) ), dof2, dof2 );
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

		sample : function( x, dof ) {
			if( x ) {
				return x.alter( function() {
					return j$.randn() * Math.sqrt( dof / ( 2 * j$.randg( dof / 2) ) );
				});
			} else {
				// return a random sample
				return j$.randn() * Math.sqrt( dof / ( 2 * j$.randg( dof / 2) ) );
			}
		},

		variance : function( dof ) {
			return ( dof  > 2 ) ? dof / ( dof - 2 ) : ( dof > 1 ) ? Infinity : undefined;
		}
	},

	weibull : {
		pdf : function( x, scale, shape ) {
			return x < 0 ? 0 : ( shape / scale ) * Math.pow(( x / scale ),( shape - 1 )) * Math.exp(-( Math.pow(( x / scale ), shape )));
		},

		cdf : function( x, scale, shape ) {
			return x < 0 ? 0 : 1 - Math.exp( -Math.pow(( x / scale ), shape ));
		},

		mean : function( scale, shape ) {
			return scale * j$.gammafn( 1 + 1 / shape );
		},

		median : function( scale, shape ) {
			return scale * Math.pow( Math.log( 2 ), 1 / shape );
		},

		mode : function( scale, shape ) {
			return ( shape > 1 ) ? scale * Math.pow(( shape - 1 ) / shape, 1 / shape ) : undefined;
		},

		sample : function( x, scale, shape ) {
			if( x ) {
				return x.alter( function() {
					return scale * Math.pow( -Math.log( Math.random() ), 1 / shape );
				})
			} else {
				return scale * Math.pow( -Math.log( Math.random() ), 1 / shape );
			}
		},

		variance : function( scale, shape ) {
			return scale * scale * j$.gammafn( 1 + 2 / shape ) - Math.pow( this.mean( scale, shape ), 2 );
		}
	},

	uniform : {
		pdf : function( x, a, b ) {
			return ( x < a || x > b ) ? 0 : 1 / ( b - a );
		},

		cdf : function( x, a, b ) {
			if ( x < a ) {
				return 0;
			} else if ( x < b ) {
				return ( x - a ) / ( b - a );
			};
			return 1;
		},

		mean : function( a, b ) {
			return 0.5 * ( a + b );
		},

		median : function( a, b ) {
			return mean( a, b );
		},

		mode : function( a, b ) {

		},

		sample : function( x, a, b ) {
			if( x ) {
				return x.alter( function() {
					return ( a / 2 + b / 2 ) + ( b / 2 - a / 2) * ( 2 * Math.random() - 1);
				});
			} else {
				return ( a / 2 + b / 2 ) + ( b / 2 - a / 2) * ( 2 * Math.random() - 1);
			}
		},

		variance : function( a, b ) {
			return 0.08333333333333333 * Math.pow( b - a, 2 );
		}
	},

	// Discrete distributions //

	// TODO: update these with proper notations.

	// uniform distribution in terms of mean and standard dev
	uniformmv : {
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
	},

	binomial : {
		pdf : function( k, n, p ) {
			return j$.combination( n, k ) * Math.pow( p, k ) * Math.pow( 1 - p, n - k );
		},

		cdf : function( x, n, p ) {
			var binomarr = [],
				k = 0,
				i = 0,
				sum = 0;
			if ( x < 0 ) {
				return 0;
			};
			if ( x < n ) {
				for ( ; k < n; k++ ) {
					binomarr[ k ] = j$.binomial( k, n, p );
				};
				for ( ; i <= x; i++ ) {
					sum += binomarr[ i ];
				};
				return sum;
			};
			return 1;
		}
	},

	negbin : {
		pdf : function( k, r, p ) {
			return k !== Math.floor( k )
				? false
			: k < 0
				? 0
			: j$.combination( k + r - 1, k ) * Math.pow( 1 - p, r ) * Math.pow( p, k );
		},

		cdf : function( x, r, p ) {
			var sum = 0,
				k = 0;
			if ( x < 0 ) return 0;
			for ( ; k <= x; k++ ) {
				sum += j$.negbin( k, r, p );
			};
			return sum;
		}
	},

	hypgeom : {
		pdf : function( k, N, m, n ) {
			return x !== Math.floor( x )
				? false
			: ( x < 0)
				? 0
			: j$.combination( m, k ) * j$.combination( N - m , n - k ) / j$.combination( N, n );
		},

		cdf : function( x, N, m, n ) {
			var sum = 0,
				k = 0;
			if ( x < 0 ) return 0;
			for ( ; k <= x; k++ ) {
				sum += j$.hypgeom( k, N, m, n );
			};
			return sum;
		}
	},

	poisson : {
		pdf : function( k, l ) {
			return Math.pow( l, k ) * Math.exp( -l ) / j$.factorial( k );
		},

		cdf : function( x, l ) {
			var sum = 0,
				k = 0;
			if ( x < 0 ) return 0;
			for ( ; k <= x; k++ ) {
				sum += j$.poisson( k, l );
			};
			return sum;
		}
	}
});

return jDist;
})( Math, jStat );
