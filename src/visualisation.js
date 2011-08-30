
//to plot histograms given the data and number of bins.

jStat.histogram = function(plot_container,data, bins) {

	plot_container = "#" + plot_container;
	var size = data.length,
	data_min = jStat.min(data),
	a = data_min,
	b = jStat.max(data),
	step = (b-a)/bins,
	i,j,p,
	freq = [],
	plotdata= [],
	options;
	
	for(j = 0;j<bins;j++)
		freq[j]=0;
	
	j=0;
	p = a + step;
	for(j=0;j<bins;j++) {
	for( i = 0; i<size; i++) {
		if(j==0) {
		if(data[i]>=a && data[i] <= p ) {
			freq[j]++;
		} 
		}
		else {
		if(data[i]>a && data[i] <= p) {
			freq[j]++;
		} 
		}
	}
	a=p;
	if(j== (bins-1))
		p = b;
	else
 		p=p+step;	
	}
	for( i=data_min, j=0;j<bins;i=i+step,j++) {
		plotdata.push([i,freq[j]/size]);
	}

	options= {
		xaxis: {min: data_min, max: b},
		yaxis: {min: 0, max: 1},
		series: {
		bars: { show:true, barWidth: step, lineWidth: 2}
		}
	};
	$.plot($(plot_container), [{data: plotdata, color: 'rgb(100,200,156)'}], options);
	

};

/* 
plot function that is being called with a plot id, distribution,sample x and the options.
If wants to plot a data series and not a distribution, pass the second parameter as NULL.
*/
jStat.plot = function(id, distribution, x, options ,nop) {
  
  if (!( this instanceof arguments.callee )) {
     return new jStat.plot(id, distribution,x, options,nop);
   }
	this._container = '#' + String(id);
	this._plots = [];
	this._pdfdata = [];
	this._cdfdata = [];
        this._showPDF = true;
        this._showCDF = false;
        this._maxY = 1;
        this._plotType = 'line';    // line, point, both
        this._fill = false;		// true, false
	this._min = 0;
	this._max = 1.0;
	this.nop = 100;
	
	
	if( options != null)
	  this._options = options;
	else
	  this._options = {
	  };
	if(nop!=null)
		this.nop = nop;
	
	if( distribution != null) {
	this.setDistribution(distribution,x);
	}
	else 
	{
		$.plot($(this._container),x,this._options);
	}	

	

};


