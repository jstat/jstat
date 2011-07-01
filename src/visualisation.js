<<<<<<< HEAD
     
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
=======
var Plot = Class.extend({
    init: function(id, options) {
        this._container = '#' + String(id);
        this._plots = [];
        this._flotObj = null;
        this._locked = false;

        if(options != null) {
            this._options = options;
        } else {
            this._options = {
            };
        }

    },
    getContainer: function() {
        return this._container;
    },
    getGraph: function() {
        return this._flotObj;
    },
    setData: function(data) {
        this._plots = data;
    },
    clear: function() {
        this._plots = [];
    //this.render();
    },
    showLegend: function() {
        this._options.legend = {
            show: true
        }
        this.render();
    },
    hideLegend: function() {
        this._options.legend = {
            show: false
        }
        this.render();
    },
    render: function() {
        this._flotObj = null;
        this._flotObj = $.plot($(this._container), this._plots, this._options);
    }
});

var DistributionPlot = Plot.extend({
    init: function(id, distribution, range, options) {
        this._super(id, options);
        this._showPDF = true;
        this._showCDF = false;
        this._pdfValues = [];     // raw values for pdf
        this._cdfValues = [];     // raw values for cdf
        this._maxY = 1;
        this._plotType = 'line';    // line, point, both
        this._fill = false;
        this._distribution = distribution;    // underlying PDF
        // Range object for the plot
/*        if(range != null && Range.validate(range)) {
            this._range = range;
        } else {
            this._range = this._distribution.getRange(); // no range supplied, use distribution default
        }
*/
//this._range=distribution.mean-distribution
        // render
        if(this._distribution != null) {
            this._maxY = this._generateValues();   // create the pdf/cdf values in the ctor
        } else {
            this._options.xaxis = {
             //   min: range.getMinimum(),
	     min: distribution.mean-Math.sqrt(distribution.variance),
	      max: distribution.mean+Math.sqrt(distribution.variance)
               // max: range.getMaximum()
            }
            this._options.yaxis = {
                max: 1
            }
        }



        this.render();
    },
    setHover: function(bool) {
        if(bool) {
            if(this._options.grid == null) {
                this._options.grid = {
                    hoverable: true,
                    mouseActiveRadius: 25
                }
            } else {
                this._options.grid.hoverable = true,
                this._options.grid.mouseActiveRadius = 25
            }
            function showTooltip(x, y, contents, color) {
                $('<div id="jstat_tooltip">' + contents + '</div>').css( {
                    position: 'absolute',
                    display: 'none',
                    top: y + 15,
                    'font-size': 'small',
                    left: x + 5,
                    border: '1px solid ' + color[1],
                    color: color[2],
                    padding: '5px',
                    'background-color': color[0],
                    opacity: 0.80
                }).appendTo("body").show();
            }
            var previousPoint = null;
            $(this._container).bind("plothover", function(event, pos, item) {
                $("#x").text(pos.x.toFixed(2));
                $("#y").text(pos.y.toFixed(2));
                if (item) {
                    if (previousPoint != item.datapoint) {
                        previousPoint = item.datapoint;
                        $("#jstat_tooltip").remove();
                       // var x = jstat.toSigFig(item.datapoint[0],2), y = jstat.toSigFig(item.datapoint[1], 2);
                        var text = null;
                        var color = item.series.color;
                        if(item.series.label == 'PDF') {
                            text = "P(" + x + ") = " + y;
                            color = ["#fee", "#fdd", "#C05F5F"];
                        } else {
                            // cdf
                            text = "F(" + x + ") = " + y;
                            color = ["#eef", "#ddf", "#4A4AC0"];
                        }
                        showTooltip(item.pageX, item.pageY, text, color);
                    }
                }
                else {
                    $("#jstat_tooltip").remove();
                    previousPoint = null;
                }
            });
            $(this._container).bind("mouseleave", function() {
                if($('#jstat_tooltip').is(':visible')) {
                    $('#jstat_tooltip').remove();
                    previousPoint = null;
                }
            });
        } else {
            // unbind
            if(this._options.grid == null) {
                this._options.grid = {
                    hoverable: false
                }
            } else {
                this._options.grid.hoverable = false
            }
            $(this._container).unbind("plothover");
        }

        this.render();
    },
    setType: function(type) {
        this._plotType = type;
        var lines = {};
        var points = {};
        if(this._plotType == 'line') {
            lines.show = true;
            points.show = false;
        } else if(this._plotType == 'points') {
            lines.show = false;
            points.show = true;
        } else if(this._plotType == 'both') {
            lines.show = true;
            points.show = true;
        }
        if(this._options.series == null) {
            this._options.series = {
>>>>>>> e6f6a6f... visualisation.js added
                lines: lines,
                points: points
            }
        } else {
<<<<<<< HEAD
            if(obj._options.series.lines == null) {
                obj._options.series.lines = lines;
            } else {
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
=======
            if(this._options.series.lines == null) {
                this._options.series.lines = lines;
            } else {
                this._options.series.lines.show = lines.show;
            }
            if(this._options.series.points == null) {
                this._options.series.points = points;
            } else {
                this._options.series.points.show = points.show;
            }
        }

        this.render();
    },
    setFill: function(bool) {
        this._fill = bool;
        if(this._options.series == null) {
            this._options.series = {
>>>>>>> e6f6a6f... visualisation.js added
                lines: {
                    fill: bool
                }
            }
        } else {
<<<<<<< HEAD
            if(obj._options.series.lines == null) {
                obj._options.series.lines = {
                    fill: bool
                }
            } else {
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
=======
            if(this._options.series.lines == null) {
                this._options.series.lines = {
                    fill: bool
                }
            } else {
                this._options.series.lines.fill = bool;
            }
        }
        this.render();
    },
    clear: function() {
        this._super();
        this._distribution = null;
        this._pdfValues = [];
        this._cdfValues = [];
        this.render();
    },
    _generateValues: function() {
        this._cdfValues = [];     // reinitialize the arrays.
        this._pdfValues = [];

     //   var xs = this._range.getPoints();

      xs=this._range;
        this._options.xaxis = {
            min: xs[0],
            max: xs[xs.length-1]
        }
        var pdfs = this._distribution.pdf(this._range);
      //  var cdfs = this._distribution.cdf(this._range);
        for(var i = 0; i < xs.length; i++) {
            if(pdfs[i] == Number.POSITIVE_INFINITY || pdfs[i] == Number.NEGATIVE_INFINITY) {
                pdfs[i] = null;
            }
            if(cdfs[i] == Number.POSITIVE_INFINITY || cdfs[i] == Number.NEGATIVE_INFINITY) {
                cdfs[i] = null;
            }
            this._pdfValues.push([xs[i], pdfs[i]]);
            this._cdfValues.push([xs[i], cdfs[i]]);
        }
        return jstat.max(pdfs);
    },
    showPDF: function() {
        this._showPDF = true;
        this.render();
    },
    hidePDF: function() {
        this._showPDF = false;
        this.render();
    },
    showCDF: function() {
        this._showCDF = true;
        this.render();
    },
    hideCDF: function() {
        this._showCDF = false;
        this.render();
    },
    setDistribution: function(distribution, range) {
        this._distribution = distribution;
      //  if(range != null) {
            this._range = range;
       // } else {
         //   this._range = distribution.getRange();
        //}
        this._maxY = this._generateValues();
        this._options.yaxis = {
            max: this._maxY*1.1
        }

        this.render();
    },
    getDistribution: function() {
        return this._distribution;
    },
    getRange: function() {
        return this._range;
    },
    setRange: function(range) {
        this._range = range;
        this._generateValues();
        this.render();
    },
    render: function() {
        if(this._distribution != null) {
            if(this._showPDF && this._showCDF) {
                this.setData([{
                    yaxis: 1,
                    data:this._pdfValues,
                    color: 'rgb(237,194,64)',
                    clickable: false,
                    hoverable: true,
                    label: "PDF"
                }, {
                    yaxis: 2,
                    data:this._cdfValues,
                    clickable: false,
                    color: 'rgb(175,216,248)',
                    hoverable: true,
                    label: "CDF"
                }]);
                this._options.yaxis = {
                    max: this._maxY*1.1
                }
            } else if(this._showPDF) {
                this.setData([{
                    data:this._pdfValues,
                    hoverable: true,
                    color: 'rgb(237,194,64)',
                    clickable: false,
                    label: "PDF"
                }]);
                this._options.yaxis = {
                    max: this._maxY*1.1
                }
            } else if(this._showCDF) {
                this.setData([{
                    data:this._cdfValues,
                    hoverable: true,
                    color: 'rgb(175,216,248)',
                    clickable: false,
                    label: "CDF"
                }]);
                this._options.yaxis = {
                    max: 1.1
                }
            }
        } else {
            this.setData([]);
        }
        this._super();  // Call the parent plot method
    }
});

/*var DistributionFactory = {};
DistributionFactory.build = function(json) {
    /*
    if(json.name == null) {
        try{
            json = JSON.parse(json);
        }
        catch(err) {
            throw "invalid JSON";
        }

    // try to parse it
    }*/

    /*
    if(json.name != null) {
        var name = json.name;
    } else {
        throw "Malformed JSON provided to DistributionBuilder " + json;
    }
     */
/*    if(json.NormalDistribution) {
        if(json.NormalDistribution.mean != null && json.NormalDistribution.standardDeviation != null) {
            return new NormalDistribution(json.NormalDistribution.mean[0], json.NormalDistribution.standardDeviation[0]);
        } else {
            throw "Malformed JSON provided to DistributionBuilder " + json;
        }
    } else if (json.LogNormalDistribution) {
        if(json.LogNormalDistribution.location != null && json.LogNormalDistribution.scale != null) {
            return new LogNormalDistribution(json.LogNormalDistribution.location[0], json.LogNormalDistribution.scale[0]);
        } else {
            throw "Malformed JSON provided to DistributionBuilder " + json;
        }
    } else if (json.BetaDistribution) {
        if(json.BetaDistribution.alpha != null && json.BetaDistribution.beta != null) {
            return new BetaDistribution(json.BetaDistribution.alpha[0], json.BetaDistribution.beta[0]);
        } else {
            throw "Malformed JSON provided to DistributionBuilder " + json;
        }
    } else if (json.GammaDistribution) {
        if(json.GammaDistribution.shape != null && json.GammaDistribution.scale != null) {
            return new GammaDistribution(json.GammaDistribution.shape[0], json.GammaDistribution.scale[0]);
        } else {
            throw "Malformed JSON provided to DistributionBuilder " + json;
        }
    } else if (json.StudentTDistribution) {
        if(json.StudentTDistribution.degreesOfFreedom != null && json.StudentTDistribution.nonCentralityParameter != null) {
            return new StudentTDistribution(json.StudentTDistribution.degreesOfFreedom[0], json.StudentTDistribution.nonCentralityParameter[0]);
        } else if(json.StudentTDistribution.degreesOfFreedom != null) {
            return new StudentTDistribution(json.StudentTDistribution.degreesOfFreedom[0]);
        } else {
            throw "Malformed JSON provided to DistributionBuilder " + json;
        }
    } else {
        throw "Malformed JSON provided to DistributionBuilder " + json;
    }
}*/
>>>>>>> e6f6a6f... visualisation.js added
