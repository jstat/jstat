

jStat.extend({


	augment: function(A,B) {
		var col1 = A[0].length;
		var col2 = B[0].length;
		var col = col1+col2;
		var n = A.length;
		var i,j;
		var C= jStat.zeros(n,col);

		for( i =0;i<n;i++) {
			for(j = 0;j<col1;j++)
				C[i][j]= A[i][j];
			for(;j<col;j++)
				C[i][j]= B[i][j-col1];
		}
		return C;
	},

	inv: function(A) {
		B=jStat.identity(A.length,A[0].length);
		C = jStat.gauss_jordan(A,B);
		rows = A.length;
		cols = A[0].length;
		I = jStat.zeros(rows,cols);
		for(var i =0;i<rows;i++)
			for(var j=cols-1;j<C[0].length;j++)
				I[i][j-cols] = C[i][j];
		return I;
	},
		
	gauss_elimination: function(A, B) {
		var i,j,k,n,m,factor,sum;
		var X=[];
		n = A.length;		// no of rows
		m=A[0].length;		//no of columns
		A = jStat.augment(A,B);
		maug=A[0].length;		//no of columns
		for( i = 0; i< n; i++ ) {
			var pivot = A[i][i];
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
		var i,j,k,n,m,factor,sum;
		var X=[];
		n = A.length;		// no of rows
		m=A[0].length;		//no of columns
		A = jStat.augment(A,B);
		maug=A[0].length;		//no of columns
		for( i = 0; i< n; i++ ) {
			var pivot = A[i][i];
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
		A=[[2,1],[5,7]];
		B=[[11],[13]];
		X=[[1],[1]];
		r=0.001;
		var i , j,n;
		var Xv,C,H, Xk;
		n = A.length;
  		var L=jStat.zeros(n,n);
  		var U=jStat.zeros(n,n);
  		var D=jStat.zeros(n,n);
  		for (i=0;i<n;i++) {
    			for (j=0;j<n;j++) {
      				if (i>j)
        				L[i][j] = A[i][j];
      				else if (i<j)
        				U[i][j] = A[i][j];
     	 			else
        				D[i][j] = A[i][j];
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
		A=[[2,1],[5,7]];
		B=[[11],[13]];
		X=[[1],[1]];
		r=0.001;
		var i , j,n;
		var Xv,C,H, Xk;
		n = A.length;
  		var L=jStat.zeros(n,n);
  		var U=jStat.zeros(n,n);
  		var D=jStat.zeros(n,n);
  		for (i=0;i<n;i++) {
    			for (j=0;j<n;j++) {
      				if (i>j)
        				L[i][j] = A[i][j];
      				else if (i<j)
        				U[i][j] = A[i][j];
     	 			else
        				D[i][j] = A[i][j];
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
		A=[[2,1],[5,7]];
		B=[[11],[13]];
		X=[[1],[1]];
		r=0.001;
		var i , j,n;
		var Xv,C,H, Xk;
		n = A.length;
  		var L=jStat.zeros(n,n);
  		var U=jStat.zeros(n,n);
  		var D=jStat.zeros(n,n);
  		for (i=0;i<n;i++) {
    			for (j=0;j<n;j++) {
      				if (i>j)
        				L[i][j] = A[i][j];
      				else if (i<j)
        				U[i][j] = A[i][j];
     	 			else
        				D[i][j] = A[i][j];
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
		var m, n , i, j, alpha, r, k, factor;
		var w=[],P=[];
  		m = A.length;
  		n = A[0].length;
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

	QR: function(A,B) {
		var m, n , i, j, alpha, r, k, factor,sum;
		var w=[],P=[],X=[];
  		m = A.length;
  		n = A[0].length;
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
		alert(A);
		alert(B);
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
		var condition, count, i,j,p,q,maxim,theta;
  		condition=1;  		//Condition variable to check tolerance error
  		count=0;	 		//keep track of number of rotations
		n = A.length;
  		var E=jStat.identity(n,n);     //Eigen Vector Matrix
		var EV = [];		//EigenValues Vector
  
		//******************Main Loop***********************  
  		while (condition==1) { 		// condition=1 only if tolerance is not reached
  			count=count+1;     			//updating the count
			//***********Calculating  the maximum off-diagonal element************ 
  			maxim = A[1][2];
  			p=1;
  			q=2;
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

			//****************************Calculating Theta**********************//
  			if (A[p][p]==A[q][q]) {
    				if (A[p][q]>0)
      					theta=Math.PI/4;
    				else
      					theta=-Math.PI/4;
  			}
  			else
    				theta = Math.atan(2*A[p][q]/(A[p][p]-A[q][q]))/2;

			//**********Creating the Rotation Matrix************************
  			var S=jStat.identity(n,n);
  			S[p][p]=Math.cos(theta);
  			S[p][q]=-Math.sin(theta);
  			S[q][p]=Math.sin(theta);
 	 		S[q][q]=Math.cos(theta);
  
  			E=jStat.multiply(E, S);   //Eigen Vector Matrix
  			B=jStat.multiply(jStat.multiply(jStat.inv(S),A),S);
  			A = B;
			//**********Checking the tolerance condition*******************  
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
		return EV;

	},


	rungekutta: function(f,h,p,t_j,u_j,order) {
		
		var k1, k2, u_j1,k3,k4;
		
  		 if (order==2) {
  		 	while (t_j!=p) {
      				k1=h*f(t_j,u_j);
    		  		k2=h*f(t_j+h,u_j+k1);
      				u_j1=u_j+(k1+k2)/2;
      				u_j=u_j1;
      				t_j=t_j+h;
    			}
  		}

  		if (order==4) {
    			while (t_j!=p) {
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
		var i,h,I,d,m,a1,b1,j,k;
		var x=[],h1=[],g=[];
  		i=0;
  		h=(b-a)/2;
  		while (i<order/2) {
     			I=f(a);
     			for( j=a,k=0;j<=b;j=j+h,k++)
				x[k] = j;
     			m=x.length;
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
  		m=1;
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
			var i,n,p;
  			n = X.length;
    			for (i=0;i<n;i++)
    				if (X[i]==x) 
      					p=i;
    			return p;
		}
				
		var n,h_min,i,y1,y2,m,a,j;
		var g=[],h1=[];		
	
 		n=X.length;
		h_min = Math.abs(x-X[pos(X,x)+1]);   
  		i=0;
  		while ( h >= h_min) {    
    			y1 = pos(X,x+h);
    			y2 = pos(X,x);
    			g[i] = (f[y1]-2*f[y2]+f[2*y2-y1])/(h*h);
    			h = h/2;
    			i = i+1;
  		}
  		a = g.length;
		alert(a);
  		m = 1;
 		while ( a!=1 ) {
  			for (j=0; j< a-1; j++)
    				h1[j] = ((Math.pow(4,m))*g[j+1]-g[j])/(Math.pow(4,m)-1);
  			a = h1.length;
			alert(a);
  			g = h1;
			h1=[];
  			m = m+1;
 		}
  
		return g;

	},

	simpson: function(f,a,b,n) {
		var h,i,I,j,k,m;
		var x =[];
  		h=(b-a)/n;
     		for( j=a,k=0;j<=b;j=j+h,k++)
			x[k] = j;
  		m = x.length;
  		I= f(a);
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

		var n,p,i,j,p;
		var l=[],dl=[],A=[],B=[];
  		n=X.length;
 	 	p=0;
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
    			p = p + ( A[i]*F[i] + B[i]*df[i] );
  		}
		return p;
	},

	lagrange : function(X,F,value) {

		var n,p,i,j,l;
		n = X.length;
  		p=0;
  		//*******Running the outer loop to find all the langrange polynomials and adding them up***********
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

		var n, i, S;
		var A=[],B=[],alpha=[],c=[],h=[],b=[],d=[];
  		n=X.length;
  		A=jStat.identity(n,n);
  		B=jStat.zeros(n,1);
		//*****************Creating Matrix H defining the difference between poitns*************
  		for (i=0; i<n-1; i++)
    			h[i]=X[i+1]-X[i];

		//*****************Creating matrix alpha defining the coefficients for variables C_j's******
		alpha[0] = 0;
  		for (i=1;i<n-1;i++)
    			alpha[i] = (3/h[i])*(F[i+1]-F[i])-(3/h[i-1])*(F[i]-F[i-1]);

		//****************Solving the equation Ac=B**********************
  		for (i=1 ; i<n-1; i++) { 
    			A[i][i-1] = h[i-1];
    			A[i][i] = 2*(h[i-1]+h[i]);
    			A[i][i+1] = h[i];
   		 	B[i][0]=alpha[i];
  		}
  		c = jStat.multiply(jStat.inv(A),B);

		//*****************Finding B_j's and D_j's from C_j's***************  
  		for (j=0; j<n-1; j++) {
    			b[j] = (F[j+1]-F[j])/h[j]-h[j]*(c[j+1][0]+2*c[j][0])/3;
    			d[j] = (c[j+1][0]-c[j][0])/(3*h[j]);
  		}

		//*************Finding the final polynomial using all the coeffiecient values*********
		for(j=0;j<n;j++) {
			if( X[j]>value )
				break;
		}
		j=j-1;	
  	//	for (j=1;j<n-1;j++)
    			S = F[j] + (value-X[j]) * b[j] + jStat.sq(value-X[j]) * c[j] + (value-X[j])*jStat.sq(value-X[j]) * d[j];

		return S;

	},

	gauss_quadrature: function() {
	//TODO
	},



});

(function( funcs ) {
	for ( var i = 0; i < funcs[length]; i++ ) (function( passfunc ) {
		jStat.fn[ passfunc ] = function( arg1, arg2 ) {
			return jStat( jStat[ passfunc ]( arg1, arg2 ));
		};
	})( funcs[i] );
})( 'gauss_elimination'.split( ' ' ));

