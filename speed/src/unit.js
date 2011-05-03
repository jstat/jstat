/**
 * Calper - JavaScript Browser/Source Benchmark
 * Copyright 2010, Trevor Norris
 * This document is licensed as free software under the terms of the
 * MIT License: http://www.opensource.org/licenses/mit-license.php */
(function(Math, window, undefined){

	/**
	 * configuration options */
var config = {
		cint: 0.8,		// confidence interval to use in testing
		rtime: 85,		// minimum time in ms test itteration must run
		idelay: 135		// delay used when calling functions with setTimeout
	},
	/**
	 * private configuration vars */
	crnt = 0,		// idx of currently running object
	stoval = 0,		// value of current setTimeout
	objQueue = [],	// array of all Calper objects created
	/**
	 * global function quick reference */
	slice = Array.prototype.slice;




/**
 * minimum of an array */
function min(arr){
	return Math.min.apply(Math, arr);
};
/**
 * maximum of an array */
function max(arr){
	return Math.max.apply(Math, arr);
};
/**
 * mean of an array */
function mean(arr){
	var sm = 0,
		i = arr.length;
	while(--i >= 0){
		sm += arr[i];
	};
	return sm / arr.length;
};
/**
 * standard deviation of an array */
function stdev(arr){
	var mmean = mean(arr),
		stSum = 0,
		i = arr.length;
	while(--i >= 0){
		stSum += Math.pow((arr[i] - mmean), 2);
	};
	return Math.sqrt(stSum / (arr.length - 1));
};
/**
 * return timestamp */
function gDate(){
	return (new Date()).getTime();
};
/**
 * confidence interval itterations */
function rCint(val){
	return Math.ceil(1 / Math.pow((1 - val), 2));
};




/**
 * itterate test */
function testItter(func, args, cntx, itter, type, clbk){
	var iniTime;
	args = args.slice(0);	// clone arguments array
	
	// check if asynchronous test
	if(type == 'async'){
		window.async = function(){	// adding async function to global namespace for callback
			iniTime = gDate() - iniTime;
			window.async = null;	// cleanup
			clbk.call(this, iniTime);
		};
		iniTime = gDate();
		func.apply(cntx, args);
	
	// or if tested externally
	}else if(type == 'outer'){
		iniTime = gDate();			// store initial time
		for(; itter > 0; itter--){	// itterate externally
			func.apply(cntx, args);
		};
		clbk.call(this, gDate() - iniTime);
	
	// otherwise must be tested internally
	}else{
		args.unshift(itter);	// add itter to beginning of arguments list
		iniTime = gDate();		// store initial time
		func.apply(cntx, args);	// itterate internally
		clbk.call(this, gDate() - iniTime);
	};
};
/**
 * generate the number of needed itterations */
function genItter(func, args, cntx, rtime, type, clbk){
	var itter = 1,
		itime = 120;	// internal time hard limit; for quick ref
	
	if(type == 'async'){
		clbk.call(this, 1);
		return;
	};
	
	(function genTest(){
		testItter(func, args, cntx, itter, type, function(timeDf){
			
			// check against test delay
			if(timeDf < rtime){
				itter = (timeDf >= itime) ?	// is time difference less than test time
					timeDf < rtime ?	// check if time difference is less than minimum run time
						
						// return the difference in itterations from the number run
						itter + Math.ceil((itter / timeDf) * (rtime - timeDf))
					: itter		// return same number of itterations as before
				: itter * 10;	// return 10x's the number of itterations
				genTest();
			}else{
				
				// return the number of calculated itterations
				clbk.call(this, itter);
			};
		});
	})();
};
/**
 * generate results from a test */
function genResults(arr){
	return {
		min: min(arr),
		max: max(arr),
		mean: mean(arr),
		stdev: stdev(arr)
	};
};




/**
 * main object
 * Usage:
 *  var nVar = new Calper(name, function, func_args, context, type); */
function Calper(name, func, args, cntx, type){
	var ts = this;		// useful for compression
	
	// passed opts
	ts.name = name;		// test name
	ts.func = func;		// function to test
	ts.args = args;		// arguments to pass to function
	ts.cntx = cntx;		// context of 'this'
	ts.type = type;		// 'inner', 'outer' or 'async'

	// globals opts
	ts.cint = config.cint;			// confidence interval
	ts.idelay = config.idelay;		// delay between tests
	ts.rtime = config.rtime;		// target runtime for tests
	ts.cloop = rCint(config.cint);	// runs remaining

	// generated later
	ts.results = null;	// statistical results from completed tests
	ts.cal = [];	// runtime data in itterations/ms
	ts.raw = [];	// raw data

	/**
	 * run single test and return results */
	ts.run = function(){
		
		// initialization
		Calper.testStart(ts);
		genItter(ts.func, ts.args, ts.cntx, ts.rtime, ts.type, function(itter){
			ts.itter = itter;
			
			// reassign ts.run() after finishing initialization
			ts.run = function(){
				testItter(ts.func, ts.args, ts.cntx, ts.itter, ts.type, function(time){
					ts.raw.push(time);	// push raw runtime
					ts.cal.push(ts.itter / time * 1000);	// push converted time
					ts.cloop--;	// decrement loop count;
					start();	// run next test
				});
				return ts;
			};
			start();	// run next test
		});
		return ts;
	};

	return ts;
};
/**
 * calculate approximate remaining runtime
 * Usage:
 *  Calper.runtime(); */
Calper.runtime = function(){
	var tTime = 0,
		qlen = objQueue.length,
		qtmp;
	while(--qlen >= 0){
		qtmp = objQueue[qlen];
		tTime += qtmp.cloop * (qtmp.rtime / 2 + qtmp.idelay);
	};
	return tTime;
};
/**
 * change default setup, or reset to defaults
 * Usage:
 *  Calper.setup([options]); */
Calper.setup = function(opts){
	if(opts){
		config.cint = opts.cint || config.cint;
		config.rtime = opts.rtime || config.rtime;
		config.idelay = opts.idelay || config.idelay;
	}else{
		config.cint = 0.8;
		config.rtime = 80;
		config.idelay = 130;
	};
	return config;
};
/**
 * return the queue array, or a single one based on name
 * careful: alterations will effect stored element
 * Usage:
 *  Calper.queue([arg]); */
Calper.queue = function(arg){
	var key;
	if(arg){
		for(key in objQueue){
			if(objQueue[key].name == arg){
				return objQueue[key];
			};
		};
		return false;	// specified object does not exist
	}else{
		return objQueue;
	};
};
/**
 * before the first test beings */
Calper.begin = function(){};
/**
 * after all tests complete */
Calper.done = function(){};
/**
 * when any tests starts */
Calper.testStart = function(){};
/**
 * when any test finishes */
Calper.testDone = function(){};





/**
 * add test to queue; return generated Calper object
 * Usage:
 *  test(name, function[, arguments][, context][, type]) */
function test(){
	var parg = slice.call(arguments),
		name = parg.shift(),
		func = parg.shift(),
		args = (parg[0] && parg[0].join) ? parg.shift().slice(0) : [],
		cntx = (typeof parg[0] == 'object') ? parg.shift() : window,
		type = (typeof parg[0] == 'string') ? parg.shift() : 'outer',
		ncalper = new Calper(name, func, args, cntx, type);	// create new test object
	objQueue.push(ncalper);	// push test object to queue
	return ncalper;			// return newly created object
};
/**
 * start running queue */
var start = function(){
	Calper.begin();
	(start = function(){			// reassigning/running start()
		var obj = objQueue[crnt];	// quick ref to current object
		(function(obj){
			if(obj && obj.cloop > 0){
				stoval = setTimeout(function(){
					obj.run();			// run test
					obj.cloop--;		// decrement count
				}, obj.idelay);
			}else{
				obj.results = genResults(obj.cal);	// generate results from tests
				Calper.testDone(obj);	// alerting/sending completed test
				if(objQueue[++crnt]){	// increment counter and check next queue item
					start();			// run again
				}else{
					Calper.done();		// all tests have completed
				};
			};
		})(obj)
	})();
};
/**
 * stop running queue */
function stop(){
	clearTimeout(stoval);
};




/**
 * expose needed functionality */
window.Calper = Calper;
window.test = test;
window.start = start;
window.stop = stop;

})(Math, window);