jStat.extend(jStat.plot, {
  
  setDistribution: function(distribution, x,obj) {
	  obj._distribution = distribution;
	  
	  if(distribution instanceof jStat.normal) {
	  obj._min = obj._distribution.mean - 5 * Math.sqrt( obj._distribution.variance() );
	  obj._max = obj._distribution.mean + 5 * Math.sqrt( obj._distribution.variance() );
	  }
	  else { 
	  obj._min = obj._distribution.mean() - 5 * Math.sqrt( obj._distribution.variance() );
	  obj._max = obj._distribution.mean() + 5 * Math.sqrt( obj._distribution.variance() );
	  }
	
	  if( distribution instanceof jStat.gamma || distribution instanceof jStat.lognormal) {
	      obj._min = 0 ;
	  }
	  if( distribution instanceof jStat.beta) {
	    obj._min = 0.0;
	    obj._max = 0.998999999;
	  }
	if(x == null)
		obj.x = jStat( jStat.seq( obj._min, obj._max, obj.nop) );
	else
		obj.x = x;
	obj._pdfValues = obj._distribution.pdf(obj.x);
	obj._cdfValues = obj._distribution.cdf( obj.x );
	obj._maxY = obj._pdfValues.max();
	
	obj._options.xaxis = {min: obj._min, max: obj._max};
	obj._options.yaxis = {min: 0,max: obj._maxY};

	obj._pdfdata = [];
	obj._cdfdata = [];

	obj.generatedata();
	obj.draw();
  },
 
   generatedata: function(obj) {
  	var nrow = obj.x.rows(),
	ncol = obj.x.cols(),
	row_cnt = 0;

	for( ; row_cnt < nrow ; row_cnt++ ) {
	  for ( var col_cnt = 0; col_cnt < ncol; col_cnt++ ) {
	if(obj._pdfValues[row_cnt][col_cnt] != Infinity ) {
	    obj._pdfdata.push( [ obj.x[row_cnt][col_cnt], obj._pdfValues[row_cnt][col_cnt] ] );
	}
	if(obj._cdfValues[row_cnt][col_cnt] != Infinity ) {
	   obj._cdfdata.push( [ obj.x[row_cnt][col_cnt], obj._cdfValues[row_cnt][col_cnt] ] );
	}
	  }
	}
  },
 
  setData: function(data, obj) {
    obj._plots = data;
  },
    
  
  draw: function(obj) {
    if(obj._showPDF && obj._showCDF) {
                obj.setData([{
                    yaxis: 1,
                    data:obj._pdfdata,
                    color: 'rgb(237,194,64)',
                    clickable: true,
                    hoverable: true,
                    label: "PDF"
                }, {
                    yaxis: 2,
                    data:obj._cdfdata,
                    clickable: true,
                    color: 'rgb(175,216,248)',
                    hoverable: true,
                    label: "CDF"
                }]);
		obj._maxY = Math.max(obj._cdfValues.max(), obj._pdfValues.max());		
                obj._options.yaxis = {
		    min: 0,
                    max: obj._maxY*1.1
                }
    }
   else if(obj._showPDF) {
                obj.setData([{
                    data:obj._pdfdata,
                    hoverable: true,
                    color: 'rgb(237,194,64)',
                    clickable: true,
                    label: "PDF"
                }]);
		    obj._maxY = obj._pdfValues.max();
                obj._options.yaxis = {
		    min: 0,
                    max: obj._maxY*1.1
                }     
    }
    else if(obj._showCDF) {
                obj.setData([{
                    data:obj._cdfdata,
                    hoverable: true,
                    color: 'rgb(237,194,64)',
                    clickable: true,
                    label: "CDF"
                }]);
		    obj._maxY = obj._cdfValues.max();
                obj._options.yaxis = {
		    min: 0,
                    max: obj._maxY*1.1
                }    
    }
   $.plot($(obj._container), obj._plots, obj._options);

},
	
 setType: function(type, obj) {
  
	obj._plotType = type;
        var lines = {},
        points = {};

        if(obj._plotType == 'lines') {
            lines.show = true;
            points.show = false;
        } else if(obj._plotType == 'points') {
            lines.show = false;
            points.show = true;
        } else if(obj._plotType == 'both') {
            lines.show = true;
            points.show = true;
        }
        if(obj._options.series == null) {
            obj._options.series = {
                lines: lines,
                points: points
            }
        } 
	else {
            if(obj._options.series.lines == null) {
                obj._options.series.lines = lines;
            }
	    else {
                obj._options.series.lines.show = lines.show;
            }
            if(obj._options.series.points == null) {
                obj._options.series.points = points;
            } else {
                obj._options.series.points.show = points.show;
            }
        }

        obj.draw();
	  },
	     
setFill: function(bool, obj) {
        obj._fill = bool;
        if(obj._options.series == null) {
            obj._options.series = {
                lines: {
                    fill: bool
                }
            }
        } 
	else {
            if(obj._options.series.lines == null) {
                obj._options.series.lines = {
                    fill: bool
                }
            } 
	    else {
	      obj._options.series.lines.fill = bool;
            }
        }
        obj.draw();
    },
	     
    showPDF: function(obj) {
        obj._showPDF = true;
        obj.draw();
    },
    hidePDF: function(obj) {
      obj._showPDF = false;
        obj.draw();
    },
    showCDF: function(obj) {
        obj._showCDF = true;
        obj.draw();
    },
    hideCDF: function(obj) {
        obj._showCDF = false;
        obj.draw();
    }
	  
});
  
 
  
(function( vals ) {
	for ( var item in vals ) (function( item ) {
		jStat.plot.prototype[ item ] = function() {
			return jStat.plot[ item ](this);
		};
	})( vals[ item ]);
})( 'draw showCDF showPDF hideCDF hidePDF generatedata'.split( ' ' ));

(function( vals ) {
	for ( var item in vals ) (function( item ) {
		jStat.plot.prototype[ item ] = function(x) {
			return jStat.plot[ item ](x,this);
		};
	})( vals[ item ]);
})( 'setData setType setFill'.split( ' ' ));
(function(vals) {
	for(var item in vals) (function( item ) {
		jStat.plot.prototype[ item ] = function(x,y) {
			return jStat.plot[ item ](x,y,this);
		};
	})(vals[ item]);
})( 'setDistribution'.split( ' '));
