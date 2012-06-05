//flag==true denotes use of sample standard deviation
//Z Statistics


jStat.extend({

	zscore: function(){
	//2 different parameter lists:
	//(value,mean,sd)
	//(value,array,flag)
	if(typeof arguments[1]=="number"){
		return (arguments[0]-arguments[1])/arguments[2];
	}
	return (arguments[0]-jStat.mean(arguments[1]))/jStat.stdev(arguments[1],arguments[2]);
	},
		
	ztest: function(){
	//3 different paramter lists:
	//(value,mean,sd,sides)
	//(zscore,sides)
	//(value,array,sides,flag)
	if(arguments.length==4){
		if(typeof arguments[1]=="number"){
			if(arguments[3]==1){
				return 1-jStat.normal.cdf(Math.abs(arguments[0]),arguments[1],arguments[2]);
			}
			return 1-2*(jStat.normal.cdf(Math.abs(arguments[0]),arguments[1],arguments[2])-.5);
			}
		if(arguments[2]==1){
			return 1-jStat.normal.cdf(Math.abs(arguments[0]),jStat.mean(arguments[1]),jStat.stdev(arguments[1],arguments[3]));
		}
		return 1-2*(jStat.normal.cdf(Math.abs(arguments[0]),jStat.mean(arguments[1]),jStat.stdev(arguments[1],arguments[3]))-.5);
	}
	if(arguments[1]==1){
		return 1-jStat.normal.cdf(Math.abs(arguments[0]),0,1);
	}
	return 1-2*(jStat.normal.cdf(Math.abs(arguments[0]),0,1)-.5);
	},
	


})


jStat.extend(jStat.fn, {

	zscore: function(value,flag){
	return (value-this.mean())/jStat.stdev(this.toArray(),flag);
	},
	
	ztest: function(value,sides,flag){
	var zscore = Math.abs(this.zscore(value,flag));
	if(sides==1){
		return 1-jStat.normal.cdf(zscore,0,1);
	}
	return 2*(1-jStat.normal.cdf(zscore,0,1));
	},
	
})

//T Statistics

jStat.extend({

	tscore: function(){
	//2 parameter lists
	//(value,mean,sd,n)
	//(value,array)
	if(arguments.length==4){
		return (arguments[0]-arguments[1])/(arguments[2]/Math.sqrt(arguments[3]));
		}
	return (arguments[0]-jStat.mean(arguments[1]))/(jStat.stdev(arguments[1],true)/Math.sqrt(arguments[1].length));
	},
	
	ttest: function(){
	//3 different paramter lists:
	//(value,mean,sd,n,sides)
	//(tscore,n,sides)
	//(value,array,sides)
	if(arguments.length==5){
		var tscore = Math.abs(jStat.tscore(arguments[0],arguments[1],arguments[2],arguments[3]));

		if(arguments[4]==1){
			return 1-jStat.studentt.cdf(tscore,arguments[3]-1);
		}
		return 1-(2*jStat.studentt.cdf(tscore,arguments[3]-1));
	}
	if(typeof arguments[1]=="number"){
		tscore=Math.abs(arguments[0])
		if(arguments[2]==1){
			return 1-jStat.studentt.cdf(tscore,arguments[1]-1);
		}
		return 2*(1-jStat.studentt.cdf(tscore,arguments[1]-1));
	}
	var tscore = Math.abs(jStat.tscore(arguments[0],arguments[1]))
	if(arguments[2]==1){
		return 1-jStat.studentt.cdf(tscore,arguments[1].length-1);
	}
	return 2*(1-jStat.studentt.cdf(tscore,arguments[1].length-1));
	},
	
	
})

jStat.extend(jStat.fn, {

	tscore: function(value){
		return (value-this.mean())/(jStat.stdev(this.toArray(),true)/Math.sqrt(this.cols()));
	},
	
	ttest: function(value,sides){
		if(sides==1){
			return 1-jStat.studentt.cdf(Math.abs(this.tscore(3)),this.cols()-1);
		}
		return 2*(1-jStat.studentt.cdf(Math.abs(this.tscore(3)),this.cols()-1));
	}


})

//F Statistics

