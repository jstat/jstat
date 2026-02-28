import jStat from './core.js';

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
