$(function() {
	var betaInst = jStat.beta( 3, 4 );
	$.plot( '#betadiv', [
		{
			data : jStat.seq( 0, 1, 101, function( x ) { return [ x, betaInst.pdf( x )];}),
			label : 'PDF'
		},{
			data : jStat.seq( 0, 1, 101, function( x ) { return [ x, betaInst.cdf( x )];}),
			label : 'CDF',
			yaxis : 2
		}],{
			yaxes : [{}, { position : 'right' }]
	});

	var cauchyInst = jStat.cauchy( 3, 4 );
	$.plot( '#cauchydiv', [
		{
			data : jStat.seq( -20, 20, 101, function( x ) { return [ x, cauchyInst.pdf( x )];}),
			label : 'PDF'
		},{
			data : jStat.seq( -20, 20, 101, function( x ) { return [ x, cauchyInst.cdf( x )];}),
			label : 'CDF',
			yaxis : 2
		}],{
			yaxes : [{}, { position : 'right' }]
	});

	var stInst = jStat.studentt( 4 );
	$.plot( '#studenttdiv', [
		{
			data : jStat.seq( -6, 6, 101, function( x ) { return [ x, stInst.pdf( x, 4 )];}),
			label : 'PDF'
		},{
			data : jStat.seq( -6, 6, 101, function( x ) { return [ x, stInst.cdf( x, 4 )];}),
			label : 'CDF',
			yaxis : 2
		}],{
			yaxes : [{}, { position : 'right' }]
	});
});
