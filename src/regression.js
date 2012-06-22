//To regress, simply build X matrix
//(append column of 1's) using
//buildxmatrix and build the Y
//matrix using buildymatrix
//(simply the transpose)
//and run regress.



//Regressions

jStat.extend({

	buildxmatrix: function(){
	//Parameters will be passed in as such
	//(array1,array2,array3,...)
	//as (x1,x2,x3,...)
	//needs to be (1,x1,x2,x3,...)
	var matrixRows = new Array(arguments.length);
	for(var i=0;i<arguments.length;i++){
		var array = [1]
		matrixRows[i]= array.concat(arguments[i])
	}
	return jStat(matrixRows);
	
	},
	
	builddxmatrix: function(){
	//Paramters will be passed in as such
	//([array1,array2,...]
	var matrixRows = new Array(arguments[0].length);
	for(var i=0;i<arguments[0].length;i++){
	var array = [1]
		matrixRows[i]= array.concat(arguments[0][i])
	}
	return jStat(matrixRows);
	
	},
	
	buildjxmatrix: function(jMat){
	//Builds from jStat Matrix
	var pass = new Array(jMat.length)
	for(var i=0;i<jMat.length;i++){
		pass[i] = jMat[i];
	}
	return jStat.builddxmatrix(pass);
	
	},
	
	buildymatrix: function(array){
		return jStat(array).transpose();
	},
	
	buildjymatrix: function(jMat){
		return jMat.transpose();
	},
	
	matrixmult: function(A,B){
		if (A.cols() == B.rows()) {
		if(B.rows()>1){
			var result = [];
				for (var i = 0; i < A.rows(); i++) {
					result[i] = [];
					for (var j = 0; j < B.cols(); j++) {
					var sum = 0;
						for (var k = 0; k < A.cols(); k++) {
							sum += A.toArray()[i][k] * B.toArray()[k][j];
						}
					result[i][j] = sum;
					}
				}
			return jStat(result);
		}
		var result = [];
		for (var i = 0; i < A.rows(); i++) {
			result[i] = [];
			for (var j = 0; j < B.cols(); j++) {
				var sum = 0;
				for (var k = 0; k < A.cols(); k++) {
					sum += A.toArray()[i][k] * B.toArray()[j];
				}
			result[i][j] = sum;
			}
		}
		return jStat(result);
	}
	
	},
	
	//regress and regresst to be fixed
	
	regress: function(jMatX,jMatY){
		print("regressin!");
		print(jMatX.toArray());
		var innerinv = jStat.xtranspxinv(jMatX)
		print(innerinv);
		var xtransp = jMatX.transpose();
		var next = jStat.matrixmult(jStat(innerinv),xtransp);
		return jStat.matrixmult(next,jMatY);
		
	},
	
	regresst: function(jMatX,jMatY,sides){
		beta = jStat.regress(jMatX,jMatY);
		xtransp = jMatX.transpose();
		var ones = new Array(jMatX.length);
		for(var i=0; i<jMatX.length;i++){
			ones[i]=[1];
		}
		ones = jStat(ones);
		var onest = ones.transpose();
		var onesquare = jStat.matrixmult(ones,onest);
		var xm = jStat.matrixmult(onesquare,jMatX);
		xm = xm.divide(xm.length)
		var xdev = jStat.matrixsubtract(jMatX,xm);
		var varcovar = jStat.xtranspx(xdev);
		varcovar = varcovar.divide(xdev.length);
		var sds = new Array(xtransp.length)
		var ts = new Array(xtransp.length)
		var ps = new Array(xtransp.length)
		var compile = new Array(xtransp.length)
		for(var i=1; i<beta.length;i++){
			sds[i]=Math.sqrt(varcovar[i][i])
			print(sds[i])
			ts[i]=jStat.tscore(beta[i],0,sds[i],xdev.length);
			ps[i]=jStat.ttest(ts[i],xtransp.length,sides)
			compile[i]=[beta[i],sds[i],ts[i],ps[i]]
		}
		return compile
	},
	
	xtranspx : function(jMatX){
		return jStat.matrixmult(jMatX.transpose(),jMatX);
	},
	

	xtranspxinv: function(jMatX){
		var inner = jStat.matrixmult(jMatX.transpose(),jMatX);
		var innerinv = jStat.inv(inner);
		return innerinv;
	},
	
	
	samplesize: function(jMatX){
		return jMatX[0].length;
	},
	
	residuals: function(jMatX,jMatY){
		residuals = new Array(xtransp.length)
		var yhat=0;
		for(var i=0; i<jMatX.length;i++){
		yhat=0
			for(var j=0; j<xtransp.length;j++){
				yhat=yhat + beta[j]*jMatX[i][j];
			}
		residuals[i]=jMatY[i]-yhat
		}
		return residuals
	},
	
	ssr: function(jMatX,jMatY){
		residuals = jStat.residuals(jMatX,jMatY);
		var SSR=0
		for(var i=0; i<xtransp.length-1;i++){
			SSR= SSR + Math.pow(residuals[i],2)
		}
	},
	
	sse: function(jMatX,jMatY){
		ybar = jStat.mean(jMatY.toArray)
		errors = new Array(xtransp.length)
		var yhat=0;
		for(var i=0; i<jMatX.length;i++){
		yhat=0
			for(var j=0; j<xtransp.length;j++){
				yhat=yhat + beta[j]*jMatX[i][j];
			}
		errors[i]=yhat-ybar
		}
		var sse=0
		for(var i=0; i<xtransp.length-1;i++){
			sse= sse + Math.pow(errors[i],2)
		}
		return sse
	
	},
	
	rsq: function(jMatX,jMatY){
		return jStat.sse(jMatX,jMatY) + jStat.ssr(jMatX,jMatY);
	
	},
	
	matrixsubtract: function(A,B){
	var ans = new Array(A.length);
	for(var i=0;i<A.length;i++){
		ans[i] = new Array(A[i].length);
		for(var j=0;j<A[i].length;j++){
			ans[i][j]=A[i][j]-B[i][j];
		}
	}
	return jStat(ans);
	},
	
})