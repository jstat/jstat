/*
Includes the methods to extend the mathematical support in jStat.
Provides functions for the solution of linear system of equations, integration, extrapolation,
interpolation, eigenvalue problems, differential equations and PCA analysis.
*/

jStat.extend({


	augment: function(A,B) {
		var col1 = A[0].length,
		col2 = B[0].length,
		col = col1+col2,
		n = A.length,
		i,j,
		C=[];

		for( i =0;i<n;i++) {
			C[i] = [];
			for(j = 0;j<col1;j++)
				C[i][j]= A[i][j];
			for(;j<col;j++)
				C[i][j]= B[i][j-col1];
		}
		return C;
	},

	inv: function(A) {
		var i,j,
		B=jStat.identity(A.length,A[0].length),
		C = jStat.gauss_jordan(A,B),
		rows = A.length,
		cols = A[0].length,
		I = [];

		for(i =0;i<rows;i++) {
			I[i] = [];
			for(j=cols-1;j<C[0].length;j++)
				I[i][j-cols] = C[i][j];
		}
		return I;
	},
		
	gauss_elimination: function(A, B) {
		var i = 0,
		j = 0,
		k = 0,
		n = A.length,		// no of rows
		m = A[0].length,	//no of columns
		factor = 1,
		sum = 0,
		maug,pivot,temp,
		X=[];
		A = jStat.augment(A,B);
		maug = A[0].length;		//no of columns in augmented matrix

		for( i = 0; i< n; i++ ) {
			pivot = A[i][i];
			j=i
    			for (k = i+1;k< m;k++) {
       				if( pivot < Math.abs(A[k][i]) ) {
	  				pivot= A[k][i];
 					j = k;
       				}
   	 		}
			if(j!=i) {
				for(k = 0; k < maug; k++) {
					temp = A[i][k];
					A[i][k] = A[j][k];
					A[j][k] = temp;					
				}
			}
			for (j = i+1; j<n; j++) {
				factor = (A[j][i]/A[i][i]);
				for( k = i; k<maug; k++) {
					A[j][k] = A[j][k] - factor*A[i][k];
				}
			}
		}

		for(i = n-1;i>=0;i-- ) {
			sum =0;
			for(j = i+1; j<=n-1;j++) {
				sum = X[j]*A[i][j];
			}
			X[i] =(A[i][maug-1]-sum)/A[i][i];
		}
		return X;
	},

	gauss_jordan: function(A,B) {
		var i = 0,
		j = 0,
		k = 0,
		n = A.length,		// no of rows
		m = A[0].length,	//no of columns
		factor = 1,
		sum = 0,
		temp,pivot,maug,
		X=[];
		A = jStat.augment(A,B);
		maug = A[0].length;		//no of columns in augmented matrix

		for( i = 0; i< n; i++ ) {
			pivot = A[i][i];
			j=i
    			for (k = i+1;k< m;k++) {
       				if( pivot < Math.abs(A[k][i]) ) {
	  				pivot= A[k][i];
 					j = k;
       				}
   	 		}
			if(j!=i) {
				for(k = 0; k < maug; k++) {
					temp = A[i][k];
					A[i][k] = A[j][k];
					A[j][k] = temp;			
				}
			}
			for (j = 0; j<n; j++) {
				if(i!=j) {
				factor = (A[j][i]/A[i][i]);
				for( k = i; k<maug; k++) {
					A[j][k] = A[j][k] - factor*A[i][k];
				}
				}
			}
		}
		for(i = 0;i<n;i++ ) {
			factor = A[i][i];
			for( k = 0; k<maug; k++) {
				A[i][k] = A[i][k]/factor;
			}
		}
		return A;

	},

	lu: function(a, b) {
	//TODO
	},

	cholesky: function(a,b) {
	//TODO
	},

	gauss_jacobi: function(A,B,X,r) {
		//A=[[2,1],[5,7]];
		//B=[[11],[13]];
		//X=[[1],[1]];
		//r=0.001;
		var i = 0,j = 0,
		n = A.length,
		Xv,C,H, Xk,
  		L =[],
  		U=[],
  		D=[];

  		for (i=0;i<n;i++) {
			L[i] = [], U[i] = [], D[i] = [];
    			for (j=0;j<n;j++) {
      				if (i>j) {
        				L[i][j] = A[i][j]; 
					U[i][j] = D[i][j] = 0;
				}
      				else if (i<j) {
        				U[i][j] = A[i][j];
					L[i][j] = D[i][j] = 0;
				}
     	 			else {
        				D[i][j] = A[i][j];
					L[i][j] = U[i][j] = 0;
				}
			}
		}
  		H=jStat.multiply(jStat.multiply(jStat.inv(D),jStat.add(L,U)),-1);
  		C= jStat.multiply(jStat.inv(D),B);
  		Xv = X;
  		Xk= jStat.add(jStat.multiply(H,X),C);
  		i=2;
  		while(Math.abs(jStat.norm(jStat.subtract(Xk,Xv)))>r) {
    			Xv = Xk;
    			Xk = jStat.add(jStat.multiply(H,Xv),C);
    			i = i+1;
		}
		return Xk;
	},

	gauss_seidel: function(A,B,X,r) {
		//A=[[2,1],[5,7]];
		//B=[[11],[13]];
		//X=[[1],[1]];
		//r=0.001;
		var i = 0 ,j = 0,
		n = A.length,
		Xv,C,H, Xk,
  		L=[],
  		U=[],
  		D=[];

  		for (i=0;i<n;i++) {
			L[i] = [], U[i] = [], D[i] = [];
    			for (j=0;j<n;j++) {
      				if (i>j) {
        				L[i][j] = A[i][j]; 
					U[i][j] = D[i][j] = 0;
				}
      				else if (i<j) {
        				U[i][j] = A[i][j];
					L[i][j] = D[i][j] = 0;
				}
     	 			else {
        				D[i][j] = A[i][j];
					L[i][j] = U[i][j] = 0;
				}
			}
		}
  		H=jStat.multiply(jStat.multiply(jStat.inv(jStat.add(D,L)),U),-1);
  		C= jStat.multiply(jStat.inv(jStat.add(D,L)),B);
  		Xv = X;
  		Xk= jStat.add(jStat.multiply(H,X),C);
  		i=2;
  		while(Math.abs(jStat.norm(jStat.subtract(Xk,Xv)))>r) {
    			Xv = Xk;
    			Xk = jStat.add(jStat.multiply(H,Xv),C);
    			i = i+1;
		}
		return Xk; 

	},

	SOR: function(A,B,X,r,w) {
	//	A=[[2,1],[5,7]];
	//	B=[[11],[13]];
	//	X=[[1],[1]];
		//r=0.001;
	//	w = 1.0
		var i = 0, j = 0,
		n = A.length,
		Xv,C,H, Xk;
  		L=[],
  		U=[],
  		D=[];
  		for (i=0;i<n;i++) {
			L[i] = [], U[i] = [], D[i] = [];
    			for (j=0;j<n;j++) {
      				if (i>j) {
        				L[i][j] = A[i][j]; 
					U[i][j] = D[i][j] = 0;
				}
      				else if (i<j) {
        				U[i][j] = A[i][j];
					L[i][j] = D[i][j] = 0;
				}
     	 			else {
        				D[i][j] = A[i][j];
					L[i][j] = U[i][j] = 0;
				}
			}
		}
  		H=jStat.multiply(jStat.inv(jStat.add(D,jStat.multiply(L,w))),jStat.subtract(jStat.multiply(D,(1-w)),jStat.multiply(U,w)));
  		C= jStat.multiply(jStat.multiply(jStat.inv(jStat.add(D,jStat.multiply(L,w))),B),w);
  		Xv = X;
  		Xk= jStat.add(jStat.multiply(H,X),C);
  		i=2;
  		while(Math.abs(jStat.norm(jStat.subtract(Xk,Xv)))>r) {
    			Xv = Xk;
    			Xk = jStat.add(jStat.multiply(H,Xv),C);
    			i = i+1;
		}
		return Xk;
	},


	householder: function(A) {
		var m = A.length, 
		n = A[0].length, 
		i = 0, j = 0, 
		alpha, r, k, factor,
		w = [],P = [];

  		for (i=0; i<m-1; i++) {
    			alpha=0;
    			for (j=i+1; j<n; j++)
      				alpha = alpha+(A[j][i]*A[j][i]);
			if(A[i+1][i]>0)
				factor = -1;
			else factor = 1;
    			alpha= factor*Math.sqrt(alpha);
    			r=Math.sqrt((((alpha*alpha)-A[i+1][i]*alpha)/2));
    			w=jStat.zeros(m,1);
    			w[i+1][0]=(A[i+1][i]-alpha)/(2*r);
    			for (k=i+2; k<m; k++)
      				w[k][0]=A[k][i]/(2*r);
    			P = jStat.subtract( jStat.identity(m,n), jStat.multiply( jStat.multiply(w,jStat.transpose(w)), 2));
    			A = jStat.multiply(P,jStat.multiply(A,P));
  		}
		return A;
		
	},

	// TODO: NOT WORKING PROPERLY.
	QR: function(A,B) {
		var m = A.length,
  		n = A[0].length,
		i = 0, j = 0, alpha, r, k, factor,sum,
		w=[],P=[],X=[];

  		for (i=0; i<m-1; i++) {
    			alpha=0;
    			for (j=i+1; j<n; j++)
      				alpha = alpha+(A[j][i]*A[j][i]);
			if(A[i+1][i]>0)
				factor = -1;
			else factor = 1;
    			alpha= factor*Math.sqrt(alpha);
    			r=Math.sqrt((((alpha*alpha)-A[i+1][i]*alpha)/2));
    			w=jStat.zeros(m,1);
    			w[i+1][0]=(A[i+1][i]-alpha)/(2*r);
    			for (k=i+2; k<m; k++)
      				w[k][0]=A[k][i]/(2*r);
    			P = jStat.subtract( jStat.identity(m,n), jStat.multiply( jStat.multiply(w,jStat.transpose(w)), 2));
    			A = jStat.multiply(P,A);
			B = jStat.multiply(P,B);
  		}
		for(i = m-1;i>=0;i-- ) {
			sum =0;
			for(j = i+1; j<=n-1;j++) {
				sum = X[j]*A[i][j];
			}
			X[i] = B[i][0]/A[i][i];
		}
		return X;
	
	},

	jacobi: function(A) {
		//A = [[1,2,3,4],[5,6,7,8],[2,7,8,1],[4,6,2,5]];
		var condition = 1, 		//Condition variable to check tolerance error
		count = 0, 			//keep track of number of rotations
		i,j,p,q,maxim,theta,	 		
		n = A.length,
  		E=jStat.identity(n,n),				//Eigen Vector Matrix
		EV = [];			//EigenValues Vector
  
  		while (condition==1) { 		// condition=1 only if tolerance is not reached
  			count=count+1;     			//updating the count
  			maxim = A[0][1];
  			p=0;
  			q=1;
  			for (i=0;i<n;i++) {
    				for (j=0;j<n;j++) {
      					if (i!=j) {
        					if (maxim<Math.abs(A[i][j])){
        						maxim=Math.abs(A[i][j]);
         						p=i;
         						q=j;
						}
      					}
     				}
   			}
  			if (A[p][p]==A[q][q]) {
    				if (A[p][q]>0)
      					theta=Math.PI/4;
    				else
      					theta=-Math.PI/4;
  			}
  			else
    				theta = Math.atan(2*A[p][q]/(A[p][p]-A[q][q]))/2;

  			var S=jStat.identity(n,n);
  			S[p][p]=Math.cos(theta);
  			S[p][q]=-Math.sin(theta);
  			S[q][p]=Math.sin(theta);
 	 		S[q][q]=Math.cos(theta);
  
  			E=jStat.multiply(E, S);   //Eigen Vector Matrix
  			B=jStat.multiply(jStat.multiply(jStat.inv(S),A),S);
  			A = B;
  			condition=0;
  			for (i=1;i<n;i++) {
    				for (j=1;j<n;j++) {
      					if (i!=j) {
        					if (Math.abs(A[i][j])>0.001) {
         						condition=1;
       	 					}
      					}
    				}  
  			}
		}
		for(i=0;i<n;i++)
			EV.push(A[i][i]);
		return [E,EV];			//returns both the eigenvalue and eigenmatrix

	},


	rungekutta: function(f,h,p,t_j,u_j,order) {
		
		var k1, k2, u_j1, k3, k4;
		
  		 if (order==2) {
  		 	while (t_j<=p) {
      				k1=h*f(t_j,u_j);
    		  		k2=h*f(t_j+h,u_j+k1);
      				u_j1=u_j+(k1+k2)/2;
      				u_j=u_j1;
      				t_j=t_j+h;
    			}
  		}

  		if (order==4) {
    			while (t_j<=p) {
      				k1=h*f(t_j,u_j);
      				k2=h*f(t_j+h/2,u_j+k1/2);
      				k3=h*f(t_j+h/2,u_j+k2/2);
      				k4=h*f(t_j+h,u_j+k3);
      				u_j1=u_j+(k1+2*k2+2*k3+k4)/6;
      				u_j=u_j1;
      				t_j=t_j+h;
    			}
 		}
		return u_j;
	},

	romberg: function(f,a,b,order) {
		var i = 0,
		h = (b-a)/2,
		I,d,
		m,a1,j,k,
		x=[],h1=[],g=[];

  		while (i<order/2) {
     			I = f(a);
     			for( j=a,k=0;j<=b;j=j+h,k++)
				x[k] = j;
     			m = x.length;
    			for (j=1;j< m-1;j++) {
      				if ((j%2)!=0)
        				I = I + 4*f(x[j]);
      				else
        				I = I + 2*f(x[j]);
    			}
    			I = (h/3) * (I+f(b));
    			g[i]=I;
    			h=h/2;
    			i=i+1;
		}
  		a1 = g.length;
		m = 1;
 		while (a1!=1) {
  			for (j=0; j<a1-1; j++)
    				h1[j]=((4^m)*g[j+1]-g[j])/(4^m-1);
  			a1=h1.length;
  			g=h1;
			h1=[];
  			m=m+1;
 		}
		return g;

	},

	richardson: function(X,f,x,h) {
		function pos(X,x) {
			var i = 0,
			n = X.length,
			p;
    			for (i=0;i<n;i++)
    				if (X[i]==x) 
      					p=i;
    			return p;
		}
				
		var n = X.length,
		h_min = Math.abs(x-X[pos(X,x)+1]), 
		i = 0,
		y1,y2,m,a,j,
		g=[],h1=[];	

  		while ( h >= h_min) {    
    			y1 = pos(X,x+h);
    			y2 = pos(X,x);
    			g[i] = (f[y1]-2*f[y2]+f[2*y2-y1])/(h*h);
    			h = h/2;
    			i = i+1;
  		}
  		a = g.length;
  		m = 1;
 		while ( a!=1 ) {
  			for (j=0; j< a-1; j++)
    				h1[j] = ((Math.pow(4,m))*g[j+1]-g[j])/(Math.pow(4,m)-1);
  			a = h1.length;
  			g = h1;
			h1=[];
  			m = m+1;
 		}
  
		return g;

	},

	simpson: function(f,a,b,n) {
		var h = (b-a)/n,
		i, I = f(a),
		j,k,m,
		x =[];

     		for( j=a,k=0;j<=b;j=j+h,k++)
			x[k] = j;
  		m = x.length;
  		for (i=1;i<m-1;i++) {
    			if (i%2!=0)
      				I=I+4*f(x[i]);
    			else
      				I=I+2*f(x[i]);
  		}
  		I=(h/3)*(I+f(b));
		return I;
	},

	hermite: function(X,F,dF,value) {

		var n = X.length,
		p =0 ,i = 0,j = 0,
		l=[],dl=[],A=[],B=[];

  		for ( i=0; i<n; i++) {
    			l[i]=1;
    			for ( j=0; j<n; j++) {
      			if (i!=j)
        			l[i] = l[i] * (value - X[j])/(X[i]-X[j]);
    			}
			dl[i]=0;
			for( j=0;j<n;j++) {
				if(i!=j) {
    					dl[i] = dl[i] + (1/(X[i]-X[j]));
				}
			}
    			A[i] = (1 - 2*(value-X[i]) * dl[i]) * (l[i]*l[i]);
    			B[i] = (value-X[i]) * (l[i]*l[i]);
    			p = p + ( A[i]*F[i] + B[i]*dF[i] );
  		}
		return p;
	},

	lagrange : function(X,F,value) {

		var p = 0,i,j,l,
		n = X.length;

  		for (i=0;i<n;i++) {
    			l=F[i];  
    			for (j=0;j<n;j++) {
      				if (i!=j)
        				l=l*(value - X[j])/(X[i]-X[j]);	 //Calculating the lagrange polynomial L_i 
    			}
    			p=p+l;	  //Adding the lagrange polynomials found above
  		}
		return p;
	},

	cubic_spline: function(X,F,value) {

		var n =X.length, i, S,
		A = [],B = [],alpha = [],c = [],h = [],b = [],d = [];

  		for (i=0; i<n-1; i++)
    			h[i]=X[i+1]-X[i];

		alpha[0] = 0;
  		for (i=1;i<n-1;i++)
    			alpha[i] = (3/h[i])*(F[i+1]-F[i])-(3/h[i-1])*(F[i]-F[i-1]);

  		for (i=1 ; i<n-1; i++) { 
			A[i] = [], B[i] = [];
    			A[i][i-1] = h[i-1];
    			A[i][i] = 2*(h[i-1]+h[i]);
    			A[i][i+1] = h[i];
   		 	B[i][0]=alpha[i];
  		}
  		c = jStat.multiply(jStat.inv(A),B);

  		for (j=0; j<n-1; j++) {
    			b[j] = (F[j+1]-F[j])/h[j]-h[j]*(c[j+1][0]+2*c[j][0])/3;
    			d[j] = (c[j+1][0]-c[j][0])/(3*h[j]);
  		}

		for(j=0;j<n;j++) {
			if( X[j]>value )
				break;
		}
		j=j-1;	
    			S = F[j] + (value-X[j]) * b[j] + jStat.sq(value-X[j]) * c[j] + (value-X[j])*jStat.sq(value-X[j]) * d[j];

		return S;

	},

	gauss_quadrature: function() {
	//TODO
	},


	PCA: function(X) {
	
	X=[[2.5,0.5,2.2,1.9,3.1,2.3,2,1,1.5,1.1],[2.4,0.7,2.9,2.2,3.0,2.7,1.6,1.1,1.6,0.9],[0.2,1.4,0.6,1.9,2.3,2.5,0.5,1.7,2,1.6],[2.9,1,0.7,0.3,2.5,1.3,0.5,1.7,3,0.2]];

	var m = X.length,
	n = X[0].length,
	flag = false,
	i, j,temp1,
	u=[], D=[], result=[], temp2=[],
	Y = [],
	Bt = [],
	B= [],
	C= [],
	V= [],
	Vt= [];
	
	for(i=0; i<m; i++) {
		u[i] = jStat.sum(X[i])/n;
	}
alert(u);
	for(i=0;i<n;i++) {
		B[i] = [];
		for( j=0;j<m;j++) {
			B[i][j] = X[j][i] - u[j];
		}
	}
	B = jStat.transpose(B);
alert(B);
	for(i=0;i<m;i++) {
		C[i] = [];
		for(j=0;j<m;j++) {
			C[i][j] = (jStat.dot([B[i]],[B[j]]))/(n-1);
		}
	}
alert(C);
	result = jStat.jacobi(C);
	V = result[0];
	D = result[1];
	Vt =jStat.transpose(V);
	for(i=0;i<D.length;i++) {
		for(j=i;j<D.length;j++) {
			if(D[i] < D[j] )  {
				temp1 = D[i];
				D[i]=D[j];
				D[j] = temp1;
				temp2 = Vt[i];
				Vt[i] = Vt[j];
				Vt[j] = temp2;
			}
		}
	}
	Bt = jStat.transpose(B);
	for(i=0;i<m;i++) {
		Y[i] = [];
		for(j=0;j<Bt.length;j++) {
			Y[i][j] = jStat.dot([Vt[i]],[Bt[j]]);
		}
	}

	return [X, D, Vt, Y];

	}



});

