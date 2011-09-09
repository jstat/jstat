/*Provides functions for the solution of linear system of equations, integration, extrapolation,
 * interpolation, eigenvalue problems, differential equations and PCA analysis. */

(function( jStat, Math ) {

var push = Array.prototype.push;

jStat.extend({

	augment : function( a, b ) {
		var newarr = a.slice();
		for ( var i = 0; i < newarr.length; i++ ) {
			push.apply( newarr[i], b[i] );
		}
		return newarr;
	},

	inv : function( a ) {
		var rows = a.length,
			cols = a[0].length,
			b = jStat.identity( rows, cols ),
			c = jStat.gauss_jordan( a, b ),
			obj = [],
			i = 0,
			j;
		for ( ; i < rows; i++ ) {
			obj[i] = [];
			for ( j = cols - 1; j < c[0].length; j++ )
				obj[i][j - cols] = c[i][j];
		}
		return obj;
	},

	gauss_elimination : function( a, b ) {
		var i = 0,
			j = 0,
			n = a.length,
			m = a[0].length,
			factor = 1,
			sum = 0,
			x = [],
			maug, pivot, temp, k;
		a = jStat.augment( a, b );
		maug = a[0].length;
		for( ; i < n; i++ ) {
			pivot = a[i][i];
			j = i;
			for ( k = i + 1; k < m; k++ ) {
				if ( pivot < Math.abs( a[k][i] )) {
					pivot = a[k][i];
					j = k;
				}
			}
			if ( j != i ) {
				for( k = 0; k < maug; k++ ) {
					temp = a[i][k];
					a[i][k] = a[j][k];
					a[j][k] = temp;
				}
			}
			for ( j = i + 1; j < n; j++ ) {
				factor = a[j][i] / a[i][i];
				for( k = i; k < maug; k++) {
					a[j][k] = a[j][k] - factor * a[i][k];
				}
			}
		}
		for ( i = n - 1; i >= 0; i-- ) {
			sum = 0;
			for ( j = i + 1; j<= n - 1; j++ ) {
				sum = x[j] * a[i][j];
			}
			x[i] =( a[i][maug - 1] - sum ) / a[i][i];
		}
		return x;
	},

	gauss_jordan : function( a, b ) {
		var i = 0,
			j = 0,
			n = a.length,
			m = a[0].length,
			factor = 1,
			sum = 0,
			X=[],
			temp, pivot, maug, k;
		a = jStat.augment( a, b );
		maug = a[0].length;
		for ( ; i < n; i++ ) {
			pivot = a[i][i];
			j = i;
			for ( k = i+1;k< m;k++) {
				if( pivot < Math.abs( a[k][i] )) {
					pivot = a[k][i];
					j = k;
				}
			}
			if ( j != i ) {
				for ( ; k < maug; k++ ) {
					temp = a[i][k];
					a[i][k] = a[j][k];
					a[j][k] = temp;
				}
			}
			for ( j = 0; j < n; j++ ) {
				if ( i != j ) {
					factor = a[j][i] / a[i][i];
					for ( k = i; k<maug; k++ ) {
						a[j][k] = a[j][k] - factor * a[i][k];
					}
				}
			}
		}
		for ( i = 0; i < n; i++ ) {
			factor = a[i][i];
			for( k = 0; k < maug; k++ ) {
				a[i][k] = a[i][k] / factor;
			}
		}
		return a;
	},

	lu : function( a, b ) {
		//TODO
	},

	cholesky : function( a, b ) {
		//TODO
	},

	gauss_jacobi : function( a, b, x, r ) {
		var i = 0,
			j = 0,
			n = a.length,
			l = [],
			u = [],
			d = [],
			xv, c, h, xk;
		for ( ; i < n; i++ ) {
			l[i] = [];
			u[i] = [];
			d[i] = [];
			for ( j = 0; j < n; j++ ) {
				if ( i > j ) {
					l[i][j] = a[i][j];
					u[i][j] = d[i][j] = 0;
				} else if ( i < j ) {
					u[i][j] = a[i][j];
					l[i][j] = d[i][j] = 0;
				} else {
					d[i][j] = a[i][j];
					l[i][j] = u[i][j] = 0;
				}
			}
		}
		h = jStat.multiply( jStat.multiply( jStat.inv( d ), jStat.add( l, u )), -1 );
		c = jStat.multiply( jStat.inv( d ), b );
		xv = x;
		xk = jStat.add( jStat.multiply( h, x ), c );
		i = 2;
		while ( Math.abs( jStat.norm( jStat.subtract( xk,xv ))) > r ) {
			xv = xk;
			xk = jStat.add( jStat.multiply( h, xv ), c );
			i++;
		}
		return xk;
	},

	gauss_seidel : function( a, b, x, r ) {
		var i = 0,
			n = a.length,
			l = [],
			u = [],
			d = [],
			j, xv, c, h, xk;
		for ( ; i < n; i++ ) {
			l[i] = [];
			u[i] = [];
			d[i] = [];
			for ( j = 0; j < n; j++) {
				if ( i > j ) {
					l[i][j] = a[i][j];
					u[i][j] = d[i][j] = 0;
				} else if ( i < j ) {
					u[i][j] = a[i][j];
					l[i][j] = d[i][j] = 0;
				} else {
					d[i][j] = a[i][j];
					l[i][j] = u[i][j] = 0;
				}
			}
		}
		h = jStat.multiply( jStat.multiply( jStat.inv( jStat.add( d, l )), u ), -1 );
		c = jStat.multiply( jStat.inv( jStat.add( d, l )), b );
		xv = x;
		xk = jStat.add( jStat.multiply( h, x ), c );
		i = 2;
		while ( Math.abs( jStat.norm( jStat.subtract( xk, xv ))) > r ) {
			xv = xk;
			xk = jStat.add( jStat.multiply( h, xv ), c );
			i = i + 1;
		}
		return xk;
	},

	SOR : function( a, b, x, r, w ) {
		var i = 0,
			n = a.length,
			l = [],
			u = [],
			d = [],
			j, xv, c, h, xk;
		for ( ; i < n; i++ ) {
			l[i] = [];
			u[i] = [];
			d[i] = [];
			for ( j = 0; j < n; j++ ) {
				if ( i > j ) {
					l[i][j] = a[i][j];
					u[i][j] = d[i][j] = 0;
				} else if ( i < j ) {
					u[i][j] = a[i][j];
					l[i][j] = d[i][j] = 0;
				} else {
					d[i][j] = a[i][j];
					l[i][j] = u[i][j] = 0;
				}
			}
		}
		h = jStat.multiply( jStat.inv( jStat.add( d, jStat.multiply( l, w ))), jStat.subtract( jStat.multiply( d, 1 - w ), jStat.multiply( u, w )));
		c = jStat.multiply( jStat.multiply( jStat.inv( jStat.add( d, jStat.multiply( l, w ))), b ), w );
		xv = x;
		xk = jStat.add( jStat.multiply( h, x ), c );
		i = 2;
		while ( Math.abs( jStat.norm( jStat.subtract( xk, xv ))) > r ) {
			xv = xk;
			xk = jStat.add( jStat.multiply( h, xv ), c );
			i++;
		}
		return xk;
	},

	householder : function( a ) {
		var m = a.length,
			n = a[0].length,
			i = 0,
			w = [],
			p = [],
			alpha, r, k, j, factor;
		for ( ; i < m - 1; i++ ) {
			alpha = 0;
			for ( j = i + 1; j < n; j++ )
				alpha += ( a[j][i] * a[j][i] );
			factor = ( a[i + 1][i] > 0 ) ? -1 : 1;
			alpha = factor * Math.sqrt( alpha );
			r = Math.sqrt(((( alpha * alpha ) - a[i + 1][i] * alpha ) / 2 ));
			w = jStat.zeros( m, 1 );
			w[i + 1][0] = ( a[i + 1][i] - alpha ) / ( 2 * r );
			for ( k = i + 2; k < m; k++ ) w[k][0] = a[k][i] / ( 2 * r );
			p = jStat.subtract( jStat.identity( m, n ), jStat.multiply( jStat.multiply(w, jStat.transpose( w )), 2 ));
			a = jStat.multiply( p, jStat.multiply( a, p ));
		}
		return a;
	},

	// TODO: not working properly.
	QR : function( a, b ) {
		var m = a.length,
			n = a[0].length,
			i = 0,
			w = [],
			p = [],
			x = [],
			j, alpha, r, k, factor,sum;
		for ( ; i < m - 1; i++ ) {
			alpha = 0;
			for ( j = i + 1; j < n; j++ )
				alpha += ( a[j][i] * a[j][i] );
			factor = ( a[i + 1][i] > 0 ) ? -1 : 1;
			alpha = factor * Math.sqrt( alpha );
			r = Math.sqrt(((( alpha * alpha ) - a[i + 1][i] * alpha ) / 2 ));
			w = jStat.zeros( m, 1 );
			w[i + 1][0] = ( a[i + 1][i] - alpha ) / ( 2 * r );
			for ( k = i + 2; k < m; k++ ) w[k][0] = a[k][i] / ( 2 * r );
			p = jStat.subtract( jStat.identity( m, n ), jStat.multiply( jStat.multiply( w, jStat.transpose( w )), 2));
			a = jStat.multiply( p, a );
			b = jStat.multiply( p, b );
		}
		for ( i = m - 1; i >= 0; i-- ) {
			sum = 0;
			for ( j = i + 1; j <= n - 1; j++ )
				sum = x[j] * a[i][j];
			x[i] = b[i][0] / a[i][i];
		}
		return x;
	},

	jacobi : function( a ) {
		var condition = 1,
			count = 0,
			n = a.length,
			e = jStat.identity( n, n ),
			ev = [],
			b, i, j, p, q, maxim, theta, s;
		// condition === 1 only if tolerance is not reached
		while ( condition === 1 ) {
			count++;
			maxim = a[0][1];
			p = 0;
			q = 1;
			for ( i = 0; i < n; i++ ) {
				for ( j = 0; j < n; j++ ) {
					if ( i != j ) {
						if ( maxim < Math.abs( a[i][j] )) {
							maxim = Math.abs( a[i][j] );
							p = i;
							q = j;
						}
					}
				}
			}
			if ( a[p][p] === a[q][q] )
				theta = ( a[p][q] > 0 ) ? Math.PI / 4 : -Math.PI / 4;
			else
				theta = Math.atan( 2 * a[p][q] / ( a[p][p] - a[q][q] )) / 2;
			s = jStat.identity( n, n );
			s[p][p] = Math.cos( theta );
			s[p][q] = -Math.sin( theta );
			s[q][p] = Math.sin( theta );
			s[q][q] = Math.cos( theta );
			// eigen vector matrix
			e = jStat.multiply( e, s );
			b = jStat.multiply( jStat.multiply( jStat.inv( s ), a ), s );
			a = b;
			condition = 0;
			for ( i = 1; i < n; i++ ) {
				for ( j = 1; j < n; j++ ) {
					if ( i != j && Math.abs( a[i][j]) > 0.001 ) {
						condition = 1;
					}
				}
			}
		}
		for( i = 0; i < n; i++ ) ev.push( a[i][i] );
		//returns both the eigenvalue and eigenmatrix
		return [e, ev];
	},

	rungekutta : function( f, h, p, t_j, u_j, order ) {
		var k1, k2, u_j1, k3, k4;
		if ( order === 2 ) {
			while ( t_j <= p ) {
				k1 = h * f( t_j, u_j );
				k2 = h * f( t_j + h, u_j + k1 );
				u_j1 = u_j + ( k1 + k2 ) / 2;
				u_j = u_j1;
				t_j = t_j + h;
			}
		}
		if ( order === 4 ) {
			while ( t_j <= p ) {
				k1 = h * f( t_j, u_j);
				k2 = h * f( t_j + h / 2, u_j + k1 / 2 );
				k3 = h * f( t_j + h / 2, u_j + k2 / 2);
				k4 = h * f( t_j +h, u_j + k3 );
				u_j1 = u_j + ( k1 + 2 * k2 + 2 * k3 + k4 ) / 6;
				u_j = u_j1;
				t_j = t_j + h;
			}
		}
		return u_j;
	},

	romberg : function( f, a, b, order ) {
		var i = 0,
			h = ( b - a ) / 2,
			x = [],
			h1 = [],
			g = [],
			m, a1, j, k, I, d;
		while ( i < order / 2 ) {
			I = f( a );
			for ( j = a, k = 0; j <= b; j = j + h, k++ ) x[k] = j;
			m = x.length;
			for ( j = 1; j < m - 1; j++ ) {
				I += ((( j % 2 ) !== 0 ) ? 4 : 2 ) * f( x[j] );
			}
			I = ( h / 3 ) * ( I + f( b ));
			g[i] = I;
			h /= 2;
			i++;
		}
		a1 = g.length;
		m = 1;
		while ( a1 !== 1 ) {
			for ( j = 0; j < a1 - 1; j++ )
				h1[j] = (( Math.pow( 4, m )) * g[j + 1] - g[j] ) / ( Math.pow( 4, m ) - 1 );
			a1 = h1.length;
			g = h1;
			h1 = [];
			m++;
		}
		return g;
	},

	richardson : function( X, f, x, h ) {
		function pos( X, x ) {
			var i = 0,
				n = X.length,
				p;
			for ( ; i < n; i++ )
				if ( X[i] === x ) p = i;
			return p;
		}
		var n = X.length,
			h_min = Math.abs( x - X[pos( X, x ) + 1] ),
			i = 0,
			g = [],
			h1 = [],
			y1, y2, m, a, j;
		while ( h >= h_min ) {
			y1 = pos( X, x + h );
			y2 = pos( X, x );
			g[i] = ( f[y1] - 2 * f[y2] + f[2 * y2 - y1]) / ( h * h );
			h /= 2;
			i++;
		}
		a = g.length;
		m = 1;
		while ( a != 1 ) {
			for ( j = 0; j < a - 1; j++ )
				h1[j] = (( Math.pow( 4, m )) * g[j + 1] - g[j]) / ( Math.pow( 4, m ) - 1 );
			a = h1.length;
			g = h1;
			h1 = [];
			m++;
		}
		return g;
	},

	simpson : function( f, a, b, n ) {
		var h = ( b - a ) / n,
			I = f( a ),
			x = [],
			j = a,
			k = 0,
			i = 1,
			m;
		for ( ; j <= b; j = j + h, k++ )
			x[k] = j;
		m = x.length;
		for ( ; i < m - 1; i++ ) {
			I += (( i % 2 !== 0 ) ? 4 : 2 ) * f( x[i] );
		}
		return ( h / 3 ) * ( I + f( b ));
	},

	hermite : function( X, F, dF, value ) {
		var n = X.length,
			p = 0,
			i = 0,
			l = [],
			dl = [],
			A = [],
			B = [],
			j;
		for ( ; i < n; i++) {
			l[i] = 1;
			for ( j = 0; j < n; j++ ) {
				if ( i != j ) l[i] *= ( value - X[j] ) / ( X[i] - X[j] );
			}
			dl[i] = 0;
			for ( j = 0; j < n; j++ ) {
				if ( i != j ) dl[i] += 1 / (X [i] - X[j] );
			}
			A[i] = ( 1 - 2 * ( value - X[i] ) * dl[i] ) * ( l[i] * l[i] );
			B[i] = ( value - X[i] ) * ( l[i] * l[i] );
			p += ( A[i] * F[i] + B[i] * dF[i] );
		}
		return p;
	},

	lagrange : function( X, F, value ) {
		var p = 0,
			i = 0,
			j, l,
		n = X.length;
		for ( ; i < n; i++ ) {
			l = F[i];
			for ( j = 0; j < n; j++ ) {
				// calculating the lagrange polynomial L_i
				if ( i != j ) l *= ( value - X[j] ) / ( X[i] - X[j] );
			}
			// adding the lagrange polynomials found above
			p += l;
		}
		return p;
	},

	cubic_spline : function( X, F, value ) {
		var n = X.length,
			i = 0, j,
			A = [],
			B = [],
			alpha = [],
			c = [],
			h = [],
			b = [],
			d = [];
		for ( ; i < n - 1; i++ )
			h[i] = X[i + 1] - X[i];
		alpha[0] = 0;
		for ( i = 1; i < n - 1; i++ )
			alpha[i] = ( 3 / h[i] ) * ( F[i + 1] - F[i] ) - ( 3 / h[i-1] ) * ( F[i] - F[i-1] );
		for ( i = 1; i < n - 1; i++ ) {
			A[i] = [];
			B[i] = [];
			A[i][i-1] = h[i-1];
			A[i][i] = 2 * ( h[i - 1] + h[i] );
			A[i][i+1] = h[i];
			B[i][0] = alpha[i];
		}
		c = jStat.multiply( jStat.inv( A ), B );
		for ( j = 0; j < n - 1; j++ ) {
			b[j] = ( F[j + 1] - F[j] ) / h[j] - h[j] * ( c[j + 1][0] + 2 * c[j][0] ) / 3;
			d[j] = ( c[j + 1][0] - c[j][0] ) / ( 3 * h[j] );
		}
		for ( j = 0; j < n; j++ ) {
			if ( X[j] > value ) break;
		}
		j -= 1;
		return F[j] + ( value - X[j] ) * b[j] + jStat.sq( value-X[j] ) * c[j] + ( value - X[j] ) * jStat.sq( value - X[j] ) * d[j];
	},

	gauss_quadrature : function() {
		//TODO
	},

	PCA : function( X ) {
		var m = X.length,
			n = X[0].length,
			flag = false,
			i = 0,
			j, temp1,
			u = [],
			D = [],
			result = [],
			temp2 = [],
			Y = [],
			Bt = [],
			B = [],
			C = [],
			V = [],
			Vt = [];
		for ( i = 0; i < m; i++ ) {
			u[i] = jStat.sum( X[i] ) / n;
		}
		for ( i = 0; i < n; i++ ) {
			B[i] = [];
			for( j = 0; j < m; j++ ) {
				B[i][j] = X[j][i] - u[j];
			}
		}
		B = jStat.transpose( B );
		for ( i = 0; i < m; i++ ) {
			C[i] = [];
			for ( j = 0; j < m; j++ ) {
				C[i][j] = ( jStat.dot( [B[i]], [B[j]] )) / ( n - 1 );
			}
		}
		result = jStat.jacobi( C );
		V = result[0];
		D = result[1];
		Vt = jStat.transpose( V );
		for ( i = 0; i < D.length; i++ ) {
			for ( j = i; j < D.length; j++ ) {
				if( D[i] < D[j] )  {
					temp1 = D[i];
					D[i] = D[j];
					D[j] = temp1;
					temp2 = Vt[i];
					Vt[i] = Vt[j];
					Vt[j] = temp2;
				}
			}
		}
		Bt = jStat.transpose( B );
		for ( i = 0; i < m; i++ ) {
			Y[i] = [];
			for ( j = 0; j < Bt.length; j++ ) {
				Y[i][j] = jStat.dot( [Vt[i]], [Bt[j]] );
			}
		}
		return [X, D, Vt, Y];
	}
});

})( this.jStat, Math );
