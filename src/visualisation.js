    
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
        this._fill = false;
	this._min = 0;
	this._max = 1.0;
	this.nop = 100;
	
	
	if( options != null)
	  this._options = options;
	else
	  this._options = {
		yaxis: { min: 0.0}
	};
	if(nop!=null)
		this.nop = nop;
	
	if( distribution != null) {
	this.setDistribution(distribution,x);
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
	if(x== null)
		obj.x = jStat( jStat.seq( obj._min, obj._max, obj.nop) );
	else
		obj.x = x;
	obj._pdfValues = obj._distribution.pdf(obj.x);
	obj._cdfValues = obj._distribution.cdf( obj.x );
	obj._maxY = obj._pdfValues.max();
	obj._options = {
	  xaxis: {min: obj._min, max: obj._max},
	 yaxis: {
		min: 0, 
		max: obj._maxY}
	};
	
	obj._pdfdata = [];
	obj._cdfdata = [];

	obj.generatedata();
	//alert(obj._pdfdata);
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
                    clickable: false,
                    hoverable: false,
                    label: "PDF"
                }, {
                    yaxis: 2,
                    data:obj._cdfdata,
                    clickable: false,
                    color: 'rgb(175,216,248)',
                    hoverable: false,
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
                    hoverable: false,
                    color: 'rgb(237,194,64)',
                    clickable: false,
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
                    hoverable: false,
                    color: 'rgb(237,194,64)',
                    clickable: false,
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
        var lines = {};
        var points = {};
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
