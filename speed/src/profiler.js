(function(Function, Array, document, window){
	var slice = Array.prototype.slice,
		funcList = {},
		funcRaw = [],
		objScanned = [],
		callStack = [],
		stackPtr = callStack;
	
	/**
	 * utility functions */
	function gDate(){
		return (new Date()).getTime();
	};
	function inArray(item, array){
		var i = -1,
			len = array.length;
		
		if(array.indexOf){
			return !(array.indexOf(item) === -1);
		};
		
		while(++i < len){
			if (array[i] === item){
				return true;
			};
		};
		return false;
	};
	function isObject(arg){
		return arg && arg instanceof Object && !(arg instanceof Array) && !arg.nodeType;
	};
	function isFunc(arg, item){
		return arg[item] && arg[item] instanceof Function && item !== 'constructor' && !inArray(arg[item], funcRaw);
	};
	
	/**
	 * global functions */
	function getStack(){
		return stackPtr.slice();
	};
	function getFunc(){
		var tmpList = {};
		for(var inX in funcList){
			if(funcList[inX].length > 0){
				tmpList[inX] = funcList[inX].slice();
			};
		};
		return tmpList;
	};
	function getOverview(){
		var tmpObj = {},
			_totalRun_ = 0,
			_totalTime_ = 0,
			inX, arrLen;
		for(inX in funcList){
			if(funcList[inX].length > 0){
				tmpObj[inX] = { time: 0 };
				for(arrLen = funcList[inX].length - 1; arrLen >= 0; arrLen--){
					tmpObj[inX].time += funcList[inX][arrLen].time;
				};
				_totalTime_ += tmpObj[inX].time;
				_totalRun_ += tmpObj[inX].run = funcList[inX].length;
			};
		};
		
		tmpObj._totalRun_ = _totalRun_;
		tmpObj._totalTime_ = _totalTime_;
		
		return tmpObj;
	};
	
	/**
	 * recursive duck punch, away! */
	(function replaceMe(arg, depth, name, intStackPtr){
		var cname, item;
		
		// over ride stack pointer
		if(intStackPtr){
			var _stackPtr = stackPtr;
			stackPtr = intStackPtr;
		};
		
		for(item in arg){
			cname = (name ? name + (!isNaN(item) ? '' : '.') : '') + (!isNaN(item) ? ( item.length === 0 ? "['']" : '[' + item + ']') : item);
			
			// check if item is function
			if(isFunc(arg, item))(function(arg, item, cname){
				var _func = arg[item],
					inX;
				
				_func.prototype = arg[item].prototype;
				_func.constructor = arg[item].constructor;
				
				if(!funcList[cname]){
					funcList[cname] = [];
				};
				
				// reassign the function
				arg[item] = (function(){
					return function(){
						var tempObject = {
								args: slice.call(arguments),
								calls: [],
								method: _func,
								methodName: item || '(?)',
								parent: stackPtr
							};
						
// ### Causing problems for some callback functionality (e.g. jQuery UI Draggable)
						(function(stackPtr){
							replaceMe(tempObject.args, 0, cname + '.arguments', stackPtr);
						})(stackPtr);
						
						stackPtr.push(tempObject);
						stackPtr = tempObject.calls;
						
						// time function and store output
						tempObject.time = -(tempObject.startTime = gDate());
						tempObject.output = _func.apply(this, tempObject.args);
						tempObject.time += tempObject.endTime = gDate();
						
						// update the specific funcList object
						funcList[cname].push(tempObject);
						
						stackPtr = tempObject.parent;
						delete tempObject.parent;
						
						return tempObject.output;
					};
				})();
				
				arg[item].prototype = _func.prototype;
				arg[item].constructor = _func.constructor;
				
				if(isObject(_func)){
					for(inX in _func){
						arg[item][inX] = _func[inX];
					};
				};
				
				funcRaw.push(_func);
			})(arg, item, cname);
			
			// check if should recurse into object
			if(depth > 0 && isObject(arg[item]) && !inArray(arg[item], objScanned)){
				objScanned.push(arg[item]);
				replaceMe(arg[item], depth - 1, cname, true);
			};
		};
		
		// restore stack pointer
		if(intStackPtr){
			stackPtr = _stackPtr;
		};
		
	})(window, 3);
	
	// create profiler object and expose to global
	window.jsProfiler = {
		funcList: funcList,
		getFunc: getFunc,
		getOverview: getOverview,
		getStack: getStack
	};
	
})(Function, Array, document, window);