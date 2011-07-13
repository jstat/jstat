$(function() {
	var betaInst = jStat.beta( 3, 4 );
	j$.flot( '#betadiv', [{
		data : betaInst.pdf,
		label : 'PDF'
	},{
		data : betaInst.cdf,
		label : 'CDF',
		yaxis : 2
	}],{
		flotopts : {
			yaxes : [{}, { position : 'right' }]
		}
	});

	var cauchyInst = jStat.cauchy( 3, 4 );
	j$.flot( '#cauchydiv', [{
		data : cauchyInst.pdf,
		label : 'PDF'
	},{
		data : cauchyInst.cdf,
		label : 'CDF',
		yaxis : 2
	}],{
		start : -20,
		stop : 20,
		flotopts : {
			yaxes : [{}, { position : 'right' }]
		}
	});

	var stInst = jStat.studentt( 4 );
	j$.flot( '#studenttdiv', [{
		data : stInst.pdf,
		label : 'PDF'
	},{
		data : stInst.cdf,
		label : 'CDF',
		yaxis : 2
	}],{
		start : -6,
		stop : 6,
		flotopts : {
			yaxes : [{}, { position : 'right' }]
		}
	});
});
