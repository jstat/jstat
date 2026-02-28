(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.jStat = factory());
})(this, (function () { 'use strict';

  // For quick reference.
  const concat = Array.prototype.concat;
  const slice = Array.prototype.slice;
  const toString = Object.prototype.toString;

  // Calculate correction for IEEE error
  // TODO: This calculation can be improved.
  function calcRdx(n, m) {
    const val = n > m ? n : m;
    return Math.pow(10, 17 - ~~(Math.log(val > 0 ? val : -val) * Math.LOG10E));
  }

  const isArray$2 = Array.isArray;

  function isFunction$1(arg) {
    return toString.call(arg) === '[object Function]';
  }

  function isNumber$1(num) {
    return typeof num === 'number' ? num - num === 0 : false;
  }

  // Converts the jStat matrix to vector.
  function toVector(arr) {
    return concat.apply([], arr);
  }

  // The one and only jStat constructor.
  function jStat(...args) {
    return new jStat._init(args);
  }

  // TODO: Remove after all references in src files have been removed.
  jStat.fn = jStat.prototype;

  // By separating the initializer from the constructor it's easier to handle
  // always returning a new instance whether "new" was used or not.
  jStat._init = function _init(args) {
    // If first argument is an array, must be vector or matrix.
    if (isArray$2(args[0])) {
      // Check if matrix.
      if (isArray$2(args[0][0])) {
        // See if a mapping function was also passed.
        if (isFunction$1(args[1])) args[0] = jStat.map(args[0], args[1]);
        // Iterate over each is faster than this.push.apply(this, args[0].
        for (let i = 0; i < args[0].length; i++) this[i] = args[0][i];
        this.length = args[0].length;

        // Otherwise must be a vector.
      } else {
        this[0] = isFunction$1(args[1]) ? jStat.map(args[0], args[1]) : args[0];
        this.length = 1;
      }

      // If first argument is number, assume creation of sequence.
    } else if (isNumber$1(args[0])) {
      this[0] = jStat.seq.apply(null, args);
      this.length = 1;

      // Handle case when jStat object is passed to jStat.
    } else if (args[0] instanceof jStat) {
      // Duplicate the object and pass it back.
      return jStat(args[0].toArray());

      // Unexpected argument value, return empty jStat object.
      // TODO: This is strange behavior. Shouldn't this throw or some such to let
      // the user know they had bad arguments?
    } else {
      this[0] = [];
      this.length = 1;
    }

    return this;
  };
  jStat._init.prototype = jStat.prototype;
  jStat._init.constructor = jStat;

  // Utility functions.
  // TODO: for internal use only?
  jStat.utils = {
    calcRdx: calcRdx,
    isArray: isArray$2,
    isFunction: isFunction$1,
    isNumber: isNumber$1,
    toVector: toVector
  };

  jStat._random_fn = Math.random;
  jStat.setRandom = function setRandom(fn) {
    if (typeof fn !== 'function') throw new TypeError('fn is not a function');
    jStat._random_fn = fn;
  };

  // Easily extend the jStat object.
  // TODO: is this seriously necessary?
  jStat.extend = function extend(obj, ...rest) {
    let i, j;

    if (rest.length === 0) {
      for (j in obj) jStat[j] = obj[j];
      return this;
    }

    for (i = 0; i < rest.length; i++) {
      for (j in rest[i]) obj[j] = rest[i][j];
    }

    return obj;
  };

  // Returns the number of rows in the matrix.
  jStat.rows = function rows(arr) {
    return arr.length || 1;
  };

  // Returns the number of columns in the matrix.
  jStat.cols = function cols(arr) {
    return arr[0].length || 1;
  };

  // Returns the dimensions of the object { rows: i, cols: j }
  jStat.dimensions = function dimensions(arr) {
    return {
      rows: jStat.rows(arr),
      cols: jStat.cols(arr)
    };
  };

  // Returns a specified row as a vector or return a sub matrix by pick some rows
  jStat.row = function row(arr, index) {
    if (isArray$2(index)) {
      return index.map((i) => jStat.row(arr, i));
    }
    return arr[index];
  };

  // return row as array
  // rowa([[1,2],[3,4]],0) -> [1,2]
  jStat.rowa = function rowa(arr, i) {
    return jStat.row(arr, i);
  };

  // Returns the specified column as a vector or return a sub matrix by pick some
  // columns
  jStat.col = function col(arr, index) {
    if (isArray$2(index)) {
      const submat = jStat.arange(arr.length).map(() => new Array(index.length));
      index.forEach((ind, i) => {
        jStat.arange(arr.length).forEach((j) => {
          submat[j][i] = arr[j][ind];
        });
      });
      return submat;
    }
    const column = new Array(arr.length);
    for (let i = 0; i < arr.length; i++) column[i] = [arr[i][index]];
    return column;
  };

  // return column as array
  // cola([[1,2],[3,4]],0) -> [1,3]
  jStat.cola = function cola(arr, i) {
    return jStat.col(arr, i).map((a) => a[0]);
  };

  // Returns the diagonal of the matrix
  jStat.diag = function diag(arr) {
    const nrow = jStat.rows(arr);
    const res = new Array(nrow);
    for (let row = 0; row < nrow; row++) res[row] = [arr[row][row]];
    return res;
  };

  // Returns the anti-diagonal of the matrix
  jStat.antidiag = function antidiag(arr) {
    let nrow = jStat.rows(arr) - 1;
    const res = new Array(nrow);
    for (let i = 0; nrow >= 0; nrow--, i++) res[i] = [arr[i][nrow]];
    return res;
  };

  // Transpose a matrix or array.
  jStat.transpose = function transpose(arr) {
    const obj = [];
    let objArr, j, i;

    // Make sure arr is in matrix format.
    if (!isArray$2(arr[0])) arr = [arr];

    const rows = arr.length;
    const cols = arr[0].length;

    for (i = 0; i < cols; i++) {
      objArr = new Array(rows);
      for (j = 0; j < rows; j++) objArr[j] = arr[j][i];
      obj.push(objArr);
    }

    // If obj is vector, return only single array.
    return obj.length === 1 ? obj[0] : obj;
  };

  // Map a function to an array or array of arrays.
  // "toAlter" is an internal variable.
  jStat.map = function map(arr, func, toAlter) {
    let row, col;

    if (!isArray$2(arr[0])) arr = [arr];

    const nrow = arr.length;
    const ncol = arr[0].length;
    const res = toAlter ? arr : new Array(nrow);

    for (row = 0; row < nrow; row++) {
      // if the row doesn't exist, create it
      if (!res[row]) res[row] = new Array(ncol);
      for (col = 0; col < ncol; col++) res[row][col] = func(arr[row][col], row, col);
    }

    return res.length === 1 ? res[0] : res;
  };

  // Cumulatively combine the elements of an array or array of arrays using a function.
  jStat.cumreduce = function cumreduce(arr, func, toAlter) {
    let row, col;

    if (!isArray$2(arr[0])) arr = [arr];

    const nrow = arr.length;
    const ncol = arr[0].length;
    const res = toAlter ? arr : new Array(nrow);

    for (row = 0; row < nrow; row++) {
      // if the row doesn't exist, create it
      if (!res[row]) res[row] = new Array(ncol);
      if (ncol > 0) res[row][0] = arr[row][0];
      for (col = 1; col < ncol; col++) res[row][col] = func(res[row][col - 1], arr[row][col]);
    }
    return res.length === 1 ? res[0] : res;
  };

  // Destructively alter an array.
  jStat.alter = function alter(arr, func) {
    return jStat.map(arr, func, true);
  };

  // Generate a rows x cols matrix according to the supplied function.
  jStat.create = function create(rows, cols, func) {
    const res = new Array(rows);
    let i, j;

    if (isFunction$1(cols)) {
      func = cols;
      cols = rows;
    }

    for (i = 0; i < rows; i++) {
      res[i] = new Array(cols);
      for (j = 0; j < cols; j++) res[i][j] = func(i, j);
    }

    return res;
  };

  const retZero = () => 0;

  // Generate a rows x cols matrix of zeros.
  jStat.zeros = function zeros(rows, cols) {
    if (!isNumber$1(cols)) cols = rows;
    return jStat.create(rows, cols, retZero);
  };

  const retOne = () => 1;

  // Generate a rows x cols matrix of ones.
  jStat.ones = function ones(rows, cols) {
    if (!isNumber$1(cols)) cols = rows;
    return jStat.create(rows, cols, retOne);
  };

  // Generate a rows x cols matrix of uniformly random numbers.
  jStat.rand = function rand(rows, cols) {
    if (!isNumber$1(cols)) cols = rows;
    return jStat.create(rows, cols, jStat._random_fn);
  };

  const retIdent = (i, j) => (i === j ? 1 : 0);

  // Generate an identity matrix of size row x cols.
  jStat.identity = function identity(rows, cols) {
    if (!isNumber$1(cols)) cols = rows;
    return jStat.create(rows, cols, retIdent);
  };

  // Tests whether a matrix is symmetric
  jStat.symmetric = function symmetric(arr) {
    const size = arr.length;
    let row, col;

    if (arr.length !== arr[0].length) return false;

    for (row = 0; row < size; row++) {
      for (col = 0; col < size; col++) if (arr[col][row] !== arr[row][col]) return false;
    }

    return true;
  };

  // Set all values to zero.
  jStat.clear = function clear(arr) {
    return jStat.alter(arr, retZero);
  };

  // Generate sequence.
  jStat.seq = function seq(min, max, length, func) {
    if (!isFunction$1(func)) func = false;

    const arr = [];
    const hival = calcRdx(min, max);
    const step = (max * hival - min * hival) / ((length - 1) * hival);
    let current = min;
    let cnt;

    // Current is assigned using a technique to compensate for IEEE error.
    // TODO: Needs better implementation.
    for (
      cnt = 0;
      current <= max && cnt < length;
      cnt++, current = (min * hival + step * hival * cnt) / hival
    ) {
      arr.push(func ? func(current, cnt) : current);
    }

    return arr;
  };

  // arange(5) -> [0,1,2,3,4]
  // arange(1,5) -> [1,2,3,4]
  // arange(5,1,-1) -> [5,4,3,2]
  jStat.arange = function arange(start, end, step) {
    const rl = [];
    let i;
    step = step || 1;
    if (end === undefined) {
      end = start;
      start = 0;
    }
    if (start === end || step === 0) {
      return [];
    }
    if (start < end && step < 0) {
      return [];
    }
    if (start > end && step > 0) {
      return [];
    }
    if (step > 0) {
      for (i = start; i < end; i += step) {
        rl.push(i);
      }
    } else {
      for (i = start; i > end; i += step) {
        rl.push(i);
      }
    }
    return rl;
  };

  // A=[[1,2,3],[4,5,6],[7,8,9]]
  // slice(A,{row:{end:2},col:{start:1}}) -> [[2,3],[5,6]]
  // slice(A,1,{start:1}) -> [5,6]
  // as numpy code A[:2,1:]
  function _slice(list, start, end, step) {
    // note it's not equal to range.map mode it's a bug
    let i;
    const rl = [];
    const length = list.length;
    if (start === undefined && end === undefined && step === undefined) {
      return jStat.copy(list);
    }

    start = start || 0;
    end = end || list.length;
    start = start >= 0 ? start : length + start;
    end = end >= 0 ? end : length + end;
    step = step || 1;
    if (start === end || step === 0) {
      return [];
    }
    if (start < end && step < 0) {
      return [];
    }
    if (start > end && step > 0) {
      return [];
    }
    if (step > 0) {
      for (i = start; i < end; i += step) {
        rl.push(list[i]);
      }
    } else {
      for (i = start; i > end; i += step) {
        rl.push(list[i]);
      }
    }
    return rl;
  }

  jStat.slice = function slice(list, rcSlice) {
    let colSlice, rowSlice;
    rcSlice = rcSlice || {};
    if (isNumber$1(rcSlice.row)) {
      if (isNumber$1(rcSlice.col)) return list[rcSlice.row][rcSlice.col];
      const row = jStat.rowa(list, rcSlice.row);
      colSlice = rcSlice.col || {};
      return _slice(row, colSlice.start, colSlice.end, colSlice.step);
    }

    if (isNumber$1(rcSlice.col)) {
      const col = jStat.cola(list, rcSlice.col);
      rowSlice = rcSlice.row || {};
      return _slice(col, rowSlice.start, rowSlice.end, rowSlice.step);
    }

    rowSlice = rcSlice.row || {};
    colSlice = rcSlice.col || {};
    const rows = _slice(list, rowSlice.start, rowSlice.end, rowSlice.step);
    return rows.map((row) => _slice(row, colSlice.start, colSlice.end, colSlice.step));
  };

  // A=[[1,2,3],[4,5,6],[7,8,9]]
  // sliceAssign(A,{row:{start:1},col:{start:1}},[[0,0],[0,0]])
  // A=[[1,2,3],[4,0,0],[7,0,0]]
  jStat.sliceAssign = function sliceAssign(A, rcSlice, B) {
    let nl, ml;
    if (isNumber$1(rcSlice.row)) {
      if (isNumber$1(rcSlice.col)) return (A[rcSlice.row][rcSlice.col] = B);
      rcSlice.col = rcSlice.col || {};
      rcSlice.col.start = rcSlice.col.start || 0;
      rcSlice.col.end = rcSlice.col.end || A[0].length;
      rcSlice.col.step = rcSlice.col.step || 1;
      nl = jStat.arange(rcSlice.col.start, Math.min(A.length, rcSlice.col.end), rcSlice.col.step);
      const m = rcSlice.row;
      nl.forEach((n, i) => {
        A[m][n] = B[i];
      });
      return A;
    }

    if (isNumber$1(rcSlice.col)) {
      rcSlice.row = rcSlice.row || {};
      rcSlice.row.start = rcSlice.row.start || 0;
      rcSlice.row.end = rcSlice.row.end || A.length;
      rcSlice.row.step = rcSlice.row.step || 1;
      ml = jStat.arange(rcSlice.row.start, Math.min(A[0].length, rcSlice.row.end), rcSlice.row.step);
      const n = rcSlice.col;
      ml.forEach((m, j) => {
        A[m][n] = B[j];
      });
      return A;
    }

    if (B[0].length === undefined) {
      B = [B];
    }
    rcSlice.row.start = rcSlice.row.start || 0;
    rcSlice.row.end = rcSlice.row.end || A.length;
    rcSlice.row.step = rcSlice.row.step || 1;
    rcSlice.col.start = rcSlice.col.start || 0;
    rcSlice.col.end = rcSlice.col.end || A[0].length;
    rcSlice.col.step = rcSlice.col.step || 1;
    ml = jStat.arange(rcSlice.row.start, Math.min(A.length, rcSlice.row.end), rcSlice.row.step);
    nl = jStat.arange(rcSlice.col.start, Math.min(A[0].length, rcSlice.col.end), rcSlice.col.step);
    ml.forEach((m, i) => {
      nl.forEach((n, j) => {
        A[m][n] = B[i][j];
      });
    });
    return A;
  };

  // [1,2,3] ->
  // [[1,0,0],[0,2,0],[0,0,3]]
  jStat.diagonal = function diagonal(diagArray) {
    const mat = jStat.zeros(diagArray.length, diagArray.length);
    diagArray.forEach((t, i) => {
      mat[i][i] = t;
    });
    return mat;
  };

  // return copy of A
  jStat.copy = function copy(A) {
    return A.map((row) => {
      if (isNumber$1(row)) return row;
      return row.map((t) => t);
    });
  };

  // TODO: Go over this entire implementation. Seems a tragic waste of resources
  // doing all this work. Instead, and while ugly, use new Function() to generate
  // a custom function for each static method.

  // Quick reference.
  const jProto$1 = jStat.prototype;

  // Default length.
  jProto$1.length = 0;

  // For internal use only.
  // TODO: Check if they're actually used, and if they are then rename them
  // to _*
  jProto$1.push = Array.prototype.push;
  jProto$1.sort = Array.prototype.sort;
  jProto$1.splice = Array.prototype.splice;
  jProto$1.slice = Array.prototype.slice;

  // Return a clean array.
  jProto$1.toArray = function toArray() {
    return this.length > 1 ? slice.call(this) : slice.call(this)[0];
  };

  // Map a function to a matrix or vector.
  jProto$1.map = function map(func, toAlter) {
    return jStat(jStat.map(this, func, toAlter));
  };

  // Cumulatively combine the elements of a matrix or vector using a function.
  jProto$1.cumreduce = function cumreduce(func, toAlter) {
    return jStat(jStat.cumreduce(this, func, toAlter));
  };

  // Destructively alter an array.
  jProto$1.alter = function alter(func) {
    jStat.alter(this, func);
    return this;
  };

  // Extend prototype with methods that have no argument.
  for (const passfunc of 'transpose clear symmetric rows cols dimensions diag antidiag'.split(' ')) {
    jProto$1[passfunc] = function (func) {
      const self = this;
      // Check for callback.
      if (func) {
        setTimeout(() => {
          func.call(self, jProto$1[passfunc].call(self));
        });
        return this;
      }
      const results = jStat[passfunc](this);
      return isArray$2(results) ? jStat(results) : results;
    };
  }

  // Extend prototype with methods that have one argument.
  for (const passfunc of 'row col'.split(' ')) {
    jProto$1[passfunc] = function (index, func) {
      const self = this;
      // check for callback
      if (func) {
        setTimeout(() => {
          func.call(self, jProto$1[passfunc].call(self, index));
        });
        return this;
      }
      return jStat(jStat[passfunc](this, index));
    };
  }

  // Extend prototype with simple shortcut methods.
  for (const passfunc of 'create zeros ones rand identity'.split(' ')) {
    jProto$1[passfunc] = function (...args) {
      return jStat(jStat[passfunc].apply(null, args));
    };
  }

  const isFunction = jStat.utils.isFunction;

  // Ascending functions for sort
  const ascNum = (a, b) => a - b;

  const clip = (arg, min, max) => Math.max(min, Math.min(arg, max));

  // sum of an array
  jStat.sum = function sum(arr) {
    let total = 0;
    let i = arr.length;
    while (--i >= 0) total += arr[i];
    return total;
  };

  // sum squared
  jStat.sumsqrd = function sumsqrd(arr) {
    let sum = 0;
    let i = arr.length;
    while (--i >= 0) sum += arr[i] * arr[i];
    return sum;
  };

  // sum of squared errors of prediction (SSE)
  jStat.sumsqerr = function sumsqerr(arr) {
    const mean = jStat.mean(arr);
    let sum = 0;
    let i = arr.length;
    let tmp;
    while (--i >= 0) {
      tmp = arr[i] - mean;
      sum += tmp * tmp;
    }
    return sum;
  };

  // sum of an array in each row
  jStat.sumrow = function sumrow(arr) {
    let sum = 0;
    let i = arr.length;
    while (--i >= 0) sum += arr[i];
    return sum;
  };

  // product of an array
  jStat.product = function product(arr) {
    let prod = 1;
    let i = arr.length;
    while (--i >= 0) prod *= arr[i];
    return prod;
  };

  // minimum value of an array
  jStat.min = function min(arr) {
    let low = arr[0];
    let i = 0;
    while (++i < arr.length) if (arr[i] < low) low = arr[i];
    return low;
  };

  // maximum value of an array
  jStat.max = function max(arr) {
    let high = arr[0];
    let i = 0;
    while (++i < arr.length) if (arr[i] > high) high = arr[i];
    return high;
  };

  // unique values of an array
  jStat.unique = function unique(arr) {
    const hash = {};
    const _arr = [];
    for (let i = 0; i < arr.length; i++) {
      if (!hash[arr[i]]) {
        hash[arr[i]] = true;
        _arr.push(arr[i]);
      }
    }
    return _arr;
  };

  // mean value of an array
  jStat.mean = function mean(arr) {
    return jStat.sum(arr) / arr.length;
  };

  // mean squared error (MSE)
  jStat.meansqerr = function meansqerr(arr) {
    return jStat.sumsqerr(arr) / arr.length;
  };

  // geometric mean of an array
  jStat.geomean = function geomean(arr) {
    const logs = arr.map(Math.log);
    const meanOfLogs = jStat.mean(logs);
    return Math.exp(meanOfLogs);
  };

  // median of an array
  jStat.median = function median(arr) {
    const arrlen = arr.length;
    const _arr = arr.slice().sort(ascNum);
    // check if array is even or odd, then return the appropriate
    return !(arrlen & 1) ? (_arr[arrlen / 2 - 1] + _arr[arrlen / 2]) / 2 : _arr[(arrlen / 2) | 0];
  };

  // cumulative sum of an array
  jStat.cumsum = function cumsum(arr) {
    return jStat.cumreduce(arr, (a, b) => a + b);
  };

  // cumulative product of an array
  jStat.cumprod = function cumprod(arr) {
    return jStat.cumreduce(arr, (a, b) => a * b);
  };

  // successive differences of a sequence
  jStat.diff = function diff(arr) {
    const diffs = [];
    const arrLen = arr.length;
    let i;
    for (i = 1; i < arrLen; i++) diffs.push(arr[i] - arr[i - 1]);
    return diffs;
  };

  // ranks of an array
  jStat.rank = function (arr) {
    let i;
    const distinctNumbers = [];
    const numberCounts = {};
    for (i = 0; i < arr.length; i++) {
      const number = arr[i];
      if (numberCounts[number]) {
        numberCounts[number]++;
      } else {
        numberCounts[number] = 1;
        distinctNumbers.push(number);
      }
    }

    const sortedDistinctNumbers = distinctNumbers.sort(ascNum);
    const numberRanks = {};
    let currentRank = 1;
    for (i = 0; i < sortedDistinctNumbers.length; i++) {
      const number = sortedDistinctNumbers[i];
      const count = numberCounts[number];
      const first = currentRank;
      const last = currentRank + count - 1;
      const rank = (first + last) / 2;
      numberRanks[number] = rank;
      currentRank += count;
    }

    return arr.map((number) => numberRanks[number]);
  };

  // mode of an array
  // if there are multiple modes of an array, return all of them
  // is this the appropriate way of handling it?
  jStat.mode = function mode(arr) {
    const arrLen = arr.length;
    const _arr = arr.slice().sort(ascNum);
    let count = 1;
    let maxCount = 0;
    let numMaxCount = 0;
    let mode_arr = [];
    let i;

    for (i = 0; i < arrLen; i++) {
      if (_arr[i] === _arr[i + 1]) {
        count++;
      } else {
        if (count > maxCount) {
          mode_arr = [_arr[i]];
          maxCount = count;
          numMaxCount = 0;
        }
        // are there multiple max counts
        else if (count === maxCount) {
          mode_arr.push(_arr[i]);
          numMaxCount++;
        }
        // resetting count for new value in array
        count = 1;
      }
    }

    return numMaxCount === 0 ? mode_arr[0] : mode_arr;
  };

  // range of an array
  jStat.range = function range(arr) {
    return jStat.max(arr) - jStat.min(arr);
  };

  // variance of an array
  // flag = true indicates sample instead of population
  jStat.variance = function variance(arr, flag) {
    return jStat.sumsqerr(arr) / (arr.length - (flag ? 1 : 0));
  };

  // pooled variance of an array of arrays
  jStat.pooledvariance = function pooledvariance(arr) {
    const sumsqerr = arr.reduce((a, samples) => a + jStat.sumsqerr(samples), 0);
    const count = arr.reduce((a, samples) => a + samples.length, 0);
    return sumsqerr / (count - arr.length);
  };

  // deviation of an array
  jStat.deviation = function (arr) {
    const mean = jStat.mean(arr);
    const arrlen = arr.length;
    const dev = new Array(arrlen);
    for (let i = 0; i < arrlen; i++) {
      dev[i] = arr[i] - mean;
    }
    return dev;
  };

  // standard deviation of an array
  // flag = true indicates sample instead of population
  jStat.stdev = function stdev(arr, flag) {
    return Math.sqrt(jStat.variance(arr, flag));
  };

  // pooled standard deviation of an array of arrays
  jStat.pooledstdev = function pooledstdev(arr) {
    return Math.sqrt(jStat.pooledvariance(arr));
  };

  // mean deviation (mean absolute deviation) of an array
  jStat.meandev = function meandev(arr) {
    const mean = jStat.mean(arr);
    const a = [];
    for (let i = arr.length - 1; i >= 0; i--) {
      a.push(Math.abs(arr[i] - mean));
    }
    return jStat.mean(a);
  };

  // median deviation (median absolute deviation) of an array
  jStat.meddev = function meddev(arr) {
    const median = jStat.median(arr);
    const a = [];
    for (let i = arr.length - 1; i >= 0; i--) {
      a.push(Math.abs(arr[i] - median));
    }
    return jStat.median(a);
  };

  // coefficient of variation
  jStat.coeffvar = function coeffvar(arr) {
    return jStat.stdev(arr) / jStat.mean(arr);
  };

  // quartiles of an array
  jStat.quartiles = function quartiles(arr) {
    const arrlen = arr.length;
    const _arr = arr.slice().sort(ascNum);
    return [
      _arr[Math.round(arrlen / 4) - 1],
      _arr[Math.round(arrlen / 2) - 1],
      _arr[Math.round((arrlen * 3) / 4) - 1]
    ];
  };

  // Arbitary quantiles of an array. Direct port of the scipy.stats
  // implementation by Pierre GF Gerard-Marchant.
  jStat.quantiles = function quantiles(arr, quantilesArray, alphap = 3 / 8, betap = 3 / 8) {
    const sortedArray = arr.slice().sort(ascNum);
    const quantileVals = [quantilesArray.length];
    const n = arr.length;
    let i, p, m, aleph, k, gamma;

    for (i = 0; i < quantilesArray.length; i++) {
      p = quantilesArray[i];
      m = alphap + p * (1 - alphap - betap);
      aleph = n * p + m;
      k = Math.floor(clip(aleph, 1, n - 1));
      gamma = clip(aleph - k, 0, 1);
      quantileVals[i] = (1 - gamma) * sortedArray[k - 1] + gamma * sortedArray[k];
    }

    return quantileVals;
  };

  // Return the k-th percentile of values in a range, where k is in the range 0..1, inclusive.
  // Passing true for the exclusive parameter excludes both endpoints of the range.
  jStat.percentile = function percentile(arr, k, exclusive) {
    const _arr = arr.slice().sort(ascNum);
    const realIndex = k * (_arr.length + (exclusive ? 1 : -1)) + (exclusive ? 0 : 1);
    const index = parseInt(realIndex);
    const frac = realIndex - index;
    if (index + 1 < _arr.length) {
      return _arr[index - 1] + frac * (_arr[index] - _arr[index - 1]);
    } else {
      return _arr[index - 1];
    }
  };

  // The percentile rank of score in a given array. Returns the percentage
  // of all values in the input array that are less than (kind='strict') or
  // less or equal than (kind='weak') score. Default is weak.
  jStat.percentileOfScore = function percentileOfScore(arr, score, kind) {
    let counter = 0;
    const len = arr.length;
    let strict = false;
    let value, i;

    if (kind === 'strict') strict = true;

    for (i = 0; i < len; i++) {
      value = arr[i];
      if ((strict && value < score) || (!strict && value <= score)) {
        counter++;
      }
    }

    return counter / len;
  };

  // Histogram (bin count) data
  jStat.histogram = function histogram(arr, binCnt) {
    binCnt = binCnt || 4;
    const first = jStat.min(arr);
    const binWidth = (jStat.max(arr) - first) / binCnt;
    const len = arr.length;
    const bins = [];
    let i;

    for (i = 0; i < binCnt; i++) bins[i] = 0;
    for (i = 0; i < len; i++)
      bins[Math.min(Math.floor((arr[i] - first) / binWidth), binCnt - 1)] += 1;

    return bins;
  };

  // covariance of two arrays
  jStat.covariance = function covariance(arr1, arr2) {
    const u = jStat.mean(arr1);
    const v = jStat.mean(arr2);
    const arr1Len = arr1.length;
    const sq_dev = new Array(arr1Len);
    let i;

    for (i = 0; i < arr1Len; i++) sq_dev[i] = (arr1[i] - u) * (arr2[i] - v);

    return jStat.sum(sq_dev) / (arr1Len - 1);
  };

  // (pearson's) population correlation coefficient, rho
  jStat.corrcoeff = function corrcoeff(arr1, arr2) {
    return jStat.covariance(arr1, arr2) / jStat.stdev(arr1, 1) / jStat.stdev(arr2, 1);
  };

  // (spearman's) rank correlation coefficient, sp
  jStat.spearmancoeff = function (arr1, arr2) {
    arr1 = jStat.rank(arr1);
    arr2 = jStat.rank(arr2);
    //return pearson's correlation of the ranks:
    return jStat.corrcoeff(arr1, arr2);
  };

  // statistical standardized moments (general form of skew/kurt)
  jStat.stanMoment = function stanMoment(arr, n) {
    const mu = jStat.mean(arr);
    const sigma = jStat.stdev(arr);
    const len = arr.length;
    let skewSum = 0;

    for (let i = 0; i < len; i++) skewSum += Math.pow((arr[i] - mu) / sigma, n);

    return skewSum / arr.length;
  };

  // (pearson's) moment coefficient of skewness
  jStat.skewness = function skewness(arr) {
    return jStat.stanMoment(arr, 3);
  };

  // (pearson's) (excess) kurtosis
  jStat.kurtosis = function kurtosis(arr) {
    return jStat.stanMoment(arr, 4) - 3;
  };

  const jProto = jStat.prototype;

  // Extend jProto with method for calculating cumulative sums and products.
  // This differs from the similar extension below as cumsum and cumprod should
  // not be run again in the case fullbool === true.
  // If a matrix is passed, automatically assume operation should be done on the
  // columns.
  for (const passfunc of 'cumsum cumprod'.split(' ')) {
    // If a matrix is passed, automatically assume operation should be done on
    // the columns.
    jProto[passfunc] = function (fullbool, func) {
      const arr = [];
      let i = 0;
      let tmpthis = this;
      // Assignment reassignation depending on how parameters were passed in.
      if (isFunction(fullbool)) {
        func = fullbool;
        fullbool = false;
      }
      // Check if a callback was passed with the function.
      if (func) {
        setTimeout(() => {
          func.call(tmpthis, jProto[passfunc].call(tmpthis, fullbool));
        });
        return this;
      }
      // Check if matrix and run calculations.
      if (this.length > 1) {
        tmpthis = fullbool === true ? this : this.transpose();
        for (; i < tmpthis.length; i++) arr[i] = jStat[passfunc](tmpthis[i]);
        return arr;
      }
      // Pass fullbool if only vector, not a matrix. for variance and stdev.
      return jStat[passfunc](this[0], fullbool);
    };
  }

  // Extend jProto with methods which don't require arguments and work on columns.
  for (const passfunc of (
    'sum sumsqrd sumsqerr sumrow product min max unique mean meansqerr ' +
    'geomean median diff rank mode range variance deviation stdev meandev ' +
    'meddev coeffvar quartiles histogram skewness kurtosis'
  ).split(' ')) {
    // If a matrix is passed, automatically assume operation should be done on
    // the columns.
    jProto[passfunc] = function (fullbool, func) {
      const arr = [];
      let i = 0;
      let tmpthis = this;
      // Assignment reassignation depending on how parameters were passed in.
      if (isFunction(fullbool)) {
        func = fullbool;
        fullbool = false;
      }
      // Check if a callback was passed with the function.
      if (func) {
        setTimeout(() => {
          func.call(tmpthis, jProto[passfunc].call(tmpthis, fullbool));
        });
        return this;
      }
      // Check if matrix and run calculations.
      if (this.length > 1) {
        if (passfunc !== 'sumrow') tmpthis = fullbool === true ? this : this.transpose();
        for (; i < tmpthis.length; i++) arr[i] = jStat[passfunc](tmpthis[i]);
        return fullbool === true ? jStat[passfunc](jStat.utils.toVector(arr)) : arr;
      }
      // Pass fullbool if only vector, not a matrix. for variance and stdev.
      return jStat[passfunc](this[0], fullbool);
    };
  }

  // Extend jProto with functions that take arguments. Operations on matrices are
  // done on columns.
  for (const passfunc of 'quantiles percentileOfScore'.split(' ')) {
    jProto[passfunc] = function (...args) {
      const arr = [];
      let i = 0;
      let tmpthis = this;
      let callbackFunction;
      let curriedFunction;

      // If the last argument is a function, we assume it's a callback; we
      // strip the callback out and call the function again.
      if (isFunction(args[args.length - 1])) {
        callbackFunction = args[args.length - 1];
        const argsToPass = args.slice(0, args.length - 1);

        setTimeout(() => {
          callbackFunction.call(tmpthis, jProto[passfunc].apply(tmpthis, argsToPass));
        });
        return this;

        // Otherwise we curry the function args and call normally.
      } else {
        callbackFunction = undefined;
        curriedFunction = function curriedFunction(vector) {
          return jStat[passfunc].apply(tmpthis, [vector].concat(args));
        };
      }

      // If this is a matrix, run column-by-column.
      if (this.length > 1) {
        tmpthis = tmpthis.transpose();
        for (; i < tmpthis.length; i++) arr[i] = curriedFunction(tmpthis[i]);
        return arr;
      }

      // Otherwise run on the vector.
      return curriedFunction(this[0]);
    };
  }

  // Special functions //

  // Log-gamma function
  jStat.gammaln = function gammaln(x) {
    let j = 0;
    const cof = [
      76.18009172947146, -86.50532032941678, 24.01409824083091, -1.231739572450155,
      0.1208650973866179e-2, -5395239384953e-18
    ];
    let ser = 1.000000000190015;
    let xx, y, tmp;
    tmp = (y = xx = x) + 5.5;
    tmp -= (xx + 0.5) * Math.log(tmp);
    for (; j < 6; j++) ser += cof[j] / ++y;
    return Math.log((2.5066282746310005 * ser) / xx) - tmp;
  };

  /*
   * log-gamma function to support poisson distribution sampling. The
   * algorithm comes from SPECFUN by Shanjie Zhang and Jianming Jin and their
   * book "Computation of Special Functions", 1996, John Wiley & Sons, Inc.
   */
  jStat.loggam = function loggam(x) {
    let x0, gl, gl0;
    let k, n;

    const a = [
      8.333333333333333e-2, -0.002777777777777778, 7.936507936507937e-4, -5952380952380952e-19,
      8.417508417508418e-4, -0.001917526917526918, 6.41025641025641e-3, -0.02955065359477124,
      1.796443723688307e-1, -1.3924322169059
    ];
    x0 = x;
    n = 0;
    if (x === 1.0 || x === 2.0) {
      return 0.0;
    }
    if (x <= 7.0) {
      n = Math.floor(7 - x);
      x0 = x + n;
    }
    const x2 = 1.0 / (x0 * x0);
    const xp = 2 * Math.PI;
    gl0 = a[9];
    for (k = 8; k >= 0; k--) {
      gl0 *= x2;
      gl0 += a[k];
    }
    gl = gl0 / x0 + 0.5 * Math.log(xp) + (x0 - 0.5) * Math.log(x0) - x0;
    if (x <= 7.0) {
      for (k = 1; k <= n; k++) {
        gl -= Math.log(x0 - 1.0);
        x0 -= 1.0;
      }
    }
    return gl;
  };

  // gamma of x
  jStat.gammafn = function gammafn(x) {
    const p = [
      -1.716185138865495, 24.76565080557592, -379.80425647094563, 629.3311553128184,
      866.9662027904133, -31451.272968848367, -36144.413418691176, 66456.14382024054
    ];
    const q = [
      -30.8402300119739, 315.35062697960416, -1015.1563674902192, -3107.771671572311,
      22538.118420980151, 4755.8462775278811, -134659.9598649693, -115132.2596755535
    ];
    let fact = false;
    let n = 0;
    let xden = 0;
    let xnum = 0;
    let y = x;
    let i, z, res;
    if (x > 171.6243769536076) {
      return Infinity;
    }
    if (y <= 0) {
      res = (y % 1) + 3.6e-16;
      if (res) {
        fact = ((!(y & 1) ? 1 : -1) * Math.PI) / Math.sin(Math.PI * res);
        y = 1 - y;
      } else {
        return Infinity;
      }
    }
    const yi = y;
    if (y < 1) {
      z = y++;
    } else {
      z = (y -= n = (y | 0) - 1) - 1;
    }
    for (i = 0; i < 8; ++i) {
      xnum = (xnum + p[i]) * z;
      xden = xden * z + q[i];
    }
    res = xnum / xden + 1;
    if (yi < y) {
      res /= yi;
    } else if (yi > y) {
      for (i = 0; i < n; ++i) {
        res *= y;
        y++;
      }
    }
    if (fact) {
      res = fact / res;
    }
    return res;
  };

  // lower incomplete gamma function, which is usually typeset with a
  // lower-case greek gamma as the function symbol
  jStat.gammap = function gammap(a, x) {
    return jStat.lowRegGamma(a, x) * jStat.gammafn(a);
  };

  // The lower regularized incomplete gamma function, usually written P(a,x)
  jStat.lowRegGamma = function lowRegGamma(a, x) {
    const aln = jStat.gammaln(a);
    let ap = a;
    let sum = 1 / a;
    let del = sum;
    let b = x + 1 - a;
    let c = 1 / 1.0e-30;
    let d = 1 / b;
    let h = d;
    let i = 1;
    // calculate maximum number of itterations required for a
    const ITMAX = -~(Math.log(a >= 1 ? a : 1 / a) * 8.5 + a * 0.4 + 17);
    let an;

    if (x < 0 || a <= 0) {
      return NaN;
    } else if (x < a + 1) {
      for (; i <= ITMAX; i++) {
        sum += del *= x / ++ap;
      }
      return sum * Math.exp(-x + a * Math.log(x) - aln);
    }

    for (; i <= ITMAX; i++) {
      an = -i * (i - a);
      b += 2;
      d = an * d + b;
      c = b + an / c;
      d = 1 / d;
      h *= d * c;
    }

    return 1 - h * Math.exp(-x + a * Math.log(x) - aln);
  };

  // natural log factorial of n
  jStat.factorialln = function factorialln(n) {
    return n < 0 ? NaN : jStat.gammaln(n + 1);
  };

  // factorial of n
  jStat.factorial = function factorial(n) {
    return n < 0 ? NaN : jStat.gammafn(n + 1);
  };

  // combinations of n, m
  jStat.combination = function combination(n, m) {
    // make sure n or m don't exceed the upper limit of usable values
    return n > 170 || m > 170
      ? Math.exp(jStat.combinationln(n, m))
      : jStat.factorial(n) / jStat.factorial(m) / jStat.factorial(n - m);
  };

  jStat.combinationln = function combinationln(n, m) {
    return jStat.factorialln(n) - jStat.factorialln(m) - jStat.factorialln(n - m);
  };

  // permutations of n, m
  jStat.permutation = function permutation(n, m) {
    return jStat.factorial(n) / jStat.factorial(n - m);
  };

  // beta function
  jStat.betafn = function betafn(x, y) {
    // ensure arguments are positive
    if (x <= 0 || y <= 0) return undefined;
    // make sure x + y doesn't exceed the upper limit of usable values
    return x + y > 170
      ? Math.exp(jStat.betaln(x, y))
      : (jStat.gammafn(x) * jStat.gammafn(y)) / jStat.gammafn(x + y);
  };

  // natural logarithm of beta function
  jStat.betaln = function betaln(x, y) {
    return jStat.gammaln(x) + jStat.gammaln(y) - jStat.gammaln(x + y);
  };

  // Evaluates the continued fraction for incomplete beta function by modified
  // Lentz's method.
  jStat.betacf = function betacf(x, a, b) {
    const fpmin = 1e-30;
    let m = 1;
    const qab = a + b;
    const qap = a + 1;
    const qam = a - 1;
    let c = 1;
    let d = 1 - (qab * x) / qap;
    let m2, aa, del, h;

    // These q's will be used in factors that occur in the coefficients
    if (Math.abs(d) < fpmin) d = fpmin;
    d = 1 / d;
    h = d;

    for (; m <= 100; m++) {
      m2 = 2 * m;
      aa = (m * (b - m) * x) / ((qam + m2) * (a + m2));
      // One step (the even one) of the recurrence
      d = 1 + aa * d;
      if (Math.abs(d) < fpmin) d = fpmin;
      c = 1 + aa / c;
      if (Math.abs(c) < fpmin) c = fpmin;
      d = 1 / d;
      h *= d * c;
      aa = (-(a + m) * (qab + m) * x) / ((a + m2) * (qap + m2));
      // Next step of the recurrence (the odd one)
      d = 1 + aa * d;
      if (Math.abs(d) < fpmin) d = fpmin;
      c = 1 + aa / c;
      if (Math.abs(c) < fpmin) c = fpmin;
      d = 1 / d;
      del = d * c;
      h *= del;
      if (Math.abs(del - 1.0) < 3e-7) break;
    }

    return h;
  };

  // Returns the inverse of the lower regularized inomplete gamma function
  jStat.gammapinv = function gammapinv(p, a) {
    let j = 0;
    const a1 = a - 1;
    const EPS = 1e-8;
    const gln = jStat.gammaln(a);
    let x, err, t, u, pp, lna1, afac;

    if (p >= 1) return Math.max(100, a + 100 * Math.sqrt(a));
    if (p <= 0) return 0;
    if (a > 1) {
      lna1 = Math.log(a1);
      afac = Math.exp(a1 * (lna1 - 1) - gln);
      pp = p < 0.5 ? p : 1 - p;
      t = Math.sqrt(-2 * Math.log(pp));
      x = (2.30753 + t * 0.27061) / (1 + t * (0.99229 + t * 0.04481)) - t;
      if (p < 0.5) x = -x;
      x = Math.max(1e-3, a * Math.pow(1 - 1 / (9 * a) - x / (3 * Math.sqrt(a)), 3));
    } else {
      t = 1 - a * (0.253 + a * 0.12);
      if (p < t) x = Math.pow(p / t, 1 / a);
      else x = 1 - Math.log(1 - (p - t) / (1 - t));
    }

    for (; j < 12; j++) {
      if (x <= 0) return 0;
      err = jStat.lowRegGamma(a, x) - p;
      if (a > 1) t = afac * Math.exp(-(x - a1) + a1 * (Math.log(x) - lna1));
      else t = Math.exp(-x + a1 * Math.log(x) - gln);
      u = err / t;
      x -= t = u / (1 - 0.5 * Math.min(1, u * ((a - 1) / x - 1)));
      if (x <= 0) x = 0.5 * (x + t);
      if (Math.abs(t) < EPS * x) break;
    }

    return x;
  };

  // Returns the error function erf(x)
  jStat.erf = function erf(x) {
    const cof = [
      -1.3026537197817094, 6.4196979235649026e-1, 1.9476473204185836e-2, -0.00956151478680863,
      -946595344482036e-18, 3.66839497852761e-4, 4.2523324806907e-5, -20278578112534e-18,
      -1624290004647e-18, 1.30365583558e-6, 1.5626441722e-8, -8.5238095915e-8, 6.529054439e-9,
      5.059343495e-9, -991364156e-18, -227365122e-18, 9.6467911e-11, 2.394038e-12, -6886027e-18,
      8.94487e-13, 3.13092e-13, -112708e-18, 3.81e-16, 7.106e-15, -1523e-18, -94e-18, 1.21e-16,
      -28e-18
    ];
    let j = cof.length - 1;
    let isneg = false;
    let d = 0;
    let dd = 0;
    let tmp;

    if (x < 0) {
      x = -x;
      isneg = true;
    }

    const t = 2 / (2 + x);
    const ty = 4 * t - 2;

    for (; j > 0; j--) {
      tmp = d;
      d = ty * d - dd + cof[j];
      dd = tmp;
    }

    const res = t * Math.exp(-x * x + 0.5 * (cof[0] + ty * d) - dd);
    return isneg ? res - 1 : 1 - res;
  };

  // Returns the complmentary error function erfc(x)
  jStat.erfc = function erfc(x) {
    return 1 - jStat.erf(x);
  };

  // Returns the inverse of the complementary error function
  jStat.erfcinv = function erfcinv(p) {
    let j = 0;
    let x, err;
    if (p >= 2) return -100;
    if (p <= 0) return 100;
    const pp = p < 1 ? p : 2 - p;
    const t = Math.sqrt(-2 * Math.log(pp / 2));
    x = -0.70711 * ((2.30753 + t * 0.27061) / (1 + t * (0.99229 + t * 0.04481)) - t);
    for (; j < 2; j++) {
      err = jStat.erfc(x) - pp;
      x += err / (1.12837916709551257 * Math.exp(-x * x) - x * err);
    }
    return p < 1 ? x : -x;
  };

  // Returns the inverse of the incomplete beta function
  jStat.ibetainv = function ibetainv(p, a, b) {
    const EPS = 1e-8;
    const a1 = a - 1;
    const b1 = b - 1;
    let j = 0;
    let lna, lnb, pp, t, u, err, x, al, h, w;
    if (p <= 0) return 0;
    if (p >= 1) return 1;
    if (a >= 1 && b >= 1) {
      pp = p < 0.5 ? p : 1 - p;
      t = Math.sqrt(-2 * Math.log(pp));
      x = (2.30753 + t * 0.27061) / (1 + t * (0.99229 + t * 0.04481)) - t;
      if (p < 0.5) x = -x;
      al = (x * x - 3) / 6;
      h = 2 / (1 / (2 * a - 1) + 1 / (2 * b - 1));
      w =
        (x * Math.sqrt(al + h)) / h -
        (1 / (2 * b - 1) - 1 / (2 * a - 1)) * (al + 5 / 6 - 2 / (3 * h));
      x = a / (a + b * Math.exp(2 * w));
    } else {
      lna = Math.log(a / (a + b));
      lnb = Math.log(b / (a + b));
      t = Math.exp(a * lna) / a;
      u = Math.exp(b * lnb) / b;
      w = t + u;
      if (p < t / w) x = Math.pow(a * w * p, 1 / a);
      else x = 1 - Math.pow(b * w * (1 - p), 1 / b);
    }
    const afac = -jStat.gammaln(a) - jStat.gammaln(b) + jStat.gammaln(a + b);
    for (; j < 10; j++) {
      if (x === 0 || x === 1) return x;
      err = jStat.ibeta(x, a, b) - p;
      t = Math.exp(a1 * Math.log(x) + b1 * Math.log(1 - x) + afac);
      u = err / t;
      x -= t = u / (1 - 0.5 * Math.min(1, u * (a1 / x - b1 / (1 - x))));
      if (x <= 0) x = 0.5 * (x + t);
      if (x >= 1) x = 0.5 * (x + t + 1);
      if (Math.abs(t) < EPS * x && j > 0) break;
    }
    return x;
  };

  // Returns the incomplete beta function I_x(a,b)
  jStat.ibeta = function ibeta(x, a, b) {
    // Factors in front of the continued fraction.
    const bt =
      x === 0 || x === 1
        ? 0
        : Math.exp(
            jStat.gammaln(a + b) -
              jStat.gammaln(a) -
              jStat.gammaln(b) +
              a * Math.log(x) +
              b * Math.log(1 - x)
          );
    if (x < 0 || x > 1) return false;
    if (x < (a + 1) / (a + b + 2))
      // Use continued fraction directly.
      return (bt * jStat.betacf(x, a, b)) / a;
    // else use continued fraction after making the symmetry transformation.
    return 1 - (bt * jStat.betacf(1 - x, b, a)) / b;
  };

  // Returns a normal deviate (mu=0, sigma=1).
  // If n and m are specified it returns a object of normal deviates.
  jStat.randn = function randn(n, m) {
    let u, v, x, y, q;
    if (!m) m = n;
    if (n)
      return jStat.create(n, m, function () {
        return jStat.randn();
      });
    do {
      u = jStat._random_fn();
      v = 1.7156 * (jStat._random_fn() - 0.5);
      x = u - 0.449871;
      y = Math.abs(v) + 0.386595;
      q = x * x + y * (0.196 * y - 0.25472 * x);
    } while (q > 0.27597 && (q > 0.27846 || v * v > -4 * Math.log(u) * u * u));
    return v / u;
  };

  // Returns a gamma deviate by the method of Marsaglia and Tsang.
  jStat.randg = function randg(shape, n, m) {
    const oalph = shape;
    let u, v, x, mat;
    if (!m) m = n;
    if (!shape) shape = 1;
    if (n) {
      mat = jStat.zeros(n, m);
      mat.alter(function () {
        return jStat.randg(shape);
      });
      return mat;
    }
    if (shape < 1) shape += 1;
    const a1 = shape - 1 / 3;
    const a2 = 1 / Math.sqrt(9 * a1);
    do {
      do {
        x = jStat.randn();
        v = 1 + a2 * x;
      } while (v <= 0);
      v = v * v * v;
      u = jStat._random_fn();
    } while (
      u > 1 - 0.331 * Math.pow(x, 4) &&
      Math.log(u) > 0.5 * x * x + a1 * (1 - v + Math.log(v))
    );
    // alpha > 1
    if (shape === oalph) return a1 * v;
    // alpha < 1
    do {
      u = jStat._random_fn();
    } while (u === 0);
    return Math.pow(u, 1 / oalph) * a1 * v;
  };

  // making use of static methods on the instance
  for (const passfunc of 'gammaln gammafn factorial factorialln'.split(' ')) {
    jStat.fn[passfunc] = function () {
      return jStat(jStat.map(this, (value) => jStat[passfunc](value)));
    };
  }

  for (const passfunc of 'randn'.split(' ')) {
    jStat.fn[passfunc] = function (...args) {
      return jStat(jStat[passfunc].apply(null, args));
    };
  }

  // generate all distribution instance methods
  for (const func of (
    'beta centralF cauchy chisquare exponential gamma invgamma kumaraswamy ' +
    'laplace lognormal noncentralt normal pareto studentt weibull uniform ' +
    'binomial negbin hypgeom poisson triangular tukey arcsine'
  ).split(' ')) {
    // distribution instance method
    jStat[func] = function f(a, b, c) {
      if (!(this instanceof f)) return new f(a, b, c);
      this._a = a;
      this._b = b;
      this._c = c;
      return this;
    };
    // distribution method to be used on a jStat instance
    jStat.fn[func] = function (a, b, c) {
      const newthis = jStat[func](a, b, c);
      newthis.data = this;
      return newthis;
    };
    // sample instance method
    jStat[func].prototype.sample = function (arr) {
      const a = this._a;
      const b = this._b;
      const c = this._c;
      if (arr) return jStat.alter(arr, () => jStat[func].sample(a, b, c));
      else return jStat[func].sample(a, b, c);
    };
    // generate the pdf, cdf and inv instance methods
    for (const fnfunc of 'pdf cdf inv'.split(' ')) {
      jStat[func].prototype[fnfunc] = function (x) {
        const a = this._a;
        const b = this._b;
        const c = this._c;
        if (!x && x !== 0) x = this.data;
        if (typeof x !== 'number') {
          return jStat.fn.map.call(x, (x) => jStat[func][fnfunc](x, a, b, c));
        }
        return jStat[func][fnfunc](x, a, b, c);
      };
    }
    // generate the mean, median, mode and variance instance methods
    for (const fnfunc of 'mean median mode variance'.split(' ')) {
      jStat[func].prototype[fnfunc] = function () {
        return jStat[func][fnfunc](this._a, this._b, this._c);
      };
    }
  }

  // extend beta function with static methods
  jStat.extend(jStat.beta, {
    pdf: function pdf(x, alpha, beta) {
      // PDF is zero outside the support
      if (x > 1 || x < 0) return 0;
      // PDF is one for the uniform case
      if (alpha === 1 && beta === 1) return 1;

      if (alpha < 512 && beta < 512) {
        return (Math.pow(x, alpha - 1) * Math.pow(1 - x, beta - 1)) / jStat.betafn(alpha, beta);
      } else {
        return Math.exp(
          (alpha - 1) * Math.log(x) + (beta - 1) * Math.log(1 - x) - jStat.betaln(alpha, beta)
        );
      }
    },

    cdf: function cdf(x, alpha, beta) {
      return x > 1 || x < 0 ? (x > 1) * 1 : jStat.ibeta(x, alpha, beta);
    },

    inv: function inv(x, alpha, beta) {
      return jStat.ibetainv(x, alpha, beta);
    },

    mean: function mean(alpha, beta) {
      return alpha / (alpha + beta);
    },

    median: function median(alpha, beta) {
      return jStat.ibetainv(0.5, alpha, beta);
    },

    mode: function mode(alpha, beta) {
      return (alpha - 1) / (alpha + beta - 2);
    },

    // return a random sample
    sample: function sample(alpha, beta) {
      const u = jStat.randg(alpha);
      return u / (u + jStat.randg(beta));
    },

    variance: function variance(alpha, beta) {
      return (alpha * beta) / (Math.pow(alpha + beta, 2) * (alpha + beta + 1));
    }
  });

  // extend F function with static methods
  jStat.extend(jStat.centralF, {
    // This implementation of the pdf function avoids float overflow
    // See the way that R calculates this value:
    // https://svn.r-project.org/R/trunk/src/nmath/df.c
    pdf: function pdf(x, df1, df2) {
      if (x < 0) return 0;

      if (df1 <= 2) {
        if (x === 0 && df1 < 2) {
          return Infinity;
        }
        if (x === 0 && df1 === 2) {
          return 1;
        }
        return (
          (1 / jStat.betafn(df1 / 2, df2 / 2)) *
          Math.pow(df1 / df2, df1 / 2) *
          Math.pow(x, df1 / 2 - 1) *
          Math.pow(1 + (df1 / df2) * x, -(df1 + df2) / 2)
        );
      }

      const p = (df1 * x) / (df2 + x * df1);
      const q = df2 / (df2 + x * df1);
      const f = (df1 * q) / 2.0;
      return f * jStat.binomial.pdf((df1 - 2) / 2, (df1 + df2 - 2) / 2, p);
    },

    cdf: function cdf(x, df1, df2) {
      if (x < 0) return 0;
      return jStat.ibeta((df1 * x) / (df1 * x + df2), df1 / 2, df2 / 2);
    },

    inv: function inv(x, df1, df2) {
      return df2 / (df1 * (1 / jStat.ibetainv(x, df1 / 2, df2 / 2) - 1));
    },

    mean: function mean(df1, df2) {
      return df2 > 2 ? df2 / (df2 - 2) : undefined;
    },

    mode: function mode(df1, df2) {
      return df1 > 2 ? (df2 * (df1 - 2)) / (df1 * (df2 + 2)) : undefined;
    },

    // return a random sample
    sample: function sample(df1, df2) {
      const x1 = jStat.randg(df1 / 2) * 2;
      const x2 = jStat.randg(df2 / 2) * 2;
      return x1 / df1 / (x2 / df2);
    },

    variance: function variance(df1, df2) {
      if (df2 <= 4) return undefined;
      return (2 * df2 * df2 * (df1 + df2 - 2)) / (df1 * (df2 - 2) * (df2 - 2) * (df2 - 4));
    }
  });

  // extend cauchy function with static methods
  jStat.extend(jStat.cauchy, {
    pdf: function pdf(x, local, scale) {
      if (scale < 0) {
        return 0;
      }

      return scale / (Math.pow(x - local, 2) + Math.pow(scale, 2)) / Math.PI;
    },

    cdf: function cdf(x, local, scale) {
      return Math.atan((x - local) / scale) / Math.PI + 0.5;
    },

    inv: function (p, local, scale) {
      return local + scale * Math.tan(Math.PI * (p - 0.5));
    },

    median: function median(local /*, scale*/) {
      return local;
    },

    mode: function mode(local /*, scale*/) {
      return local;
    },

    sample: function sample(local, scale) {
      return jStat.randn() * Math.sqrt(1 / (2 * jStat.randg(0.5))) * scale + local;
    }
  });

  // extend chisquare function with static methods
  jStat.extend(jStat.chisquare, {
    pdf: function pdf(x, dof) {
      if (x < 0) return 0;
      return x === 0 && dof === 2
        ? 0.5
        : Math.exp(
            (dof / 2 - 1) * Math.log(x) - x / 2 - (dof / 2) * Math.log(2) - jStat.gammaln(dof / 2)
          );
    },

    cdf: function cdf(x, dof) {
      if (x < 0) return 0;
      return jStat.lowRegGamma(dof / 2, x / 2);
    },

    inv: function (p, dof) {
      return 2 * jStat.gammapinv(p, 0.5 * dof);
    },

    mean: function (dof) {
      return dof;
    },

    // TODO: this is an approximation (is there a better way?)
    median: function median(dof) {
      return dof * Math.pow(1 - 2 / (9 * dof), 3);
    },

    mode: function mode(dof) {
      return dof - 2 > 0 ? dof - 2 : 0;
    },

    sample: function sample(dof) {
      return jStat.randg(dof / 2) * 2;
    },

    variance: function variance(dof) {
      return 2 * dof;
    }
  });

  // extend exponential function with static methods
  jStat.extend(jStat.exponential, {
    pdf: function pdf(x, rate) {
      return x < 0 ? 0 : rate * Math.exp(-rate * x);
    },

    cdf: function cdf(x, rate) {
      return x < 0 ? 0 : 1 - Math.exp(-rate * x);
    },

    inv: function (p, rate) {
      return -Math.log(1 - p) / rate;
    },

    mean: function (rate) {
      return 1 / rate;
    },

    median: function (rate) {
      return (1 / rate) * Math.log(2);
    },

    mode: function mode(/*rate*/) {
      return 0;
    },

    sample: function sample(rate) {
      return (-1 / rate) * Math.log(jStat._random_fn());
    },

    variance: function (rate) {
      return Math.pow(rate, -2);
    }
  });

  // extend gamma function with static methods
  jStat.extend(jStat.gamma, {
    pdf: function pdf(x, shape, scale) {
      if (x < 0) return 0;
      return x === 0 && shape === 1
        ? 1 / scale
        : Math.exp(
            (shape - 1) * Math.log(x) - x / scale - jStat.gammaln(shape) - shape * Math.log(scale)
          );
    },

    cdf: function cdf(x, shape, scale) {
      if (x < 0) return 0;
      return jStat.lowRegGamma(shape, x / scale);
    },

    inv: function (p, shape, scale) {
      return jStat.gammapinv(p, shape) * scale;
    },

    mean: function (shape, scale) {
      return shape * scale;
    },

    mode: function mode(shape, scale) {
      if (shape > 1) return (shape - 1) * scale;
      return undefined;
    },

    sample: function sample(shape, scale) {
      return jStat.randg(shape) * scale;
    },

    variance: function variance(shape, scale) {
      return shape * scale * scale;
    }
  });

  // extend inverse gamma function with static methods
  jStat.extend(jStat.invgamma, {
    pdf: function pdf(x, shape, scale) {
      if (x <= 0) return 0;
      return Math.exp(
        -(shape + 1) * Math.log(x) - scale / x - jStat.gammaln(shape) + shape * Math.log(scale)
      );
    },

    cdf: function cdf(x, shape, scale) {
      if (x <= 0) return 0;
      return 1 - jStat.lowRegGamma(shape, scale / x);
    },

    inv: function (p, shape, scale) {
      return scale / jStat.gammapinv(1 - p, shape);
    },

    mean: function (shape, scale) {
      return shape > 1 ? scale / (shape - 1) : undefined;
    },

    mode: function mode(shape, scale) {
      return scale / (shape + 1);
    },

    sample: function sample(shape, scale) {
      return scale / jStat.randg(shape);
    },

    variance: function variance(shape, scale) {
      if (shape <= 2) return undefined;
      return (scale * scale) / ((shape - 1) * (shape - 1) * (shape - 2));
    }
  });

  // extend kumaraswamy function with static methods
  jStat.extend(jStat.kumaraswamy, {
    pdf: function pdf(x, alpha, beta) {
      if (x < 0 || x > 1) return 0;
      if (x === 0 && alpha === 1) return beta;
      else if (x === 1 && beta === 1) return alpha;
      return Math.exp(
        Math.log(alpha) +
          Math.log(beta) +
          (alpha - 1) * Math.log(x) +
          (beta - 1) * Math.log(1 - Math.pow(x, alpha))
      );
    },

    cdf: function cdf(x, alpha, beta) {
      if (x < 0) return 0;
      else if (x > 1) return 1;
      return 1 - Math.pow(1 - Math.pow(x, alpha), beta);
    },

    inv: function inv(p, alpha, beta) {
      return Math.pow(1 - Math.pow(1 - p, 1 / beta), 1 / alpha);
    },

    mean: function (alpha, beta) {
      return (
        (beta * jStat.gammafn(1 + 1 / alpha) * jStat.gammafn(beta)) /
        jStat.gammafn(1 + 1 / alpha + beta)
      );
    },

    median: function median(alpha, beta) {
      return Math.pow(1 - Math.pow(2, -1 / beta), 1 / alpha);
    },

    mode: function mode(alpha, beta) {
      if (!(alpha >= 1 && beta >= 1 && alpha !== 1 && beta !== 1)) return undefined;
      return Math.pow((alpha - 1) / (alpha * beta - 1), 1 / alpha);
    },

    variance: function variance(/*alpha, beta*/) {
      throw new Error('variance not yet implemented');
      // TODO: complete this
    }
  });

  // extend lognormal function with static methods
  jStat.extend(jStat.lognormal, {
    pdf: function pdf(x, mu, sigma) {
      if (x <= 0) return 0;
      return Math.exp(
        -Math.log(x) -
          0.5 * Math.log(2 * Math.PI) -
          Math.log(sigma) -
          Math.pow(Math.log(x) - mu, 2) / (2 * sigma * sigma)
      );
    },

    cdf: function cdf(x, mu, sigma) {
      if (x < 0) return 0;
      return 0.5 + 0.5 * jStat.erf((Math.log(x) - mu) / Math.sqrt(2 * sigma * sigma));
    },

    inv: function (p, mu, sigma) {
      return Math.exp(-1.4142135623730951 * sigma * jStat.erfcinv(2 * p) + mu);
    },

    mean: function mean(mu, sigma) {
      return Math.exp(mu + (sigma * sigma) / 2);
    },

    median: function median(mu /*, sigma*/) {
      return Math.exp(mu);
    },

    mode: function mode(mu, sigma) {
      return Math.exp(mu - sigma * sigma);
    },

    sample: function sample(mu, sigma) {
      return Math.exp(jStat.randn() * sigma + mu);
    },

    variance: function variance(mu, sigma) {
      return (Math.exp(sigma * sigma) - 1) * Math.exp(2 * mu + sigma * sigma);
    }
  });

  // extend noncentralt function with static methods
  jStat.extend(jStat.noncentralt, {
    pdf: function pdf(x, dof, ncp) {
      const tol = 1e-14;
      if (Math.abs(ncp) < tol)
        // ncp approx 0; use student-t
        return jStat.studentt.pdf(x, dof);

      if (Math.abs(x) < tol) {
        // different formula for x == 0
        return Math.exp(
          jStat.gammaln((dof + 1) / 2) -
            (ncp * ncp) / 2 -
            0.5 * Math.log(Math.PI * dof) -
            jStat.gammaln(dof / 2)
        );
      }

      // formula for x != 0
      return (
        (dof / x) *
        (jStat.noncentralt.cdf(x * Math.sqrt(1 + 2 / dof), dof + 2, ncp) -
          jStat.noncentralt.cdf(x, dof, ncp))
      );
    },

    cdf: function cdf(x, dof, ncp) {
      const tol = 1e-14;
      const min_iterations = 200;

      if (Math.abs(ncp) < tol)
        // ncp approx 0; use student-t
        return jStat.studentt.cdf(x, dof);

      // turn negative x into positive and flip result afterwards
      let flip = false;
      if (x < 0) {
        flip = true;
        ncp = -ncp;
      }

      let prob = jStat.normal.cdf(-ncp, 0, 1);
      let value = tol + 1;
      // use value at last two steps to determine convergence
      let lastvalue = value;
      const y = (x * x) / (x * x + dof);
      let j = 0;
      let p = Math.exp((-ncp * ncp) / 2);
      let q = Math.exp((-ncp * ncp) / 2 - 0.5 * Math.log(2) - jStat.gammaln(3 / 2)) * ncp;
      while (j < min_iterations || lastvalue > tol || value > tol) {
        lastvalue = value;
        if (j > 0) {
          p *= (ncp * ncp) / (2 * j);
          q *= (ncp * ncp) / (2 * (j + 1 / 2));
        }
        value = p * jStat.beta.cdf(y, j + 0.5, dof / 2) + q * jStat.beta.cdf(y, j + 1, dof / 2);
        prob += 0.5 * value;
        j++;
      }

      return flip ? 1 - prob : prob;
    }
  });

  // extend normal function with static methods
  jStat.extend(jStat.normal, {
    pdf: function pdf(x, mean, std) {
      return Math.exp(
        -0.5 * Math.log(2 * Math.PI) - Math.log(std) - Math.pow(x - mean, 2) / (2 * std * std)
      );
    },

    cdf: function cdf(x, mean, std) {
      return 0.5 * (1 + jStat.erf((x - mean) / Math.sqrt(2 * std * std)));
    },

    inv: function (p, mean, std) {
      return -1.4142135623730951 * std * jStat.erfcinv(2 * p) + mean;
    },

    mean: function (mean /*, std*/) {
      return mean;
    },

    median: function median(mean /*, std*/) {
      return mean;
    },

    mode: function (mean /*, std*/) {
      return mean;
    },

    sample: function sample(mean, std) {
      return jStat.randn() * std + mean;
    },

    variance: function (mean, std) {
      return std * std;
    }
  });

  // extend pareto function with static methods
  jStat.extend(jStat.pareto, {
    pdf: function pdf(x, scale, shape) {
      if (x < scale) return 0;
      return (shape * Math.pow(scale, shape)) / Math.pow(x, shape + 1);
    },

    cdf: function cdf(x, scale, shape) {
      if (x < scale) return 0;
      return 1 - Math.pow(scale / x, shape);
    },

    inv: function inv(p, scale, shape) {
      return scale / Math.pow(1 - p, 1 / shape);
    },

    mean: function mean(scale, shape) {
      if (shape <= 1) return undefined;
      return (shape * Math.pow(scale, shape)) / (shape - 1);
    },

    median: function median(scale, shape) {
      return scale * (shape * Math.SQRT2);
    },

    mode: function mode(scale /*, shape*/) {
      return scale;
    },

    variance: function (scale, shape) {
      if (shape <= 2) return undefined;
      return (scale * scale * shape) / (Math.pow(shape - 1, 2) * (shape - 2));
    }
  });

  // extend studentt function with static methods
  jStat.extend(jStat.studentt, {
    pdf: function pdf(x, dof) {
      dof = dof > 1e100 ? 1e100 : dof;
      return (
        (1 / (Math.sqrt(dof) * jStat.betafn(0.5, dof / 2))) *
        Math.pow(1 + (x * x) / dof, -((dof + 1) / 2))
      );
    },

    cdf: function cdf(x, dof) {
      const dof2 = dof / 2;
      return jStat.ibeta((x + Math.sqrt(x * x + dof)) / (2 * Math.sqrt(x * x + dof)), dof2, dof2);
    },

    inv: function (p, dof) {
      let x = jStat.ibetainv(2 * Math.min(p, 1 - p), 0.5 * dof, 0.5);
      x = Math.sqrt((dof * (1 - x)) / x);
      return p > 0.5 ? x : -x;
    },

    mean: function mean(dof) {
      return dof > 1 ? 0 : undefined;
    },

    median: function median(/*dof*/) {
      return 0;
    },

    mode: function mode(/*dof*/) {
      return 0;
    },

    sample: function sample(dof) {
      return jStat.randn() * Math.sqrt(dof / (2 * jStat.randg(dof / 2)));
    },

    variance: function variance(dof) {
      return dof > 2 ? dof / (dof - 2) : dof > 1 ? Infinity : undefined;
    }
  });

  // extend weibull function with static methods
  jStat.extend(jStat.weibull, {
    pdf: function pdf(x, scale, shape) {
      if (x < 0 || scale < 0 || shape < 0) return 0;
      return (shape / scale) * Math.pow(x / scale, shape - 1) * Math.exp(-Math.pow(x / scale, shape));
    },

    cdf: function cdf(x, scale, shape) {
      return x < 0 ? 0 : 1 - Math.exp(-Math.pow(x / scale, shape));
    },

    inv: function (p, scale, shape) {
      return scale * Math.pow(-Math.log(1 - p), 1 / shape);
    },

    mean: function (scale, shape) {
      return scale * jStat.gammafn(1 + 1 / shape);
    },

    median: function median(scale, shape) {
      return scale * Math.pow(Math.log(2), 1 / shape);
    },

    mode: function mode(scale, shape) {
      if (shape <= 1) return 0;
      return scale * Math.pow((shape - 1) / shape, 1 / shape);
    },

    sample: function sample(scale, shape) {
      return scale * Math.pow(-Math.log(jStat._random_fn()), 1 / shape);
    },

    variance: function variance(scale, shape) {
      return (
        scale * scale * jStat.gammafn(1 + 2 / shape) - Math.pow(jStat.weibull.mean(scale, shape), 2)
      );
    }
  });

  // extend uniform function with static methods
  jStat.extend(jStat.uniform, {
    pdf: function pdf(x, a, b) {
      return x < a || x > b ? 0 : 1 / (b - a);
    },

    cdf: function cdf(x, a, b) {
      if (x < a) return 0;
      else if (x < b) return (x - a) / (b - a);
      return 1;
    },

    inv: function (p, a, b) {
      return a + p * (b - a);
    },

    mean: function mean(a, b) {
      return 0.5 * (a + b);
    },

    median: function median(a, b) {
      return jStat.mean(a, b);
    },

    mode: function mode(/*a, b*/) {
      throw new Error('mode is not yet implemented');
    },

    sample: function sample(a, b) {
      return a / 2 + b / 2 + (b / 2 - a / 2) * (2 * jStat._random_fn() - 1);
    },

    variance: function variance(a, b) {
      return Math.pow(b - a, 2) / 12;
    }
  });

  // Got this from http://www.math.ucla.edu/~tom/distributions/binomial.html
  function betinc(x, a, b, eps) {
    let a0 = 0;
    let b0 = 1;
    let a1 = 1;
    let b1 = 1;
    let m9 = 0;
    let a2 = 0;
    let c9;

    while (Math.abs((a1 - a2) / a1) > eps) {
      a2 = a1;
      c9 = (-(a + m9) * (a + b + m9) * x) / (a + 2 * m9) / (a + 2 * m9 + 1);
      a0 = a1 + c9 * a0;
      b0 = b1 + c9 * b0;
      m9 = m9 + 1;
      c9 = (m9 * (b - m9) * x) / (a + 2 * m9 - 1) / (a + 2 * m9);
      a1 = a0 + c9 * a1;
      b1 = b0 + c9 * b1;
      a0 = a0 / b1;
      b0 = b0 / b1;
      a1 = a1 / b1;
      b1 = 1;
    }

    return a1 / a;
  }

  // extend uniform function with static methods
  jStat.extend(jStat.binomial, {
    pdf: function pdf(k, n, p) {
      return p === 0 || p === 1
        ? n * p === k
          ? 1
          : 0
        : jStat.combination(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k);
    },

    cdf: function cdf(x, n, p) {
      let betacdf;
      const eps = 1e-10;

      if (x < 0) return 0;
      if (x >= n) return 1;
      if (p < 0 || p > 1 || n <= 0) return NaN;

      x = Math.floor(x);
      const z = p;
      const a = x + 1;
      const b = n - x;
      const s = a + b;
      const bt = Math.exp(
        jStat.gammaln(s) - jStat.gammaln(b) - jStat.gammaln(a) + a * Math.log(z) + b * Math.log(1 - z)
      );

      if (z < (a + 1) / (s + 2)) betacdf = bt * betinc(z, a, b, eps);
      else betacdf = 1 - bt * betinc(1 - z, b, a, eps);

      return Math.round((1 - betacdf) * (1 / eps)) / (1 / eps);
    }
  });

  // extend uniform function with static methods
  jStat.extend(jStat.negbin, {
    pdf: function pdf(k, r, p) {
      if (k !== k >>> 0) return false;
      if (k < 0) return 0;
      return jStat.combination(k + r - 1, r - 1) * Math.pow(1 - p, k) * Math.pow(p, r);
    },

    cdf: function cdf(x, r, p) {
      let sum = 0;
      let k = 0;
      if (x < 0) return 0;
      for (; k <= x; k++) {
        sum += jStat.negbin.pdf(k, r, p);
      }
      return sum;
    }
  });

  // extend uniform function with static methods
  jStat.extend(jStat.hypgeom, {
    pdf: function pdf(k, N, m, n) {
      // Hypergeometric PDF.

      // A simplification of the CDF algorithm below.

      // k = number of successes drawn
      // N = population size
      // m = number of successes in population
      // n = number of items drawn from population

      // eslint-disable-next-line no-self-compare
      if ((k !== k) | 0) {
        return false;
      } else if (k < 0 || k < m - (N - n)) {
        // It's impossible to have this few successes drawn.
        return 0;
      } else if (k > n || k > m) {
        // It's impossible to have this many successes drawn.
        return 0;
      } else if (m * 2 > N) {
        // More than half the population is successes.

        if (n * 2 > N) {
          // More than half the population is sampled.

          return jStat.hypgeom.pdf(N - m - n + k, N, N - m, N - n);
        } else {
          // Half or less of the population is sampled.

          return jStat.hypgeom.pdf(n - k, N, N - m, n);
        }
      } else if (n * 2 > N) {
        // Half or less is successes.

        return jStat.hypgeom.pdf(m - k, N, m, N - n);
      } else if (m < n) {
        // We want to have the number of things sampled to be less than the
        // successes available. So swap the definitions of successful and sampled.
        return jStat.hypgeom.pdf(k, N, n, m);
      } else {
        // If we get here, half or less of the population was sampled, half or
        // less of it was successes, and we had fewer sampled things than
        // successes. Now we can do this complicated iterative algorithm in an
        // efficient way.

        // The basic premise of the algorithm is that we partially normalize our
        // intermediate product to keep it in a numerically good region, and then
        // finish the normalization at the end.

        // This variable holds the scaled probability of the current number of
        // successes.
        let scaledPDF = 1;

        // This keeps track of how much we have normalized.
        let samplesDone = 0;

        for (let i = 0; i < k; i++) {
          // For every possible number of successes up to that observed...

          while (scaledPDF > 1 && samplesDone < n) {
            // Intermediate result is growing too big. Apply some of the
            // normalization to shrink everything.

            scaledPDF *= 1 - m / (N - samplesDone);

            // Say we've normalized by this sample already.
            samplesDone++;
          }

          // Work out the partially-normalized hypergeometric PDF for the next
          // number of successes
          scaledPDF *= ((n - i) * (m - i)) / ((i + 1) * (N - m - n + i + 1));
        }

        for (; samplesDone < n; samplesDone++) {
          // Apply all the rest of the normalization
          scaledPDF *= 1 - m / (N - samplesDone);
        }

        // Bound answer sanely before returning.
        return Math.min(1, Math.max(0, scaledPDF));
      }
    },

    cdf: function cdf(x, N, m, n) {
      // Hypergeometric CDF.

      // This algorithm is due to Prof. Thomas S. Ferguson, <tom@math.ucla.edu>,
      // and comes from his hypergeometric test calculator at
      // <http://www.math.ucla.edu/~tom/distributions/Hypergeometric.html>.

      // x = number of successes drawn
      // N = population size
      // m = number of successes in population
      // n = number of items drawn from population

      if (x < 0 || x < m - (N - n)) {
        // It's impossible to have this few successes drawn or fewer.
        return 0;
      } else if (x >= n || x >= m) {
        // We will always have this many successes or fewer.
        return 1;
      } else if (m * 2 > N) {
        // More than half the population is successes.

        if (n * 2 > N) {
          // More than half the population is sampled.

          return jStat.hypgeom.cdf(N - m - n + x, N, N - m, N - n);
        } else {
          // Half or less of the population is sampled.

          return 1 - jStat.hypgeom.cdf(n - x - 1, N, N - m, n);
        }
      } else if (n * 2 > N) {
        // Half or less is successes.

        return 1 - jStat.hypgeom.cdf(m - x - 1, N, m, N - n);
      } else if (m < n) {
        // We want to have the number of things sampled to be less than the
        // successes available. So swap the definitions of successful and sampled.
        return jStat.hypgeom.cdf(x, N, n, m);
      } else {
        // If we get here, half or less of the population was sampled, half or
        // less of it was successes, and we had fewer sampled things than
        // successes. Now we can do this complicated iterative algorithm in an
        // efficient way.

        // The basic premise of the algorithm is that we partially normalize our
        // intermediate sum to keep it in a numerically good region, and then
        // finish the normalization at the end.

        // Holds the intermediate, scaled total CDF.
        let scaledCDF = 1;

        // This variable holds the scaled probability of the current number of
        // successes.
        let scaledPDF = 1;

        // This keeps track of how much we have normalized.
        let samplesDone = 0;

        for (let i = 0; i < x; i++) {
          // For every possible number of successes up to that observed...

          while (scaledCDF > 1 && samplesDone < n) {
            // Intermediate result is growing too big. Apply some of the
            // normalization to shrink everything.

            const factor = 1 - m / (N - samplesDone);

            scaledPDF *= factor;
            scaledCDF *= factor;

            // Say we've normalized by this sample already.
            samplesDone++;
          }

          // Work out the partially-normalized hypergeometric PDF for the next
          // number of successes
          scaledPDF *= ((n - i) * (m - i)) / ((i + 1) * (N - m - n + i + 1));

          // Add to the CDF answer.
          scaledCDF += scaledPDF;
        }

        for (; samplesDone < n; samplesDone++) {
          // Apply all the rest of the normalization
          scaledCDF *= 1 - m / (N - samplesDone);
        }

        // Bound answer sanely before returning.
        return Math.min(1, Math.max(0, scaledCDF));
      }
    }
  });

  // extend uniform function with static methods
  jStat.extend(jStat.poisson, {
    pdf: function pdf(k, l) {
      if (l < 0 || k % 1 !== 0 || k < 0) {
        return 0;
      }

      return (Math.pow(l, k) * Math.exp(-l)) / jStat.factorial(k);
    },

    cdf: function cdf(x, l) {
      const sumarr = [];
      let k = 0;
      if (x < 0) return 0;
      for (; k <= x; k++) {
        sumarr.push(jStat.poisson.pdf(k, l));
      }
      return jStat.sum(sumarr);
    },

    mean: function (l) {
      return l;
    },

    variance: function (l) {
      return l;
    },

    sampleSmall: function sampleSmall(l) {
      let p = 1;
      let k = 0;
      const L = Math.exp(-l);
      do {
        k++;
        p *= jStat._random_fn();
      } while (p > L);
      return k - 1;
    },

    sampleLarge: function sampleLarge(l) {
      const lam = l;
      let k;
      let U, V, us;

      const slam = Math.sqrt(lam);
      const loglam = Math.log(lam);
      const b = 0.931 + 2.53 * slam;
      const a = -0.059 + 0.02483 * b;
      const invalpha = 1.1239 + 1.1328 / (b - 3.4);
      const vr = 0.9277 - 3.6224 / (b - 2);

      while (1) {
        U = Math.random() - 0.5;
        V = Math.random();
        us = 0.5 - Math.abs(U);
        k = Math.floor(((2 * a) / us + b) * U + lam + 0.43);
        if (us >= 0.07 && V <= vr) {
          return k;
        }
        if (k < 0 || (us < 0.013 && V > us)) {
          continue;
        }
        /* log(V) == log(0.0) ok here */
        /* if U==0.0 so that us==0.0, log is ok since always returns */
        if (
          Math.log(V) + Math.log(invalpha) - Math.log(a / (us * us) + b) <=
          -lam + k * loglam - jStat.loggam(k + 1)
        ) {
          return k;
        }
      }
    },

    sample: function sample(l) {
      if (l < 10) return this.sampleSmall(l);
      else return this.sampleLarge(l);
    }
  });

  // extend triangular function with static methods
  jStat.extend(jStat.triangular, {
    pdf: function pdf(x, a, b, c) {
      if (b <= a || c < a || c > b) {
        return NaN;
      } else {
        if (x < a || x > b) {
          return 0;
        } else if (x < c) {
          return (2 * (x - a)) / ((b - a) * (c - a));
        } else if (x === c) {
          return 2 / (b - a);
        } else {
          // x > c
          return (2 * (b - x)) / ((b - a) * (b - c));
        }
      }
    },

    cdf: function cdf(x, a, b, c) {
      if (b <= a || c < a || c > b) return NaN;
      if (x <= a) return 0;
      else if (x >= b) return 1;
      if (x <= c)
        return Math.pow(x - a, 2) / ((b - a) * (c - a)); // x > c
      else return 1 - Math.pow(b - x, 2) / ((b - a) * (b - c));
    },

    inv: function inv(p, a, b, c) {
      if (b <= a || c < a || c > b) {
        return NaN;
      } else {
        if (p <= (c - a) / (b - a)) {
          return a + (b - a) * Math.sqrt(p * ((c - a) / (b - a)));
        } else {
          // p > ((c - a) / (b - a))
          return a + (b - a) * (1 - Math.sqrt((1 - p) * (1 - (c - a) / (b - a))));
        }
      }
    },

    mean: function mean(a, b, c) {
      return (a + b + c) / 3;
    },

    median: function median(a, b, c) {
      if (c <= (a + b) / 2) {
        return b - Math.sqrt((b - a) * (b - c)) / Math.sqrt(2);
      } else if (c > (a + b) / 2) {
        return a + Math.sqrt((b - a) * (c - a)) / Math.sqrt(2);
      }
    },

    mode: function mode(a, b, c) {
      return c;
    },

    sample: function sample(a, b, c) {
      const u = jStat._random_fn();
      if (u < (c - a) / (b - a)) return a + Math.sqrt(u * (b - a) * (c - a));
      return b - Math.sqrt((1 - u) * (b - a) * (b - c));
    },

    variance: function variance(a, b, c) {
      return (a * a + b * b + c * c - a * b - a * c - b * c) / 18;
    }
  });

  // extend arcsine function with static methods
  jStat.extend(jStat.arcsine, {
    pdf: function pdf(x, a, b) {
      if (b <= a) return NaN;

      return x <= a || x >= b
        ? 0
        : (2 / Math.PI) * Math.pow(Math.pow(b - a, 2) - Math.pow(2 * x - a - b, 2), -0.5);
    },

    cdf: function cdf(x, a, b) {
      if (x < a) return 0;
      else if (x < b) return (2 / Math.PI) * Math.asin(Math.sqrt((x - a) / (b - a)));
      return 1;
    },

    inv: function (p, a, b) {
      return a + (0.5 - 0.5 * Math.cos(Math.PI * p)) * (b - a);
    },

    mean: function mean(a, b) {
      if (b <= a) return NaN;
      return (a + b) / 2;
    },

    median: function median(a, b) {
      if (b <= a) return NaN;
      return (a + b) / 2;
    },

    mode: function mode(/*a, b*/) {
      throw new Error('mode is not yet implemented');
    },

    sample: function sample(a, b) {
      return (a + b) / 2 + ((b - a) / 2) * Math.sin(2 * Math.PI * jStat.uniform.sample(0, 1));
    },

    variance: function variance(a, b) {
      if (b <= a) return NaN;
      return Math.pow(b - a, 2) / 8;
    }
  });

  function laplaceSign(x) {
    return x / Math.abs(x);
  }

  jStat.extend(jStat.laplace, {
    pdf: function pdf(x, mu, b) {
      return b <= 0 ? 0 : Math.exp(-Math.abs(x - mu) / b) / (2 * b);
    },

    cdf: function cdf(x, mu, b) {
      if (b <= 0) {
        return 0;
      }

      if (x < mu) {
        return 0.5 * Math.exp((x - mu) / b);
      } else {
        return 1 - 0.5 * Math.exp(-(x - mu) / b);
      }
    },

    mean: function (mu /*, b*/) {
      return mu;
    },

    median: function (mu /*, b*/) {
      return mu;
    },

    mode: function (mu /*, b*/) {
      return mu;
    },

    variance: function (mu, b) {
      return 2 * b * b;
    },

    sample: function sample(mu, b) {
      const u = jStat._random_fn() - 0.5;

      return mu - b * laplaceSign(u) * Math.log(1 - 2 * Math.abs(u));
    }
  });

  function tukeyWprob(w, rr, cc) {
    const nleg = 12;
    const ihalf = 6;

    const C1 = -30;
    const C2 = -50;
    const C3 = 60;
    const bb = 8;
    const wlar = 3;
    const wincr1 = 2;
    const wincr2 = 3;
    const xleg = [
      0.981560634246719250690549090149, 0.904117256370474856678465866119,
      0.769902674194304687036893833213, 0.587317954286617447296702418941,
      0.367831498998180193752691536644, 0.125233408511468915472441369464
    ];
    const aleg = [
      0.047175336386511827194615961485, 0.106939325995318430960254718194,
      0.160078328543346226334652529543, 0.20316742672306592174906445581,
      0.233492536538354808760849898925, 0.249147045813402785000562436043
    ];

    const qsqz = w * 0.5;

    // if w >= 16 then the integral lower bound (occurs for c=20)
    // is 0.99999999999995 so return a value of 1.

    if (qsqz >= bb) return 1.0;

    // find (f(w/2) - 1) ^ cc
    // (first term in integral of hartley's form).

    let pr_w = 2 * jStat.normal.cdf(qsqz, 0, 1, 1, 0) - 1; // erf(qsqz / M_SQRT2)
    // if pr_w ^ cc < 2e-22 then set pr_w = 0
    if (pr_w >= Math.exp(C2 / cc)) pr_w = Math.pow(pr_w, cc);
    else pr_w = 0.0;

    // if w is large then the second component of the
    // integral is small, so fewer intervals are needed.

    let wincr;
    if (w > wlar) wincr = wincr1;
    else wincr = wincr2;

    // find the integral of second term of hartley's form
    // for the integral of the range for equal-length
    // intervals using legendre quadrature.  limits of
    // integration are from (w/2, 8).  two or three
    // equal-length intervals are used.

    // blb and bub are lower and upper limits of integration.

    let blb = qsqz;
    const binc = (bb - qsqz) / wincr;
    let bub = blb + binc;
    let einsum = 0.0;

    // integrate over each interval

    const cc1 = cc - 1.0;
    for (let wi = 1; wi <= wincr; wi++) {
      let elsum = 0.0;
      const a = 0.5 * (bub + blb);

      // legendre quadrature with order = nleg

      const b = 0.5 * (bub - blb);

      for (let jj = 1; jj <= nleg; jj++) {
        let j, xx;
        if (ihalf < jj) {
          j = nleg - jj + 1;
          xx = xleg[j - 1];
        } else {
          j = jj;
          xx = -xleg[j - 1];
        }
        const c = b * xx;
        const ac = a + c;

        // if exp(-qexpo/2) < 9e-14,
        // then doesn't contribute to integral

        const qexpo = ac * ac;
        if (qexpo > C3) break;

        const pplus = 2 * jStat.normal.cdf(ac, 0, 1, 1, 0);
        const pminus = 2 * jStat.normal.cdf(ac, w, 1, 1, 0);

        // if rinsum ^ (cc-1) < 9e-14,
        // then doesn't contribute to integral

        let rinsum = pplus * 0.5 - pminus * 0.5;
        if (rinsum >= Math.exp(C1 / cc1)) {
          rinsum = aleg[j - 1] * Math.exp(-(0.5 * qexpo)) * Math.pow(rinsum, cc1);
          elsum += rinsum;
        }
      }
      elsum *= (2.0 * b * cc) / Math.sqrt(2 * Math.PI);
      einsum += elsum;
      blb = bub;
      bub += binc;
    }

    // if pr_w ^ rr < 9e-14, then return 0
    pr_w += einsum;
    if (pr_w <= Math.exp(C1 / rr)) return 0;

    pr_w = Math.pow(pr_w, rr);
    if (pr_w >= 1)
      // 1 was iMax was eps
      return 1;
    return pr_w;
  }

  function tukeyQinv(p, c, v) {
    const p0 = 0.322232421088;
    const q0 = 0.99348462606e-1;
    const p1 = -1;
    const q1 = 0.588581570495;
    const p2 = -0.342242088547;
    const q2 = 0.531103462366;
    const p3 = -0.204231210125;
    const q3 = 0.10353775285;
    const p4 = -453642210148e-16;
    const q4 = 0.38560700634e-2;
    const c1 = 0.8832;
    const c2 = 0.2368;
    const c4 = 1.208;
    const c5 = 1.4142;
    const vmax = 120.0;

    const ps = 0.5 - 0.5 * p;
    const yi = Math.sqrt(Math.log(1.0 / (ps * ps)));
    let t =
      yi +
      ((((yi * p4 + p3) * yi + p2) * yi + p1) * yi + p0) /
        ((((yi * q4 + q3) * yi + q2) * yi + q1) * yi + q0);
    if (v < vmax) t += (t * t * t + t) / v / 4.0;
    let q = c1 - c2 * t;
    if (v < vmax) q += -1.214 / v + (c4 * t) / v;
    return t * (q * Math.log(c - 1.0) + c5);
  }

  jStat.extend(jStat.tukey, {
    cdf: function cdf(q, nmeans, df) {
      // Identical implementation as the R ptukey() function as of commit 68947
      const rr = 1;
      const cc = nmeans;

      const nlegq = 16;
      const ihalfq = 8;

      const eps1 = -30;
      const eps2 = 1.0e-14;
      const dhaf = 100.0;
      const dquar = 800.0;
      const deigh = 5000.0;
      const dlarg = 25000.0;
      const ulen1 = 1.0;
      const ulen2 = 0.5;
      const ulen3 = 0.25;
      const ulen4 = 0.125;
      const xlegq = [
        0.98940093499164993259615417345, 0.944575023073232576077988415535,
        0.865631202387831743880467897712, 0.755404408355003033895101194847,
        0.617876244402643748446671764049, 0.458016777657227386342419442984,
        0.28160355077925891323046050146, 0.95012509837637440185319335425e-1
      ];
      const alegq = [
        0.27152459411754094851780572456e-1, 0.622535239386478928628438369944e-1,
        0.951585116824927848099251076022e-1, 0.124628971255533872052476282192,
        0.149595988816576732081501730547, 0.16915651939500253818931207903,
        0.182603415044923588866763667969, 0.189450610455068496285396723208
      ];

      if (q <= 0) return 0;

      // df must be > 1
      // there must be at least two values

      if (df < 2 || rr < 1 || cc < 2) return NaN;

      if (!Number.isFinite(q)) return 1;

      if (df > dlarg) return tukeyWprob(q, rr, cc);

      // calculate leading constant

      const f2 = df * 0.5;
      let f2lf = f2 * Math.log(df) - df * Math.log(2) - jStat.gammaln(f2);
      const f21 = f2 - 1.0;

      // integral is divided into unit, half-unit, quarter-unit, or
      // eighth-unit length intervals depending on the value of the
      // degrees of freedom.

      const ff4 = df * 0.25;
      let ulen;
      if (df <= dhaf) ulen = ulen1;
      else if (df <= dquar) ulen = ulen2;
      else if (df <= deigh) ulen = ulen3;
      else ulen = ulen4;

      f2lf += Math.log(ulen);

      // integrate over each subinterval

      let ans = 0.0;
      let otsum = 0.0;

      for (let i = 1; i <= 50; i++) {
        otsum = 0.0;

        // legendre quadrature with order = nlegq
        // nodes (stored in xlegq) are symmetric around zero.

        const twa1 = (2 * i - 1) * ulen;

        for (let jj = 1; jj <= nlegq; jj++) {
          let j, t1;
          if (ihalfq < jj) {
            j = jj - ihalfq - 1;
            t1 = f2lf + f21 * Math.log(twa1 + xlegq[j] * ulen) - (xlegq[j] * ulen + twa1) * ff4;
          } else {
            j = jj - 1;
            t1 = f2lf + f21 * Math.log(twa1 - xlegq[j] * ulen) + (xlegq[j] * ulen - twa1) * ff4;
          }

          // if exp(t1) < 9e-14, then doesn't contribute to integral
          let qsqz;
          if (t1 >= eps1) {
            if (ihalfq < jj) {
              qsqz = q * Math.sqrt((xlegq[j] * ulen + twa1) * 0.5);
            } else {
              qsqz = q * Math.sqrt((-(xlegq[j] * ulen) + twa1) * 0.5);
            }

            // call wprob to find integral of range portion

            const wprb = tukeyWprob(qsqz, rr, cc);
            const rotsum = wprb * alegq[j] * Math.exp(t1);
            otsum += rotsum;
          }
          // end legendre integral for interval i
          // L200:
        }

        // if integral for interval i < 1e-14, then stop.
        // However, in order to avoid small area under left tail,
        // at least  1 / ulen  intervals are calculated.
        if (i * ulen >= 1.0 && otsum <= eps2) break;

        // end of interval i
        // L330:

        ans += otsum;
      }

      if (otsum > eps2) {
        // not converged
        throw new Error('tukey.cdf failed to converge');
      }
      if (ans > 1) ans = 1;
      return ans;
    },

    inv: function (p, nmeans, df) {
      // Identical implementation as the R qtukey() function as of commit 68947
      const rr = 1;
      const cc = nmeans;

      const eps = 0.0001;
      const maxiter = 50;

      // df must be > 1 ; there must be at least two values
      if (df < 2 || rr < 1 || cc < 2) return NaN;

      if (p < 0 || p > 1) return NaN;
      if (p === 0) return 0;
      if (p === 1) return Infinity;

      // Initial value

      let x0 = tukeyQinv(p, cc, df);

      // Find prob(value < x0)

      let valx0 = jStat.tukey.cdf(x0, nmeans, df) - p;

      // Find the second iterate and prob(value < x1).
      // If the first iterate has probability value
      // exceeding p then second iterate is 1 less than
      // first iterate; otherwise it is 1 greater.

      let x1;
      if (valx0 > 0.0) x1 = Math.max(0.0, x0 - 1.0);
      else x1 = x0 + 1.0;
      let valx1 = jStat.tukey.cdf(x1, nmeans, df) - p;

      // Find new iterate

      let ans;
      for (let iter = 1; iter < maxiter; iter++) {
        ans = x1 - (valx1 * (x1 - x0)) / (valx1 - valx0);
        valx0 = valx1;

        // New iterate must be >= 0

        x0 = x1;
        if (ans < 0.0) {
          ans = 0.0;
          valx1 = -p;
        }
        // Find prob(value < new iterate)

        valx1 = jStat.tukey.cdf(ans, nmeans, df) - p;
        x1 = ans;

        // If the difference between two successive
        // iterates is less than eps, stop

        const xabs = Math.abs(x1 - x0);
        if (xabs < eps) return ans;
      }

      throw new Error('tukey.inv failed to converge');
    }
  });

  /* Provides functions for the solution of linear system of equations, integration, extrapolation,
   * interpolation, eigenvalue problems, differential equations and PCA analysis. */


  const push = Array.prototype.push;
  const isArray$1 = jStat.utils.isArray;

  const isUsable = (arg) => isArray$1(arg) || arg instanceof jStat;

  // Helper for lstsq: compute the inverse of an upper triangular matrix R
  function _lstsq_R_I(A) {
    A = jStat.copy(A);
    const size = A.length;
    const I = jStat.identity(size);
    jStat.arange(size - 1, -1, -1).forEach((i) => {
      jStat.sliceAssign(I, { row: i }, jStat.divide(jStat.slice(I, { row: i }), A[i][i]));
      jStat.sliceAssign(A, { row: i }, jStat.divide(jStat.slice(A, { row: i }), A[i][i]));
      jStat.arange(i).forEach((j) => {
        const c = jStat.multiply(A[j][i], -1);
        const Aj = jStat.slice(A, { row: j });
        const cAi = jStat.multiply(jStat.slice(A, { row: i }), c);
        jStat.sliceAssign(A, { row: j }, jStat.add(Aj, cAi));
        const Ij = jStat.slice(I, { row: j });
        const cIi = jStat.multiply(jStat.slice(I, { row: i }), c);
        jStat.sliceAssign(I, { row: j }, jStat.add(Ij, cIi));
      });
    });
    return I;
  }

  jStat.extend({
    // add a vector/matrix to a vector/matrix or scalar
    add: function add(arr, arg) {
      // check if arg is a vector or scalar
      if (isUsable(arg)) {
        if (!isUsable(arg[0])) arg = [arg];
        return jStat.map(arr, (value, row, col) => value + arg[row][col]);
      }
      return jStat.map(arr, (value) => value + arg);
    },

    // subtract a vector or scalar from the vector
    subtract: function subtract(arr, arg) {
      // check if arg is a vector or scalar
      if (isUsable(arg)) {
        if (!isUsable(arg[0])) arg = [arg];
        return jStat.map(arr, (value, row, col) => value - arg[row][col] || 0);
      }
      return jStat.map(arr, (value) => value - arg);
    },

    // matrix division
    divide: function divide(arr, arg) {
      if (isUsable(arg)) {
        if (!isUsable(arg[0])) arg = [arg];
        return jStat.multiply(arr, jStat.inv(arg));
      }
      return jStat.map(arr, (value) => value / arg);
    },

    // matrix multiplication
    multiply: function multiply(arr, arg) {
      let row, col, nrescols, sum, nrow, ncol, res, rescols;
      // eg: arr = 2 arg = 3 -> 6 for res[0][0] statement closure
      if (arr.length === undefined && arg.length === undefined) {
        return arr * arg;
      }
      ((nrow = arr.length),
        (ncol = arr[0].length),
        (res = jStat.zeros(nrow, (nrescols = isUsable(arg) ? arg[0].length : ncol))),
        (rescols = 0));
      if (isUsable(arg)) {
        for (; rescols < nrescols; rescols++) {
          for (row = 0; row < nrow; row++) {
            sum = 0;
            for (col = 0; col < ncol; col++) sum += arr[row][col] * arg[col][rescols];
            res[row][rescols] = sum;
          }
        }
        return nrow === 1 && rescols === 1 ? res[0][0] : res;
      }
      return jStat.map(arr, (value) => value * arg);
    },

    // outer([1,2,3],[4,5,6])
    // ===
    // [[1],[2],[3]] times [[4,5,6]]
    // ->
    // [[4,5,6],[8,10,12],[12,15,18]]
    outer: function outer(A, B) {
      return jStat.multiply(
        A.map((t) => [t]),
        [B]
      );
    },

    // Returns the dot product of two matricies
    dot: function dot(arr, arg) {
      if (!isUsable(arr[0])) arr = [arr];
      if (!isUsable(arg[0])) arg = [arg];
      // convert column to row vector
      const left = arr[0].length === 1 && arr.length !== 1 ? jStat.transpose(arr) : arr;
      const right = arg[0].length === 1 && arg.length !== 1 ? jStat.transpose(arg) : arg;
      const res = [];
      let row = 0;
      const nrow = left.length;
      const ncol = left[0].length;
      let sum, col;
      for (; row < nrow; row++) {
        res[row] = [];
        sum = 0;
        for (col = 0; col < ncol; col++) sum += left[row][col] * right[row][col];
        res[row] = sum;
      }
      return res.length === 1 ? res[0] : res;
    },

    // raise every element by a scalar
    pow: function pow(arr, arg) {
      return jStat.map(arr, (value) => Math.pow(value, arg));
    },

    // exponentiate every element
    exp: function exp(arr) {
      return jStat.map(arr, (value) => Math.exp(value));
    },

    // generate the natural log of every element
    log: function exp(arr) {
      return jStat.map(arr, (value) => Math.log(value));
    },

    // generate the absolute values of the vector
    abs: function abs(arr) {
      return jStat.map(arr, (value) => Math.abs(value));
    },

    // computes the p-norm of the vector
    // In the case that a matrix is passed, uses the first row as the vector
    norm: function norm(arr, p) {
      let nnorm = 0;
      let i = 0;
      // check the p-value of the norm, and set for most common case
      if (isNaN(p)) p = 2;
      // check if multi-dimensional array, and make vector correction
      if (isUsable(arr[0])) arr = arr[0];
      // vector norm
      for (; i < arr.length; i++) {
        nnorm += Math.pow(Math.abs(arr[i]), p);
      }
      return Math.pow(nnorm, 1 / p);
    },

    // computes the angle between two vectors in rads
    // In case a matrix is passed, this uses the first row as the vector
    angle: function angle(arr, arg) {
      return Math.acos(jStat.dot(arr, arg) / (jStat.norm(arr) * jStat.norm(arg)));
    },

    // augment one matrix by another
    // Note: this function returns a matrix, not a jStat object
    aug: function aug(a, b) {
      const newarr = [];
      let i;
      for (i = 0; i < a.length; i++) {
        newarr.push(a[i].slice());
      }
      for (i = 0; i < newarr.length; i++) {
        push.apply(newarr[i], b[i]);
      }
      return newarr;
    },

    // The inv() function calculates the inverse of a matrix
    // Create the inverse by augmenting the matrix by the identity matrix of the
    // appropriate size, and then use G-J elimination on the augmented matrix.
    inv: function inv(a) {
      const rows = a.length;
      const cols = a[0].length;
      const b = jStat.identity(rows, cols);
      const c = jStat.gauss_jordan(a, b);
      const result = [];
      let i = 0;
      let j;

      //We need to copy the inverse portion to a new matrix to rid G-J artifacts
      for (; i < rows; i++) {
        result[i] = [];
        for (j = cols; j < c[0].length; j++) result[i][j - cols] = c[i][j];
      }
      return result;
    },

    // calculate the determinant of a matrix
    det: function det(a) {
      if (a.length === 2) {
        return a[0][0] * a[1][1] - a[0][1] * a[1][0];
      }

      let determinant = 0;
      for (let i = 0; i < a.length; i++) {
        // build a sub matrix without column `i`
        const submatrix = [];
        for (let row = 1; row < a.length; row++) {
          submatrix[row - 1] = [];
          for (let col = 0; col < a.length; col++) {
            if (col < i) {
              submatrix[row - 1][col] = a[row][col];
            } else if (col > i) {
              submatrix[row - 1][col - 1] = a[row][col];
            }
          }
        }

        // alternate between + and - between determinants
        const sign = i % 2 ? -1 : 1;
        determinant += det(submatrix) * a[0][i] * sign;
      }

      return determinant;
    },

    gauss_elimination: function gauss_elimination(a, b) {
      let i = 0;
      let j = 0;
      const n = a.length;
      const m = a[0].length;
      let factor = 1;
      let sum = 0;
      const x = [];
      let pivot, temp, k;
      a = jStat.aug(a, b);
      const maug = a[0].length;
      for (i = 0; i < n; i++) {
        pivot = a[i][i];
        j = i;
        for (k = i + 1; k < m; k++) {
          if (pivot < Math.abs(a[k][i])) {
            pivot = a[k][i];
            j = k;
          }
        }
        if (j !== i) {
          for (k = 0; k < maug; k++) {
            temp = a[i][k];
            a[i][k] = a[j][k];
            a[j][k] = temp;
          }
        }
        for (j = i + 1; j < n; j++) {
          factor = a[j][i] / a[i][i];
          for (k = i; k < maug; k++) {
            a[j][k] = a[j][k] - factor * a[i][k];
          }
        }
      }
      for (i = n - 1; i >= 0; i--) {
        sum = 0;
        for (j = i + 1; j <= n - 1; j++) {
          sum = sum + x[j] * a[i][j];
        }
        x[i] = (a[i][maug - 1] - sum) / a[i][i];
      }
      return x;
    },

    gauss_jordan: function gauss_jordan(a, b) {
      const m = jStat.aug(a, b);
      const h = m.length;
      const w = m[0].length;
      let c = 0;
      let x, y, y2;
      // find max pivot
      for (y = 0; y < h; y++) {
        let maxrow = y;
        for (y2 = y + 1; y2 < h; y2++) {
          if (Math.abs(m[y2][y]) > Math.abs(m[maxrow][y])) maxrow = y2;
        }
        const tmp = m[y];
        m[y] = m[maxrow];
        m[maxrow] = tmp;
        for (y2 = y + 1; y2 < h; y2++) {
          c = m[y2][y] / m[y][y];
          for (x = y; x < w; x++) {
            m[y2][x] -= m[y][x] * c;
          }
        }
      }
      // backsubstitute
      for (y = h - 1; y >= 0; y--) {
        c = m[y][y];
        for (y2 = 0; y2 < y; y2++) {
          for (x = w - 1; x > y - 1; x--) {
            m[y2][x] -= (m[y][x] * m[y2][y]) / c;
          }
        }
        m[y][y] /= c;
        for (x = h; x < w; x++) {
          m[y][x] /= c;
        }
      }
      return m;
    },

    // solve equation
    // Ax=b
    // A is upper triangular matrix
    // A=[[1,2,3],[0,4,5],[0,6,7]]
    // b=[1,2,3]
    // triaUpSolve(A,b) // -> [2.666,0.1666,1.666]
    // if you use matrix style
    // A=[[1,2,3],[0,4,5],[0,6,7]]
    // b=[[1],[2],[3]]
    // will return [[2.666],[0.1666],[1.666]]
    triaUpSolve: function triaUpSolve(A, b) {
      const size = A[0].length;
      const x = jStat.zeros(1, size)[0];
      let parts;
      let matrix_mode = false;

      if (b[0].length !== undefined) {
        b = b.map((i) => i[0]);
        matrix_mode = true;
      }

      jStat.arange(size - 1, -1, -1).forEach((i) => {
        parts = jStat.arange(i + 1, size).map((j) => x[j] * A[i][j]);
        x[i] = (b[i] - jStat.sum(parts)) / A[i][i];
      });

      if (matrix_mode) return x.map((i) => [i]);
      return x;
    },

    triaLowSolve: function triaLowSolve(A, b) {
      // like to triaUpSolve but A is lower triangular matrix
      const size = A[0].length;
      const x = jStat.zeros(1, size)[0];
      let parts;

      let matrix_mode = false;
      if (b[0].length !== undefined) {
        b = b.map((i) => i[0]);
        matrix_mode = true;
      }

      jStat.arange(size).forEach((i) => {
        parts = jStat.arange(i).map((j) => A[i][j] * x[j]);
        x[i] = (b[i] - jStat.sum(parts)) / A[i][i];
      });

      if (matrix_mode) return x.map((i) => [i]);
      return x;
    },

    // A -> [L,U]
    // A=LU
    // L is lower triangular matrix
    // U is upper triangular matrix
    lu: function lu(A) {
      const size = A.length;
      //var L=jStat.diagonal(jStat.ones(1,size)[0]);
      const L = jStat.identity(size);
      const R = jStat.zeros(A.length, A[0].length);
      let parts;
      jStat.arange(size).forEach((t) => {
        R[0][t] = A[0][t];
      });
      jStat.arange(1, size).forEach((l) => {
        jStat.arange(l).forEach((i) => {
          parts = jStat.arange(i).map((jj) => L[l][jj] * R[jj][i]);
          L[l][i] = (A[l][i] - jStat.sum(parts)) / R[i][i];
        });
        jStat.arange(l, size).forEach((j) => {
          parts = jStat.arange(l).map((jj) => L[l][jj] * R[jj][j]);
          R[l][j] = A[parts.length][j] - jStat.sum(parts);
        });
      });
      return [L, R];
    },

    // A -> T
    // A=TT'
    // T is lower triangular matrix
    cholesky: function cholesky(A) {
      const size = A.length;
      const T = jStat.zeros(A.length, A[0].length);
      let parts;
      jStat.arange(size).forEach((i) => {
        parts = jStat.arange(i).map((t) => Math.pow(T[i][t], 2));
        T[i][i] = Math.sqrt(A[i][i] - jStat.sum(parts));
        jStat.arange(i + 1, size).forEach((j) => {
          parts = jStat.arange(i).map((t) => T[i][t] * T[j][t]);
          T[j][i] = (A[i][j] - jStat.sum(parts)) / T[i][i];
        });
      });
      return T;
    },

    gauss_jacobi: function gauss_jacobi(a, b, x, r) {
      let i = 0;
      let j = 0;
      const n = a.length;
      const l = [];
      const u = [];
      const d = [];
      let xv, xk;
      for (; i < n; i++) {
        l[i] = [];
        u[i] = [];
        d[i] = [];
        for (j = 0; j < n; j++) {
          if (i > j) {
            l[i][j] = a[i][j];
            u[i][j] = d[i][j] = 0;
          } else if (i < j) {
            u[i][j] = a[i][j];
            l[i][j] = d[i][j] = 0;
          } else {
            d[i][j] = a[i][j];
            l[i][j] = u[i][j] = 0;
          }
        }
      }
      const h = jStat.multiply(jStat.multiply(jStat.inv(d), jStat.add(l, u)), -1);
      const c = jStat.multiply(jStat.inv(d), b);
      xv = x;
      xk = jStat.add(jStat.multiply(h, x), c);
      i = 2;
      while (Math.abs(jStat.norm(jStat.subtract(xk, xv))) > r) {
        xv = xk;
        xk = jStat.add(jStat.multiply(h, xv), c);
        i++;
      }
      return xk;
    },

    gauss_seidel: function gauss_seidel(a, b, x, r) {
      let i = 0;
      const n = a.length;
      const l = [];
      const u = [];
      const d = [];
      let j, xv, xk;
      for (; i < n; i++) {
        l[i] = [];
        u[i] = [];
        d[i] = [];
        for (j = 0; j < n; j++) {
          if (i > j) {
            l[i][j] = a[i][j];
            u[i][j] = d[i][j] = 0;
          } else if (i < j) {
            u[i][j] = a[i][j];
            l[i][j] = d[i][j] = 0;
          } else {
            d[i][j] = a[i][j];
            l[i][j] = u[i][j] = 0;
          }
        }
      }
      const h = jStat.multiply(jStat.multiply(jStat.inv(jStat.add(d, l)), u), -1);
      const c = jStat.multiply(jStat.inv(jStat.add(d, l)), b);
      xv = x;
      xk = jStat.add(jStat.multiply(h, x), c);
      i = 2;
      while (Math.abs(jStat.norm(jStat.subtract(xk, xv))) > r) {
        xv = xk;
        xk = jStat.add(jStat.multiply(h, xv), c);
        i = i + 1;
      }
      return xk;
    },

    SOR: function SOR(a, b, x, r, w) {
      let i = 0;
      const n = a.length;
      const l = [];
      const u = [];
      const d = [];
      let j, xv, xk;
      for (; i < n; i++) {
        l[i] = [];
        u[i] = [];
        d[i] = [];
        for (j = 0; j < n; j++) {
          if (i > j) {
            l[i][j] = a[i][j];
            u[i][j] = d[i][j] = 0;
          } else if (i < j) {
            u[i][j] = a[i][j];
            l[i][j] = d[i][j] = 0;
          } else {
            d[i][j] = a[i][j];
            l[i][j] = u[i][j] = 0;
          }
        }
      }
      const h = jStat.multiply(
        jStat.inv(jStat.add(d, jStat.multiply(l, w))),
        jStat.subtract(jStat.multiply(d, 1 - w), jStat.multiply(u, w))
      );
      const c = jStat.multiply(jStat.multiply(jStat.inv(jStat.add(d, jStat.multiply(l, w))), b), w);
      xv = x;
      xk = jStat.add(jStat.multiply(h, x), c);
      i = 2;
      while (Math.abs(jStat.norm(jStat.subtract(xk, xv))) > r) {
        xv = xk;
        xk = jStat.add(jStat.multiply(h, xv), c);
        i++;
      }
      return xk;
    },

    householder: function householder(a) {
      const m = a.length;
      const n = a[0].length;
      let i = 0;
      let w = [];
      let p = [];
      let alpha, r, k, j, factor;
      for (; i < m - 1; i++) {
        alpha = 0;
        for (j = i + 1; j < n; j++) alpha += a[j][i] * a[j][i];
        factor = a[i + 1][i] > 0 ? -1 : 1;
        alpha = factor * Math.sqrt(alpha);
        r = Math.sqrt((alpha * alpha - a[i + 1][i] * alpha) / 2);
        w = jStat.zeros(m, 1);
        w[i + 1][0] = (a[i + 1][i] - alpha) / (2 * r);
        for (k = i + 2; k < m; k++) w[k][0] = a[k][i] / (2 * r);
        p = jStat.subtract(
          jStat.identity(m, n),
          jStat.multiply(jStat.multiply(w, jStat.transpose(w)), 2)
        );
        a = jStat.multiply(p, jStat.multiply(a, p));
      }
      return a;
    },

    // A -> [Q,R]
    // Q is orthogonal matrix
    // R is upper triangular
    QR: function QR(x) {
      // x -> Q
      // find a orthogonal matrix Q st.
      // Qx=y
      // y is [||x||,0,0,...]

      // quick ref
      const sum = jStat.sum;
      const range = jStat.arange;

      // quick impletation
      // https://www.stat.wisc.edu/~larget/math496/qr.html

      const n = x.length;
      const p = x[0].length;

      const r = jStat.zeros(p, p);
      x = jStat.copy(x);

      let i, j, k;
      for (j = 0; j < p; j++) {
        r[j][j] = Math.sqrt(sum(range(n).map((i) => x[i][j] * x[i][j])));
        for (i = 0; i < n; i++) {
          x[i][j] = x[i][j] / r[j][j];
        }
        for (k = j + 1; k < p; k++) {
          r[j][k] = sum(range(n).map((i) => x[i][j] * x[i][k]));
          for (i = 0; i < n; i++) {
            x[i][k] = x[i][k] - x[i][j] * r[j][k];
          }
        }
      }
      return [x, r];
    },

    lstsq: function lstsq(A, b) {
      // solve least squard problem for Ax=b as QR decomposition way if b is
      // [[b1],[b2],[b3]] form will return [[x1],[x2],[x3]] array form solution
      // else b is [b1,b2,b3] form will return [x1,x2,x3] array form solution
      let array_mode = false;
      if (b[0].length === undefined) {
        // [c1,c2,c3] mode
        b = b.map((x) => [x]);
        array_mode = true;
      }
      const QR = jStat.QR(A);
      const Q = QR[0];
      const R = QR[1];
      const attrs = A[0].length;
      const Q1 = jStat.slice(Q, { col: { end: attrs } });
      const R1 = jStat.slice(R, { row: { end: attrs } });
      const RI = _lstsq_R_I(R1);
      let Q2 = jStat.transpose(Q1);

      if (Q2[0].length === undefined) {
        Q2 = [Q2]; // The confusing jStat.multifly implementation threat nature process again.
      }

      let x = jStat.multiply(jStat.multiply(RI, Q2), b);

      if (x.length === undefined) {
        x = [[x]]; // The confusing jStat.multifly implementation threat nature process again.
      }

      if (array_mode) return x.map((i) => i[0]);
      return x;
    },

    jacobi: function jacobi(a) {
      let condition = 1;
      const n = a.length;
      let e = jStat.identity(n, n);
      const ev = [];
      let b, i, j, p, q, maxim, theta, s;
      // condition === 1 only if tolerance is not reached
      while (condition === 1) {
        maxim = a[0][1];
        p = 0;
        q = 1;
        for (i = 0; i < n; i++) {
          for (j = 0; j < n; j++) {
            if (i !== j) {
              if (maxim < Math.abs(a[i][j])) {
                maxim = Math.abs(a[i][j]);
                p = i;
                q = j;
              }
            }
          }
        }
        if (a[p][p] === a[q][q]) theta = a[p][q] > 0 ? Math.PI / 4 : -Math.PI / 4;
        else theta = Math.atan((2 * a[p][q]) / (a[p][p] - a[q][q])) / 2;
        s = jStat.identity(n, n);
        s[p][p] = Math.cos(theta);
        s[p][q] = -Math.sin(theta);
        s[q][p] = Math.sin(theta);
        s[q][q] = Math.cos(theta);
        // eigen vector matrix
        e = jStat.multiply(e, s);
        b = jStat.multiply(jStat.multiply(jStat.inv(s), a), s);
        a = b;
        condition = 0;
        for (i = 1; i < n; i++) {
          for (j = 1; j < n; j++) {
            if (i !== j && Math.abs(a[i][j]) > 0.001) {
              condition = 1;
            }
          }
        }
      }
      for (i = 0; i < n; i++) ev.push(a[i][i]);
      //returns both the eigenvalue and eigenmatrix
      return [e, ev];
    },

    rungekutta: function rungekutta(f, h, p, t_j, u_j, order) {
      let k1, k2, u_j1, k3, k4;
      if (order === 2) {
        while (t_j <= p) {
          k1 = h * f(t_j, u_j);
          k2 = h * f(t_j + h, u_j + k1);
          u_j1 = u_j + (k1 + k2) / 2;
          u_j = u_j1;
          t_j = t_j + h;
        }
      }
      if (order === 4) {
        while (t_j <= p) {
          k1 = h * f(t_j, u_j);
          k2 = h * f(t_j + h / 2, u_j + k1 / 2);
          k3 = h * f(t_j + h / 2, u_j + k2 / 2);
          k4 = h * f(t_j + h, u_j + k3);
          u_j1 = u_j + (k1 + 2 * k2 + 2 * k3 + k4) / 6;
          u_j = u_j1;
          t_j = t_j + h;
        }
      }
      return u_j;
    },

    romberg: function romberg(f, a, b, order) {
      let i = 0;
      let h = (b - a) / 2;
      const x = [];
      let h1 = [];
      let g = [];
      let m, a1, j, k, I;
      while (i < order / 2) {
        I = f(a);
        for (j = a, k = 0; j <= b; j = j + h, k++) x[k] = j;
        m = x.length;
        for (j = 1; j < m - 1; j++) {
          I += (j % 2 !== 0 ? 4 : 2) * f(x[j]);
        }
        I = (h / 3) * (I + f(b));
        g[i] = I;
        h /= 2;
        i++;
      }
      a1 = g.length;
      m = 1;
      while (a1 !== 1) {
        for (j = 0; j < a1 - 1; j++)
          h1[j] = (Math.pow(4, m) * g[j + 1] - g[j]) / (Math.pow(4, m) - 1);
        a1 = h1.length;
        g = h1;
        h1 = [];
        m++;
      }
      return g;
    },

    richardson: function richardson(X, f, x, h) {
      function pos(X, x) {
        let i = 0;
        const n = X.length;
        let p;
        for (; i < n; i++) if (X[i] === x) p = i;
        return p;
      }
      const h_min = Math.abs(x - X[pos(X, x) + 1]);
      let i = 0;
      let g = [];
      let h1 = [];
      let y1, y2, m, a, j;
      while (h >= h_min) {
        y1 = pos(X, x + h);
        y2 = pos(X, x);
        g[i] = (f[y1] - 2 * f[y2] + f[2 * y2 - y1]) / (h * h);
        h /= 2;
        i++;
      }
      a = g.length;
      m = 1;
      while (a !== 1) {
        for (j = 0; j < a - 1; j++) h1[j] = (Math.pow(4, m) * g[j + 1] - g[j]) / (Math.pow(4, m) - 1);
        a = h1.length;
        g = h1;
        h1 = [];
        m++;
      }
      return g;
    },

    simpson: function simpson(f, a, b, n) {
      const h = (b - a) / n;
      let I = f(a);
      const x = [];
      let j = a;
      let k = 0;
      let i = 1;
      for (; j <= b; j = j + h, k++) x[k] = j;
      const m = x.length;
      for (; i < m - 1; i++) {
        I += (i % 2 !== 0 ? 4 : 2) * f(x[i]);
      }
      return (h / 3) * (I + f(b));
    },

    hermite: function hermite(X, F, dF, value) {
      const n = X.length;
      let p = 0;
      let i = 0;
      const l = [];
      const dl = [];
      const A = [];
      const B = [];
      let j;
      for (; i < n; i++) {
        l[i] = 1;
        for (j = 0; j < n; j++) {
          if (i !== j) l[i] *= (value - X[j]) / (X[i] - X[j]);
        }
        dl[i] = 0;
        for (j = 0; j < n; j++) {
          if (i !== j) dl[i] += 1 / (X[i] - X[j]);
        }
        A[i] = (1 - 2 * (value - X[i]) * dl[i]) * (l[i] * l[i]);
        B[i] = (value - X[i]) * (l[i] * l[i]);
        p += A[i] * F[i] + B[i] * dF[i];
      }
      return p;
    },

    lagrange: function lagrange(X, F, value) {
      let p = 0;
      let i = 0;
      let j, l;
      const n = X.length;
      for (; i < n; i++) {
        l = F[i];
        for (j = 0; j < n; j++) {
          // calculating the lagrange polynomial L_i
          if (i !== j) l *= (value - X[j]) / (X[i] - X[j]);
        }
        // adding the lagrange polynomials found above
        p += l;
      }
      return p;
    },

    cubic_spline: function cubic_spline(X, F, value) {
      const n = X.length;
      let i = 0,
        j;
      const A = [];
      const B = [];
      const alpha = [];
      let c = [];
      const h = [];
      const b = [];
      const d = [];
      for (; i < n - 1; i++) h[i] = X[i + 1] - X[i];
      alpha[0] = 0;
      for (i = 1; i < n - 1; i++) {
        alpha[i] = (3 / h[i]) * (F[i + 1] - F[i]) - (3 / h[i - 1]) * (F[i] - F[i - 1]);
      }
      for (i = 1; i < n - 1; i++) {
        A[i] = [];
        B[i] = [];
        A[i][i - 1] = h[i - 1];
        A[i][i] = 2 * (h[i - 1] + h[i]);
        A[i][i + 1] = h[i];
        B[i][0] = alpha[i];
      }
      c = jStat.multiply(jStat.inv(A), B);
      for (j = 0; j < n - 1; j++) {
        b[j] = (F[j + 1] - F[j]) / h[j] - (h[j] * (c[j + 1][0] + 2 * c[j][0])) / 3;
        d[j] = (c[j + 1][0] - c[j][0]) / (3 * h[j]);
      }
      for (j = 0; j < n; j++) {
        if (X[j] > value) break;
      }
      j -= 1;
      return (
        F[j] +
        (value - X[j]) * b[j] +
        jStat.sq(value - X[j]) * c[j] +
        (value - X[j]) * jStat.sq(value - X[j]) * d[j]
      );
    },

    gauss_quadrature: function gauss_quadrature() {
      throw new Error('gauss_quadrature not yet implemented');
    },

    PCA: function PCA(X) {
      const m = X.length;
      const n = X[0].length;
      let i = 0;
      let j, temp1;
      const u = [];
      let D = [];
      let result = [];
      let temp2 = [];
      const Y = [];
      let Bt = [];
      let B = [];
      const C = [];
      let V = [];
      let Vt = [];
      for (i = 0; i < m; i++) {
        u[i] = jStat.sum(X[i]) / n;
      }
      for (i = 0; i < n; i++) {
        B[i] = [];
        for (j = 0; j < m; j++) {
          B[i][j] = X[j][i] - u[j];
        }
      }
      B = jStat.transpose(B);
      for (i = 0; i < m; i++) {
        C[i] = [];
        for (j = 0; j < m; j++) {
          C[i][j] = jStat.dot([B[i]], [B[j]]) / (n - 1);
        }
      }
      result = jStat.jacobi(C);
      V = result[0];
      D = result[1];
      Vt = jStat.transpose(V);
      for (i = 0; i < D.length; i++) {
        for (j = i; j < D.length; j++) {
          if (D[i] < D[j]) {
            temp1 = D[i];
            D[i] = D[j];
            D[j] = temp1;
            temp2 = Vt[i];
            Vt[i] = Vt[j];
            Vt[j] = temp2;
          }
        }
      }
      Bt = jStat.transpose(B);
      for (i = 0; i < m; i++) {
        Y[i] = [];
        for (j = 0; j < Bt.length; j++) {
          Y[i][j] = jStat.dot([Vt[i]], [Bt[j]]);
        }
      }
      return [X, D, Vt, Y];
    }
  });

  // extend jStat.fn with methods that require one argument
  for (const passfunc of 'add divide multiply subtract dot pow exp log abs norm angle'.split(' ')) {
    jStat.fn[passfunc] = function (arg, func) {
      const tmpthis = this;
      // check for callback
      if (func) {
        setTimeout(() => {
          func.call(tmpthis, jStat.fn[passfunc].call(tmpthis, arg));
        }, 15);
        return this;
      }
      if (typeof jStat[passfunc](this, arg) === 'number') return jStat[passfunc](this, arg);
      else return jStat(jStat[passfunc](this, arg));
    };
  }

  const isNumber = jStat.utils.isNumber;
  const isArray = jStat.utils.isArray;

  // flag==true denotes use of sample standard deviation
  // Z Statistics
  jStat.extend({
    // 2 different parameter lists:
    // (value, mean, sd)
    // (value, array, flag)
    zscore: function zscore(...args) {
      if (isNumber(args[1])) {
        return (args[0] - args[1]) / args[2];
      }
      return (args[0] - jStat.mean(args[1])) / jStat.stdev(args[1], args[2]);
    },

    // 3 different paramter lists:
    // (value, mean, sd, sides)
    // (zscore, sides)
    // (value, array, sides, flag)
    ztest: function ztest(...args) {
      let z;
      if (isArray(args[1])) {
        // (value, array, sides, flag)
        z = jStat.zscore(args[0], args[1], args[3]);
        return args[2] === 1
          ? jStat.normal.cdf(-Math.abs(z), 0, 1)
          : jStat.normal.cdf(-Math.abs(z), 0, 1) * 2;
      } else {
        if (args.length > 2) {
          // (value, mean, sd, sides)
          z = jStat.zscore(args[0], args[1], args[2]);
          return args[3] === 1
            ? jStat.normal.cdf(-Math.abs(z), 0, 1)
            : jStat.normal.cdf(-Math.abs(z), 0, 1) * 2;
        } else {
          // (zscore, sides)
          z = args[0];
          return args[1] === 1
            ? jStat.normal.cdf(-Math.abs(z), 0, 1)
            : jStat.normal.cdf(-Math.abs(z), 0, 1) * 2;
        }
      }
    }
  });

  jStat.extend(jStat.fn, {
    zscore: function zscore(value, flag) {
      return (value - this.mean()) / this.stdev(flag);
    },

    ztest: function ztest(value, sides, flag) {
      const zscore = Math.abs(this.zscore(value, flag));
      return sides === 1 ? jStat.normal.cdf(-zscore, 0, 1) : jStat.normal.cdf(-zscore, 0, 1) * 2;
    }
  });

  // T Statistics
  jStat.extend({
    // 2 parameter lists
    // (value, mean, sd, n)
    // (value, array)
    tscore: function tscore(...args) {
      return args.length === 4
        ? (args[0] - args[1]) / (args[2] / Math.sqrt(args[3]))
        : (args[0] - jStat.mean(args[1])) / (jStat.stdev(args[1], true) / Math.sqrt(args[1].length));
    },

    // 3 different paramter lists:
    // (value, mean, sd, n, sides)
    // (tscore, n, sides)
    // (value, array, sides)
    ttest: function ttest(...args) {
      let tscore;
      if (args.length === 5) {
        tscore = Math.abs(jStat.tscore(args[0], args[1], args[2], args[3]));
        return args[4] === 1
          ? jStat.studentt.cdf(-tscore, args[3] - 1)
          : jStat.studentt.cdf(-tscore, args[3] - 1) * 2;
      }
      if (isNumber(args[1])) {
        tscore = Math.abs(args[0]);
        return args[2] === 1
          ? jStat.studentt.cdf(-tscore, args[1] - 1)
          : jStat.studentt.cdf(-tscore, args[1] - 1) * 2;
      }
      tscore = Math.abs(jStat.tscore(args[0], args[1]));
      return args[2] === 1
        ? jStat.studentt.cdf(-tscore, args[1].length - 1)
        : jStat.studentt.cdf(-tscore, args[1].length - 1) * 2;
    }
  });

  jStat.extend(jStat.fn, {
    tscore: function tscore(value) {
      return (value - this.mean()) / (this.stdev(true) / Math.sqrt(this.cols()));
    },

    ttest: function ttest(value, sides) {
      return sides === 1
        ? 1 - jStat.studentt.cdf(Math.abs(this.tscore(value)), this.cols() - 1)
        : jStat.studentt.cdf(-Math.abs(this.tscore(value)), this.cols() - 1) * 2;
    }
  });

  // F Statistics
  jStat.extend({
    // Paramter list is as follows:
    // (array1, array2, array3, ...)
    // or it is an array of arrays
    // array of arrays conversion
    anovafscore: function anovafscore(...args) {
      let expVar, sample, sampSampMean, tmpargs, unexpVar, i, j;
      if (args.length === 1) {
        tmpargs = new Array(args[0].length);
        for (i = 0; i < args[0].length; i++) {
          tmpargs[i] = args[0][i];
        }
        args = tmpargs;
      }
      // Builds sample array
      sample = [];
      for (i = 0; i < args.length; i++) {
        sample = sample.concat(args[i]);
      }
      const sampMean = jStat.mean(sample);
      // Computes the explained variance
      expVar = 0;
      for (i = 0; i < args.length; i++) {
        expVar = expVar + args[i].length * Math.pow(jStat.mean(args[i]) - sampMean, 2);
      }
      expVar /= args.length - 1;
      // Computes unexplained variance
      unexpVar = 0;
      for (i = 0; i < args.length; i++) {
        sampSampMean = jStat.mean(args[i]);
        for (j = 0; j < args[i].length; j++) {
          unexpVar += Math.pow(args[i][j] - sampSampMean, 2);
        }
      }
      unexpVar /= sample.length - args.length;
      return expVar / unexpVar;
    },

    // 2 different paramter setups
    // (array1, array2, array3, ...)
    // (anovafscore, df1, df2)
    anovaftest: function anovaftest(...args) {
      let n, i;
      if (isNumber(args[0])) {
        return 1 - jStat.centralF.cdf(args[0], args[1], args[2]);
      }
      const anovafscore = jStat.anovafscore(args);
      const df1 = args.length - 1;
      n = 0;
      for (i = 0; i < args.length; i++) {
        n = n + args[i].length;
      }
      const df2 = n - df1 - 1;
      return 1 - jStat.centralF.cdf(anovafscore, df1, df2);
    },

    ftest: function ftest(fscore, df1, df2) {
      return 1 - jStat.centralF.cdf(fscore, df1, df2);
    }
  });

  jStat.extend(jStat.fn, {
    anovafscore: function anovafscore() {
      return jStat.anovafscore(this.toArray());
    },

    anovaftes: function anovaftes() {
      let n = 0;
      let i;
      for (i = 0; i < this.length; i++) {
        n = n + this[i].length;
      }
      return jStat.ftest(this.anovafscore(), this.length - 1, n - this.length);
    }
  });

  // Tukey's range test
  jStat.extend({
    // 2 parameter lists
    // (mean1, mean2, n1, n2, sd)
    // (array1, array2, sd)
    qscore: function qscore(...args) {
      let mean1, mean2, n1, n2, sd;
      if (isNumber(args[0])) {
        mean1 = args[0];
        mean2 = args[1];
        n1 = args[2];
        n2 = args[3];
        sd = args[4];
      } else {
        mean1 = jStat.mean(args[0]);
        mean2 = jStat.mean(args[1]);
        n1 = args[0].length;
        n2 = args[1].length;
        sd = args[2];
      }
      return Math.abs(mean1 - mean2) / (sd * Math.sqrt((1 / n1 + 1 / n2) / 2));
    },

    // 3 different parameter lists:
    // (qscore, n, k)
    // (mean1, mean2, n1, n2, sd, n, k)
    // (array1, array2, sd, n, k)
    qtest: function qtest(...args) {
      let qscore;
      if (args.length === 3) {
        qscore = args[0];
        args = args.slice(1);
      } else if (args.length === 7) {
        qscore = jStat.qscore(args[0], args[1], args[2], args[3], args[4]);
        args = args.slice(5);
      } else {
        qscore = jStat.qscore(args[0], args[1], args[2]);
        args = args.slice(3);
      }

      const n = args[0];
      const k = args[1];

      return 1 - jStat.tukey.cdf(qscore, k, n - k);
    },

    tukeyhsd: function tukeyhsd(arrays) {
      const sd = jStat.pooledstdev(arrays);
      const means = arrays.map((arr) => jStat.mean(arr));
      const n = arrays.reduce((n, arr) => n + arr.length, 0);

      const results = [];
      for (let i = 0; i < arrays.length; ++i) {
        for (let j = i + 1; j < arrays.length; ++j) {
          const p = jStat.qtest(
            means[i],
            means[j],
            arrays[i].length,
            arrays[j].length,
            sd,
            n,
            arrays.length
          );
          results.push([[i, j], p]);
        }
      }

      return results;
    }
  });

  // Error Bounds
  jStat.extend({
    // 2 different parameter setups
    // (value, alpha, sd, n)
    // (value, alpha, array)
    normalci: function normalci(...args) {
      const ans = new Array(2);
      let change;
      if (args.length === 4) {
        change = Math.abs((jStat.normal.inv(args[1] / 2, 0, 1) * args[2]) / Math.sqrt(args[3]));
      } else {
        change = Math.abs(
          (jStat.normal.inv(args[1] / 2, 0, 1) * jStat.stdev(args[2])) / Math.sqrt(args[2].length)
        );
      }
      ans[0] = args[0] - change;
      ans[1] = args[0] + change;
      return ans;
    },

    // 2 different parameter setups
    // (value, alpha, sd, n)
    // (value, alpha, array)
    tci: function tci(...args) {
      const ans = new Array(2);
      let change;
      if (args.length === 4) {
        change = Math.abs(
          (jStat.studentt.inv(args[1] / 2, args[3] - 1) * args[2]) / Math.sqrt(args[3])
        );
      } else {
        change = Math.abs(
          (jStat.studentt.inv(args[1] / 2, args[2].length - 1) * jStat.stdev(args[2], true)) /
            Math.sqrt(args[2].length)
        );
      }
      ans[0] = args[0] - change;
      ans[1] = args[0] + change;
      return ans;
    },

    significant: function significant(pvalue, alpha) {
      return pvalue < alpha;
    }
  });

  jStat.extend(jStat.fn, {
    normalci: function normalci(value, alpha) {
      return jStat.normalci(value, alpha, this.toArray());
    },

    tci: function tci(value, alpha) {
      return jStat.tci(value, alpha, this.toArray());
    }
  });

  // internal method for calculating the z-score for a difference of proportions test
  function differenceOfProportions(p1, n1, p2, n2) {
    if (p1 > 1 || p2 > 1 || p1 <= 0 || p2 <= 0) {
      throw new Error('Proportions should be greater than 0 and less than 1');
    }
    const pooled = (p1 * n1 + p2 * n2) / (n1 + n2);
    const se = Math.sqrt(pooled * (1 - pooled) * (1 / n1 + 1 / n2));
    return (p1 - p2) / se;
  }

  // Difference of Proportions
  jStat.extend(jStat.fn, {
    oneSidedDifferenceOfProportions: function oneSidedDifferenceOfProportions(p1, n1, p2, n2) {
      const z = differenceOfProportions(p1, n1, p2, n2);
      return jStat.ztest(z, 1);
    },

    twoSidedDifferenceOfProportions: function twoSidedDifferenceOfProportions(p1, n1, p2, n2) {
      const z = differenceOfProportions(p1, n1, p2, n2);
      return jStat.ztest(z, 2);
    }
  });

  function sub_regress(exog) {
    const var_count = exog[0].length;
    const modelList = jStat.arange(var_count).map((endog_index) => {
      const exog_index = jStat.arange(var_count).filter((i) => i !== endog_index);
      return ols(
        jStat.col(exog, endog_index).map((x) => x[0]),
        jStat.col(exog, exog_index)
      );
    });
    return modelList;
  }

  // do OLS model regress
  // exog have include const columns ,it will not generate it .In fact, exog is
  // "design matrix" look at
  //https://en.wikipedia.org/wiki/Design_matrix
  function ols(endog, exog) {
    const nobs = endog.length;
    const df_model = exog[0].length - 1;
    const df_resid = nobs - df_model - 1;
    const coef = jStat.lstsq(exog, endog);
    const predict = jStat
      .multiply(
        exog,
        coef.map((x) => [x])
      )
      .map((p) => p[0]);
    const resid = jStat.subtract(endog, predict);
    const ybar = jStat.mean(endog);
    // constant cause problem
    // var SST = jStat.sum(endog.map(function(y) {
    //   return Math.pow(y-ybar,2);
    // }));
    const SSE = jStat.sum(predict.map((f) => Math.pow(f - ybar, 2)));
    const SSR = jStat.sum(endog.map((y, i) => Math.pow(y - predict[i], 2)));
    const SST = SSE + SSR;
    const R2 = SSE / SST;
    return {
      exog: exog,
      endog: endog,
      nobs: nobs,
      df_model: df_model,
      df_resid: df_resid,
      coef: coef,
      predict: predict,
      resid: resid,
      ybar: ybar,
      SST: SST,
      SSE: SSE,
      SSR: SSR,
      R2: R2
    };
  }

  // H0: b_I=0
  // H1: b_I!=0
  function t_test(model) {
    const subModelList = sub_regress(model.exog);
    //var sigmaHat=jStat.stdev(model.resid);
    const sigmaHat = Math.sqrt(model.SSR / model.df_resid);
    const seBetaHat = subModelList.map((mod) => {
      const SST = mod.SST;
      const R2 = mod.R2;
      return sigmaHat / Math.sqrt(SST * (1 - R2));
    });
    const tStatistic = model.coef.map((coef, i) => (coef - 0) / seBetaHat[i]);
    const pValue = tStatistic.map((t) => {
      const leftppf = jStat.studentt.cdf(t, model.df_resid);
      return (leftppf > 0.5 ? 1 - leftppf : leftppf) * 2;
    });
    const c = jStat.studentt.inv(0.975, model.df_resid);
    const interval95 = model.coef.map((coef, i) => {
      const d = c * seBetaHat[i];
      return [coef - d, coef + d];
    });
    return {
      se: seBetaHat,
      t: tStatistic,
      p: pValue,
      sigmaHat: sigmaHat,
      interval95: interval95
    };
  }

  function F_test(model) {
    const F_statistic = model.R2 / model.df_model / ((1 - model.R2) / model.df_resid);
    const fcdf = (x, n1, n2) => jStat.beta.cdf(x / (n2 / n1 + x), n1 / 2, n2 / 2);
    const pvalue = 1 - fcdf(F_statistic, model.df_model, model.df_resid);
    return { F_statistic: F_statistic, pvalue: pvalue };
  }

  function ols_wrap(endog, exog) {
    const model = ols(endog, exog);
    const ttest = t_test(model);
    const ftest = F_test(model);
    // Provide the Wherry / Ezekiel / McNemar / Cohen Adjusted R^2
    // Which matches the 'adjusted R^2' provided by R's lm package
    const adjust_R2 = 1 - (1 - model.R2) * ((model.nobs - 1) / model.df_resid);
    model.t = ttest;
    model.f = ftest;
    model.adjust_R2 = adjust_R2;
    return model;
  }

  jStat.models = { ols: ols_wrap };

  //To regress, simply build X matrix
  //(append column of 1's) using
  //buildxmatrix and build the Y
  //matrix using buildymatrix
  //(simply the transpose)
  //and run regress.


  //Regressions

  jStat.extend({
    buildxmatrix: function buildxmatrix(...args) {
      //Parameters will be passed in as such
      //(array1,array2,array3,...)
      //as (x1,x2,x3,...)
      //needs to be (1,x1,x2,x3,...)
      const matrixRows = new Array(args.length);
      for (let i = 0; i < args.length; i++) {
        const array = [1];
        matrixRows[i] = array.concat(args[i]);
      }
      return jStat(matrixRows);
    },

    builddxmatrix: function builddxmatrix(...args) {
      //Paramters will be passed in as such
      //([array1,array2,...]
      const matrixRows = new Array(args[0].length);
      for (let i = 0; i < args[0].length; i++) {
        const array = [1];
        matrixRows[i] = array.concat(args[0][i]);
      }
      return jStat(matrixRows);
    },

    buildjxmatrix: function buildjxmatrix(jMat) {
      //Builds from jStat Matrix
      const pass = new Array(jMat.length);
      for (let i = 0; i < jMat.length; i++) {
        pass[i] = jMat[i];
      }
      return jStat.builddxmatrix(pass);
    },

    buildymatrix: function buildymatrix(array) {
      return jStat(array).transpose();
    },

    buildjymatrix: function buildjymatrix(jMat) {
      return jMat.transpose();
    },

    matrixmult: function matrixmult(A, B) {
      let i, j, k, result, sum;
      if (A.cols() === B.rows()) {
        if (B.rows() > 1) {
          result = [];
          for (i = 0; i < A.rows(); i++) {
            result[i] = [];
            for (j = 0; j < B.cols(); j++) {
              sum = 0;
              for (k = 0; k < A.cols(); k++) {
                sum += A.toArray()[i][k] * B.toArray()[k][j];
              }
              result[i][j] = sum;
            }
          }
          return jStat(result);
        }
        result = [];
        for (i = 0; i < A.rows(); i++) {
          result[i] = [];
          for (j = 0; j < B.cols(); j++) {
            sum = 0;
            for (k = 0; k < A.cols(); k++) {
              sum += A.toArray()[i][k] * B.toArray()[j];
            }
            result[i][j] = sum;
          }
        }
        return jStat(result);
      }
    },

    //regress and regresst to be fixed

    regress: function regress(jMatX, jMatY) {
      const innerinv = jStat.xtranspxinv(jMatX);
      const xtransp = jMatX.transpose();
      const next = jStat.matrixmult(jStat(innerinv), xtransp);
      return jStat.matrixmult(next, jMatY);
    },

    regresst: function regresst(jMatX, jMatY, sides) {
      const beta = jStat.regress(jMatX, jMatY);

      const compile = {};
      compile.anova = {};
      const jMatYBar = jStat.jMatYBar(jMatX, beta);
      compile.yBar = jMatYBar;
      const yAverage = jMatY.mean();
      compile.anova.residuals = jStat.residuals(jMatY, jMatYBar);

      compile.anova.ssr = jStat.ssr(jMatYBar, yAverage);
      compile.anova.msr = compile.anova.ssr / (jMatX[0].length - 1);

      compile.anova.sse = jStat.sse(jMatY, jMatYBar);
      compile.anova.mse = compile.anova.sse / (jMatY.length - (jMatX[0].length - 1) - 1);

      compile.anova.sst = jStat.sst(jMatY, yAverage);
      compile.anova.mst = compile.anova.sst / (jMatY.length - 1);

      compile.anova.r2 = 1 - compile.anova.sse / compile.anova.sst;
      if (compile.anova.r2 < 0) compile.anova.r2 = 0;

      compile.anova.fratio = compile.anova.msr / compile.anova.mse;
      compile.anova.pvalue = jStat.anovaftest(
        compile.anova.fratio,
        jMatX[0].length - 1,
        jMatY.length - (jMatX[0].length - 1) - 1
      );

      compile.anova.rmse = Math.sqrt(compile.anova.mse);

      compile.anova.r2adj = 1 - compile.anova.mse / compile.anova.mst;
      if (compile.anova.r2adj < 0) compile.anova.r2adj = 0;

      compile.stats = new Array(jMatX[0].length);
      const covar = jStat.xtranspxinv(jMatX);
      let sds, ts, ps;

      for (let i = 0; i < beta.length; i++) {
        sds = Math.sqrt(compile.anova.mse * Math.abs(covar[i][i]));
        ts = Math.abs(beta[i] / sds);
        ps = jStat.ttest(ts, jMatY.length - jMatX[0].length - 1, sides);

        compile.stats[i] = [beta[i], sds, ts, ps];
      }

      compile.regress = beta;
      return compile;
    },

    xtranspx: function xtranspx(jMatX) {
      return jStat.matrixmult(jMatX.transpose(), jMatX);
    },

    xtranspxinv: function xtranspxinv(jMatX) {
      const inner = jStat.matrixmult(jMatX.transpose(), jMatX);
      const innerinv = jStat.inv(inner);
      return innerinv;
    },

    jMatYBar: function jMatYBar(jMatX, beta) {
      const yBar = jStat.matrixmult(jMatX, beta);
      return new jStat(yBar);
    },

    residuals: function residuals(jMatY, jMatYBar) {
      return jStat.matrixsubtract(jMatY, jMatYBar);
    },

    ssr: function ssr(jMatYBar, yAverage) {
      let ssr = 0;
      for (let i = 0; i < jMatYBar.length; i++) {
        ssr += Math.pow(jMatYBar[i] - yAverage, 2);
      }
      return ssr;
    },

    sse: function sse(jMatY, jMatYBar) {
      let sse = 0;
      for (let i = 0; i < jMatY.length; i++) {
        sse += Math.pow(jMatY[i] - jMatYBar[i], 2);
      }
      return sse;
    },

    sst: function sst(jMatY, yAverage) {
      let sst = 0;
      for (let i = 0; i < jMatY.length; i++) {
        sst += Math.pow(jMatY[i] - yAverage, 2);
      }
      return sst;
    },

    matrixsubtract: function matrixsubtract(A, B) {
      const ans = new Array(A.length);
      for (let i = 0; i < A.length; i++) {
        ans[i] = new Array(A[i].length);
        for (let j = 0; j < A[i].length; j++) {
          ans[i][j] = A[i][j] - B[i][j];
        }
      }
      return jStat(ans);
    }
  });

  // Backwards compatibility: require('jstat').jStat === require('jstat')
  jStat.jStat = jStat;

  return jStat;

}));
//# sourceMappingURL=jstat.js.map
