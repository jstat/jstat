(function( jStat, jQuery ) {

// options:
// - start: beginning of graph
// - stop: end of graph
// - step: number of steps in the graph
// - flotopts : flot specific options
var defaults = {
	start : 0,
	stop : 1,
	step : 101,
	flotopts : {}
};

jStat.flot = function( selector, funcs, opts ) {
	if (!opts) opts = {rawData: true};
	opts = jQuery.extend( true, {}, defaults, opts );
	var data = [],
		i = 0;
	if (opts.rawData) {
		var size = funcs[0].length;
		for (var i = 1; i<funcs.length; i++) {
			var point = [];
			for (var j = 0; j<size; j++) {
				point.push([funcs[0][j],funcs[i][j]]);
			}
			data.push(point);
		}
	} else {
		if ( jQuery.isFunction( funcs[0] )) {
			for ( ; i < funcs.length; i++ )
				data.push( jStat.seq( opts.start, opts.stop, opts.step, function( x ) { return [ x, funcs[i]( x )]; }));
		} else {
			for ( ; i < funcs.length; i++ ) {
				funcs[i].data = jStat.seq( opts.start, opts.stop, opts.step, function( x ) { return [ x, funcs[i].data( x )]; });
			}
			data = funcs;
		}
	};
	return jQuery.plot( selector, data, opts.flotopts);
};

})( this.jStat, this.jQuery );