jStat.extend({

	anovafscore: function(){
	//Paramter list is as follows:
	//(array1,array2,array3,...)
	//or it is an array of arrays
	
	// array of arrays conversion
	if(arguments.length==1){
		args = new Array(arguments[0].length);
		for(var i=0;i<arguments[0].length;i++){
			args[i] = arguments[0][i];
		}
		arguments = args;
	}
	//2 sample case
	if(arguments.length==2){
		return jStat.variance(arguments[0])/jStat.variance(arguments[1])
	}
	//Builds sample array
	var sample = new Array();
	for(var i=0;i<arguments.length;i++){
		sample = sample.concat(arguments[i])
	}	
	var sampMean=jStat.mean(sample);
	//Computes the explained variance
	var expVar=0;
	for(var i=0;i<arguments.length;i++){
		expVar=expVar+arguments[i].length*Math.pow(jStat.mean(arguments[i])-sampMean,2);
	}
	expVar=expVar/(arguments.length-1);
	//Computes unexplained variance
	var unexpVar=0;
	for(var i=0;i<arguments.length;i++){
		var sampSampMean=jStat.mean(arguments[i]);
		for(var j=0;j<arguments[i].length;j++){
			unexpVar=unexpVar+Math.pow(arguments[i][j]-sampSampMean,2);
		}
	}
	unexpVar=unexpVar/(sample.length-arguments.length);
	return expVar/unexpVar;
	},
	
	anovaftest: function(){
	//2 different paramter setups
	//(array1,array2,array3,...)
	//(anovafscore,df1,df2)
	if(typeof arguments[0]=="number"){
		return 1-jStat.centralF.cdf(arguments[0],arguments[1],arguments[2]);
	}
		anovafscore = jStat.anovafscore(arguments);
		df1 = arguments.length-1;
		var n=0
		for(var i=0;i<arguments.length;i++){
		n = n+arguments[i].length;
		}
		df2 = n-df1-1;
		return 1-jStat.centralF.cdf(anovafscore,df1,df2);
	},
	
	ftest: function(){
	//(fscore,df1,df2)
		return 1-jStat.centralF.cdf(arguments[0],arguments[1],arguments[2]);
	},

})

jStat.extend(jStat.fn,{

	anovafscore: function(){
		return jStat.anovafscore(this.toArray())
	},

	anovaftest: function(){
		var n=0
		for(var i=0;i<this.length;i++){
		n = n+this[i].length;
		}
		return jStat.ftest(this.anovafscore(),this.length-1,n-this.length);
	},

})

//Error Bounds

jStat.extend({

	normalci: function(){
	//2 different parameter setups
	//(value,alpha,sd,n)
	//(value,alpha,array)
	var ans = new Array(2);
	if(arguments.length==4){
		change = Math.abs(jStat.normal.inv(arguments[1]/2,0,1)*arguments[2]/Math.sqrt(arguments[3]));
		ans[0]=arguments[0]-change;
		ans[1]=arguments[0]+change;
		return ans;
	}
	change = Math.abs(jStat.normal.inv(arguments[1]/2,0,1)*jStat.stdev(arguments[2])/Math.sqrt(arguments[2].length))
	ans[0]=arguments[0]-change;
	ans[1]=arguments[0]+change;
	return ans
	},
	
	tci: function(){
	//2 different parameter setups
	//(value,alpha,sd,n)
	//(value,alpha,array)
		var ans = new Array(2);
	if(arguments.length==4){
		change = Math.abs(jStat.studentt.inv(arguments[1]/2,arguments[3]-1)*arguments[2]/Math.sqrt(arguments[3]));
		ans[0]=arguments[0]-change;
		ans[1]=arguments[0]+change;
		return ans;
	}
	change = Math.abs(jStat.studentt.inv(arguments[1]/2,arguments[2].length)*jStat.stdev(arguments[2],true)/Math.sqrt(arguments[2].length))
	ans[0]=arguments[0]-change;
	ans[1]=arguments[0]+change;
	return ans
	},
	
	significant: function(pvalue,alpha){
		return pvalue<alpha;
	},

})

jStat.extend(jStat.fn,{

	normalci: function(value,alpha){
		return jStat.normalci(value,alpha,this.toArray());
	},
	
	tci: function(value,alpha){
		return jStat.tci(value,alpha,this.toArray());
	},

})