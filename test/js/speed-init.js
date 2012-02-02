/* initializing the page and running tests */
jQuery(function($){
	
// Add commas separators to a value
function addCommas(nStr){
	return Math.floor(nStr) == nStr ?	// Only using == in case string is passed
		(nStr+'').replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")
	: (nStr+'').replace(/(\d)(?=(\d\d\d)+(?!\d)\.)/g, "$1,");
};



// setup page structure
$.jqml(['div', {'id':'calper-init', 'class':'main-holder'},
	['h1', 'enter options'],
	['div',
		['div', {'class':'init-options'},
			['label', {'for':'calper-con-int'}, 'Confidence Interval:'],
			['input', {'id':'calper-con-int', 'type':'text', 'value':'0.9'}]
		],
		['div', {'class':'init-options'},
			['label', {'for':'calper-run'}, 'Runtime:'],
			['input', {'id':'calper-run', 'type':'text', 'value':'130'}]
		],
		['div', {'class':'init-options'},
			['label', {'for':'calper-run-del'}, 'Run Delay:'],
			['input', {'id':'calper-run-del', 'type':'text', 'value':'100'}]
		],
		['div', {'class':'line-clear'}]
	],
	['button', {'class':'select-all'}, 'select all'],
	['h1', 'select tests to run'],
	(function(){
		var rArr = ['div'],
			objlist = [
				// core.js
				['jStat.seq', 'jStat-seq'],
				//['jStat.add', 'jStat-add'],
				//['jStat.divide', 'jStat-divide'],
				//['jStat.multiply', 'jStat-multiply'],
				//['jStat.subtract', 'jStat-subtract'],
				//['jStat.dot', 'jStat-dot'],
				//['jStat.pow', 'jStat-pow'],
				//['jStat.abs', 'jStat-abs'],
				//['jStat.clear', 'jStat-clear'],
				//['jStat.norm', 'jStat-norm'],
				//['jStat.angle', 'jStat-angle'],
				//['jStat.symmetric', 'jStat-symmetric'],
				['jStat.sum', 'jStat-sum'],
				['jStat.sumsqrd', 'jStat-sumsqrd'],
				['jStat.sumsqerr', 'jStat-sumsqerr'],
				['jStat.product', 'jStat-product'],
				['jStat.min', 'jStat-min'],
				['jStat.max', 'jStat-max'],
				['jStat.mean', 'jStat-mean'],
				['jStat.meansqerr', 'jStat-meansqerr'],
				['jStat.geomean', 'jStat-geomean'],
				['jStat.median', 'jStat-median'],
				['jStat.mode', 'jStat-mode'],
				['jStat.range', 'jStat-range'],
				['jStat.variance', 'jStat-variance'],
				['jStat.stdev', 'jStat-stdev'],
				['jStat.meandev', 'jStat-meandev'],
				['jStat.meddev', 'jStat-meddev'],
				['jStat.quartiles', 'jStat-quartiles'],
				['jStat.covariance', 'jStat-covariance'],
				['jStat.corrcoeff', 'jStat-corrcoeff'],

				// special.js
				['jStat.gammaln', 'jStat-gammaln'],
				['jStat.gammafn', 'jStat-gammafn'],
				['jStat.gammap', 'jStat-gammap'],
				['jStat.factorialln', 'jStat-factorialln'],
				['jStat.factorial', 'jStat-factorial'],
				['jStat.combination', 'jStat-combination'],
				['jStat.permutation', 'jStat-permutation'],
				['jStat.betafn', 'jStat-betafn']
			];
		$.each(objlist, function(idx, val){
			rArr.push(['div', {'class':'init-choices'},
				['input', {'id':val[1], 'type':'checkbox'}],
				['label', {'for':val[1]}, val[0]]
			]);
		});
		rArr.push(['div', {'class':'line-clear'}]);
		
		return rArr;
	})(),
	['div', {'class':'baseline-content'}],
	['button', {'id':'init-start', 'class':'hoverable'}, 'Run Tests'],
	['div', {'class':'line-clear'}]
]).appendTo('body');


// select all functionality
$('.select-all').click(function selectall(){
	$('.init-choices :checkbox').prop('checked', true);
	$(this).text('deselect all').unbind('click').click(function(){
		$('.init-choices :checkbox').prop('checked', false);
		$(this).text('select all').unbind('click').click(selectall);
	});
});


// bind Run Tests
$('#init-start').click(function(e){
	e.preventDefault();

	// check for selected tests
	var itemsChecked = $('#calper-init input:checked');
	if(itemsChecked.length > 0){
		
		// animate box removal
		$('#calper-init').fadeOut(500, function(){
			// run calper setup based on values
			Calper.setup({
				cint: $('#calper-con-int').val(),
				rtime: $('#calper-run').val(),
				idelay: $('calper-run-del').val()
			});
			
			// load tests based on what was checked
			itemsChecked.each(function( idx, elem ) {
				jStatTest[ $( elem ).attr( 'id' ).split( '-' )[1]]();
			});
			
			// build testing box, and begin testing
			buildTest();
		});
	}else{
		$jqml(['div', {'class':'error-overlay', 'style':'display:none;'}, 'Please select at least one test']).appendTo('body').fadeIn(200, function(){
			setTimeout(function(){
				$('.error-overlay').fadeOut(200, function(){
					$(this).remove();
				});
			}, 1000);
		});
	};
});



function buildTest(){
	
	var stoVar;
	
	// create the box
	$.jqml(['div', {'class':'main-holder','style':'display:none;'},
		['button', {'id':'test-button'}, 'Start'],
		['p', {'id':'rem-time'}],
		['p', {'id':'calper-running'}, 'Running Tests...'],
		['table', {'id':'test-table'},
			['thead',
				['tr',
					['th', {'class': 'calper-data-header'}, 'Mean'],
					['th', {'class': 'calper-data-header'}, 'StDev'],
					['th', {'class': 'calper-data-header'}, 'Min'],
					['th', {'class': 'calper-data-header'}, 'Max'],
					['th', {'class': 'calper-data-header data-graph'}, 'Graph']
				]
			],
			['tbody', {'id': 'calper-table'}]
		],
		['p', {'id':'calper-footer'}, 'All results are in itterations/sec.']
	]).appendTo('body').fadeIn(250, function() {
		// setup interactions
		$('#test-button').click(function(){
			var $this = $(this);
			if($this.text() == 'Start'){
				$this.text('Stop');
				(function showTime(){
					$('#rem-time').text('Approx. Time Remaining: ' + (function(time){
						var sec, min;
						time /= 1000;
						sec = Math.floor(time % 60);
						min = Math.floor(time / 60);
						return (time > 0) ? (min + ':' +  ((sec < 10) ? '0' + sec : sec)) : (function(){
							setTimeout(function(){
								clearTimeout(stoVar);
							}, 0);
							return '0:00';
						})();
						
					})(Calper.runtime()));
					stoVar = setTimeout(showTime, 3000);
				})();
				start();
			}else{
				$this.text('Start');
				clearTimeout(stoVar);
				stop();
			};
		}).click();
	});
	
};




// setup tests to run
Calper.testDone = function(val){
	var res = val.results;
	$.jqml([
		['tr',
			['td', {'colspan': 5, 'class':'calper-data-title'}, val.name]
		],['tr', {'class': 'calper-data-row'},
			['td', addCommas((res.mean).toFixed(2))],
			['td', addCommas((res.stdev).toFixed(2))],
			['td', addCommas((res.min).toFixed(2))],
			['td', addCommas((res.max).toFixed(2))],
			['td', {'class':'data-graph'}, ['span', {'id':'tmp-graph-select'}]]
		]
	]).appendTo('#calper-table');
	
	$('#tmp-graph-select').sparkline(val.cal, {
		width: '350px',
		height: '35px',
		spotColor: false,
		fillColor: false,
		minSpotColor: false,
		maxSpotColor: false
	}).removeAttr('id');
};

Calper.done = function(){
	$('#calper-running').text('Tests Completed');
};



function otherTest(){
	test('testAsync', function(){
		setTimeout(function(){
			window.async();
		}, 0);
	}, 'async');
};

});
