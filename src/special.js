// Special functions //

(function( jStat, Math ) {

// private functions


// extending static jStat methods
jStat.extend({

	// Log-gamma function
	gammaln : function( x ) {
		var j = 0,
			cof = [ 76.18009172947146, -86.50532032941677, 24.01409824083091,
				-1.231739572450155, 0.1208650973866179e-2, -0.5395239384953e-5 ],
			xx, y, tmp, ser;
		y = xx = x;
		tmp = xx + 5.5;
		tmp -= ( xx + 0.5 ) * Math.log( tmp );
		ser = 1.000000000190015;
		for( ; j < 5; j++ ) ser += cof[j] / ++y;
		return Math.log( 2.5066282746310005 * ser / xx) - tmp;
	},

	// gamma of z
	gammafn : function( z ) {
		var g = 7,
			p = [ 0.99999999999980993, 676.5203681218851, -1259.1392167224028,
				771.32342877765313, -176.61502916214059, 12.507343278686905,
				-0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7 ],
			f = z > 15 ? 0 : 15 - z,
			i = 0, x, t;
		if ( z < 0.5 ) {
			return +(( Math.PI / ( Math.sin( Math.PI * z ) * jStat.gammafn( 1 - z ))).toFixed( f ));
		}
		z -= 1;
		x = p[0];
		while( ++i < g + 2 ) {
			x += p[i] / ( z + i );
		}
		t = z + g + 0.5;
		return +(( Math.sqrt( 2 * Math.PI ) * Math.pow( t, z + 0.5 ) * Math.exp( -t ) * x ).toFixed( f ));
	},

	// natural log factorial of n
	factorialln : function( n ) {
		return n < 0 ? NaN : jStat.gammaln( n + 1 );
	},

	// factorial of n
	factorial : function( n ) {
		return n < 0 ? NaN : jStat.gammafn( n + 1 );
	}

	
});

// making use of static methods on the instance
(function( funcs ) {
	for ( var i = 0; i < funcs.length; i++ ) (function( passfunc ) {
		jStat.fn[ passfunc ] = function() {
			return jStat( jStat.map( this, function( value ) { return jStat[ passfunc ]( value ); }));
		};
	})( funcs[i] );
})( 'gammaln gammafn factorial factorialln'.split( ' ' ));

// unrevised code beneath this line //


// TODO: evaluate whether these functions should be public
// Returns the incomplete gamma function Q(a,x) evaluated by its
// continued fraction representation as gammacf
function gcf( x, a, gln ) {
	var i = 1, an, b, c, d, del, h, fpmin = 1e-30;

	gln = jStat.gammaln( a );
	b = x + 1 - a;
	c = 1 / fpmin;
	d = 1 / b;
	h = d;
	for( ; i <= 100; i++ ) {
		an = -i * ( i - a );
		b += 2;
		d = an * d + b;
		if( Math.abs( d ) < fpmin ) d = fpmin;

		c = b + an / c;

		if( Math.abs( c ) < fpmin ) c = fpmin;

		d = 1 / d;
		del = d * c;
		h *= del;

		if( Math.abs( del - 1 ) < 3e-7 ) break;
	}
	return Math.exp( -x + a * Math.log( x ) - ( gln ) ) * h;
}

// Returns the incomplete gamma function P(a,x) evaluated by its
// series representation as gamser
function gser( x, a, gln ) {
	var n = 1, sum, del, ap;

	gln = jStat.gammaln( a );

	if( x <= 0 ) {
		return 0;
	} else {
		ap = a;
		del = sum = 1 / a;
		// TODO: replace 100 with constant
		for ( ; n <= 100; n++ ) {
			++ap;
			del *= x / ap;
			sum += del;
			if( Math.abs( del ) < Math.abs( sum ) * 3.0e-7 ) {
				return sum * Math.exp( -x + a * Math.log( x ) - ( gln ));
			}
		}
		return false;
	}
}

jStat.extend({


	// combinations of n, m
	combination : function( n, m ) {
		return ( jStat.factorial( n ) / jStat.factorial( m )) / jStat.factorial( n - m );
	},

	// permutations of n, m
	permutation : function( n, m ) {
		return jStat.factorial( n ) / jStat.factorial( n - m );
	},



	// returns the lower incomplete gamma function P(a,x);
	gammap : function( x, a ) {
		var gamser, gammcf, gln;

		if( isNaN( x ) ) {
			// run for all values in matrix
			return x.map( function( value ) {return jStat.gammap( value, a );} );
		}

		gln = jStat.gammaln( a );
		gammcf = gcf( x, a, gln );
		gamser = gser( x, a, gln );

		if( x < ( a + 1 ) ) {
			// use series representation
			gser( x, a );
			return gamser;
		} else {
			// use the continued fraction representation
			gcf( x, a );
			return 1 - gammcf;
		}
	},

	// Returns the inverse incomplte gamma function
	gammapInv : function( p, a ) {
		var j = 0,x,gln,err,t,u,pp,lna1,afac,a1=a-1,EPS=1e-8;
		gln = jStat.gammaln( a );

//		if( a <= 0 ) xerror();
		if( p >= 1 ) return Math.max( 100, a + 100 * Math.sqrt( a ) );
		if( p <= 0 ) return 0;
		if( a > 1 ) {
			lna1 = Math.log( a1 );
			afac = Math.exp( a1 * ( lna1 - 1 ) - gln );
			pp = ( p < 0.5 ) ? p : 1 - p;
			t = Math.sqrt( -2 * Math.log( pp ) );
			x = ( 2.30753 + t * 0.27061 ) / ( 1 + t * ( 0.99229 + t * 0.04481 ) );
			if( p < 0.5 ) x = -x;
			x = Math.max( 1e-3, a * Math.pow( 1 - 1 / ( 9 * a ) - x / ( 3 * Math.sqrt( a ) ), 3 ) );
		} else {
			t = 1 - a * ( 0.253 + a * 0.12 );
			if( p < t ) x = Math.pow( p / t, 1 / a);
			else x = 1 -Math.log( 1 - ( p - t ) / ( 1 - t ) );
		}

		for( ; j < 12; j++ ) {
			if( x <= 0 ) return 0;
			err = jStat.gammap( x, a ) - p;
			if( a > 1 ) t = afac * Math.exp( -( x - a1 ) + a1 * ( Math.log( x ) - lna1 ) );
			else t = Math.exp( -x + a1 * Math.log( x ) - gln );
			u = err / t;
			x -= ( t = u / ( 1 - 0.5 * Math.min(1, u * ( ( a - 1 ) / x - 1 ) ) ) );
			if( x <= 0 ) x = 0.5 * ( x + t );
			if( Math.abs( t ) < EPS * x ) break;
		}
		return x;
	},

	// Returns the error function erf(x)
	erf : function( x ) {
		if( isNaN( x ) ) {
			// run for all values in matrix
			return x.map( function( value ) {return jStat.erf( value );} );
		}

		var cof = [
			-1.3026537197817094,
			6.4196979235649026e-1,
			1.9476473204185836e-2,
			-9.561514786808631e-3,
			-9.46595344482036e-4,
			3.66839497852761e-4,
			4.2523324806907e-5,
			-2.0278578112534e-5,
			-1.624290004647e-6,
			1.303655835580e-6,
			1.5626441722e-8,
			-8.5238095915e-8,
			6.529054439e-9,
			5.059343495e-9,
			-9.91364156e-10,
			-2.27365122e-10,
			9.6467911e-11,
			2.394038e-12,
			-6.886027e-12,
			8.94487e-13,
			3.13092e-13,
			-1.12708e-13,
			3.81e-16,
			7.106e-15,
			-1.523e-15,
			-9.4e-17,
			1.21e-16,
			-2.8e-17
		],
		j = cof.length - 1, t, ty, tmp, d = 0, dd = 0,res,isneg = false;

		if( x < 0 ) {
			x = -x;
			isneg = true;
		}

		t = 2 / ( 2 + x );
		ty = 4 * t - 2;
		for( ; j > 0; j-- ) {
			tmp = d;
			d = ty * d - dd + cof[j];
			dd = tmp;
		}

		res = t * Math.exp( -x*x + 0.5 * ( cof[0] + ty * d ) - dd );
		return ( isneg ) ? res - 1 : 1 - res;
	},

	// Returns the complmentary error function erfc(x)
	erfc : function( x ) {
		if( isNaN( x ) ) {
			// run for all values in matrix
			return x.map( function( value ) {return jStat.erfc( value );} );
		}

		return 1 - jStat.erf( x );
	},

	// Returns the inverse of the complementary error function
	erfcinv : function( p ) {
		if( isNaN( p ) ) {
			return p.map( function( value ) {return jStat.erfcinv( value );} );
		}

		var x, err, t, pp, j = 0;

		if( p >= 2 ) return -100;
		if( p <= 0 ) return 100;

		pp = ( p < 1 ) ? p : 2 - p;

		t = Math.sqrt( -2 * Math.log( pp / 2 ) );
		x = -0.70711 * ( ( 2.30753 + t * 0.27061 ) / ( 1 + t * ( 0.99229 + t * 0.04481) ) - t );

		for( ; j < 2; j++ ) {
			err = jStat.erfc( x ) - pp;
			x += err / ( 1.12837916709551257 * Math.exp( -x*x ) - x * err );
		}

		return ( p < 1 ) ? x : -x;
	},

	// Returns the beta function B(z,w)
	betafn : function( z, w ) {
		return Math.exp( jStat.gammaln( z ) + jStat.gammaln( w ) - jStat.gammaln( z + w ) );
	},

	// Returns the inverse of the incomplete beta function
	incompleteBetaInv : function( p, a, b ) {

		if( isNaN( p ) ) {
			// run for all values in matrix
			return p.map( function( value ) {return jStat.incompleteBetaInv( value, a, b );} );
		}

		var EPS = 1e-8, pp, t, u, err, x, al, h, w, afac, a1=a-1, b1=b-1,j=0,lna,lnb;

		if( p <= 0 ) return 0;
		else if( p >= 1 ) return 1;
		else if( a >= 1 && b >= 1 ) {
			pp = ( p < 0.5 ) ? p : 1 - p;
			t = Math.sqrt( -2 * Math.log( pp ) );
			x = ( 2.30753 + t * 0.27061 ) / ( 1 + t* ( 0.99229 + t * 0.04481 ) ) - t;
			if( p < 0.5 ) x = -x;
			al = ( x*x -3 ) / 6;
			h = 2 / ( 1 / ( 2 * a - 1 )  + 1 / ( 2 * b - 1 ) );
			w = ( x * Math.sqrt( al + h ) / h ) - ( 1 / ( 2 * b - 1 ) - 1 / ( 2 * a - 1 ) ) * ( al + 5 / 6 - 2 / ( 3 * h ) );
			x = a / ( a + b * Math.exp( 2 * w ) );
		} else {
			lna = Math.log( a / ( a + b ) );
			lnb = Math.log( b / ( a + b ) );
			t = Math.exp( a * lna ) / a;
			u = Math.exp( b * lnb ) / b;
			w = t + u;
			if( p < t / w) x = Math.pow( a*w*p, 1 / a );
			else x = 1 - Math.pow( b*w*( 1 - p ), 1 / b);
		}
		afac = -jStat.gammaln( a ) - jStat.gammaln( b ) + jStat.gammaln( a + b );
		for( ; j < 10; j++ ) {
			if( x === 0 || x === 1) return x;
			err = jStat.incompleteBeta( x, a, b ) - p;
			t = Math.exp( a1 * Math.log( x ) + b1 * Math.log( 1 - x ) + afac );
			u = err / t;
			x -= ( t = u / ( 1 - 0.5 * Math.min( 1, u * ( a1 / x - b1 / ( 1 - x ) ) ) ) );
			if( x <= 0 ) x = 0.5 * ( x + t );
			if( x >= 1 ) x = 0.5 * ( x + t + 1 );
			if( Math.abs( t ) < EPS * x && j > 0 ) break;
		}
		return x;
	},

	// Returns the incomplete beta function I_x(a,b)
	incompleteBeta : function( x, a, b ) {

		if( isNaN( x ) ) {
			// run for all values in matrix
			return x.map( function( value ) {return jStat.incompleteBeta( value, a, b );} );
		}

		// Evaluates the continued fraction for incomplete beta function
		// by modified Lentz's method.
		function betacf( x, a, b ) {
			// TODO: make fpmin constant?
			var m = 1, m2, aa, c, d, del, h, qab, qam, qap, fpmin = 1e-30;

			// These q's will be used in factors that occur in the coefficients
			qab = a + b;
			qap = a + 1;
			qam = a - 1;

			c = 1;
			d = 1 - qab * x / qap;

			if( Math.abs( d ) < fpmin ) d = fpmin;

			d = 1 / d;
			h = d;

			// TODO: replace 100 with MAXIT constant
			for ( ; m <= 100; m++ ) {
				m2 = 2 * m;
				aa = m * ( b - m ) * x / ( ( qam + m2 ) * ( a + m2 ) );
				d = 1 + aa * d;	// One step (the even one) of the recurrence

				// TODO: Make precision check function?
				if( Math.abs( d ) < fpmin ) d = fpmin;

				c = 1 + aa / c;

				if( Math.abs( c ) < fpmin ) c = fpmin;

				d = 1 / d;
				h *= d * c;
				aa = -( a + m ) * ( qab + m ) * x / ( ( a + m2 ) * ( qap + m2 ) );
				d = 1 + aa * d;	// Next step of the recurrence (the odd one)

				if( Math.abs( d ) < fpmin ) d = fpmin;

				c = 1 + aa / c;

				if( Math.abs( c ) < fpmin ) c = fpmin;

				d = 1 / d;
				del = d * c;
				h *= del;

				// TODO: make 3e-7 a constant
				if( Math.abs( del - 1.0 ) < 3e-7 ) break;	// Are we done?
			}

			return h;
		}

		if( x < 0 || x > 1 ) return false;

		var bt = ( x === 0 || x === 1 ) ?  0 :
			Math.exp(jStat.gammaln( a + b ) - jStat.gammaln( a ) -
			jStat.gammaln( b ) + a * Math.log( x ) + b *
			Math.log( 1 - x ));	// Factors in front of the continued fraction.

		if( x < ( a + 1 ) / ( a + b + 2 ) )
			// Use continued fraction directly.
			return bt * betacf( x, a, b ) / a;

		// else use continued fraction after making the symmetry transformation.
		return 1 - bt * betacf( 1 - x, b, a ) / b;

	},

	// Returns a normal deviate (mu=0, sigma=1).
	// If n and m are specified it returns a jstat object of normal deviates.
	randn : function( n, m ) {
		m = m || n;
		if( n ) {
			var mat = jStat.zeros( n,m );
			mat.alter(function() {return jStat.randn();} );
			return mat;
		}
		var u, v, x, y, q;

		do {
			u = Math.random();
			v = 1.7156 * ( Math.random() - 0.5 );
			x = u - 0.449871;
			y = Math.abs( v ) + 0.386595;
			q = x*x + y * ( 0.19600 * y - 0.25472 * x );
		} while( q > 0.27597
			&& ( q > 0.27846 || v*v > -4 * Math.log( u ) * u*u ) );
		return v / u;
	},

	// Returns a gamma deviate by the method of Marsaglia and Tsang.
	randg : function( shape, n, m ) {
		m = m || n;
		shape = shape || 1;
		if( n ) {
			var mat = jStat.zeros( n,m );
			mat.alter(function() {return jStat.randg( shape );} );
			return mat;
		}

		var a1, a2, oalph = shape, u, v, x;

//		if( shape <= 0 ) xerror();

		if( shape < 1 ) shape += 1;

		a1 = shape - 1 / 3;
		a2 = 1 / Math.sqrt( 9 * a1 );

		do {
			do {
				x = jStat.randn();
				v = 1 + a2 * x;
			} while( v <= 0 );
			v = v*v*v;
			u = Math.random();
		} while( u > 1 - 0.331 * Math.pow( x, 4 ) &&
			Math.log( u ) > 0.5 * x*x + a1 * ( 1 - v + Math.log( v ) ));

		// alpha > 1
		if( shape == oalph ) return a1 * v;

		// alpha < 1
		do u = Math.random(); while( u == 0 );

		return Math.pow( u, 1 / oalph ) * a1 * v;
	}
});

})( this.jStat, this.Math );
