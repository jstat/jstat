// Type definitions for jStat 1.x
// Project: https://github.com/jstat/jstat
// Definitions by: jStat Contributors

// --- Helper Types ---

type Matrix = number[][];
type Vector = number[];
type MapFunc = (value: number, row: number, col: number) => number;
type ReduceFunc = (prev: number, curr: number) => number;

interface RCSlice {
  row?: number | { start?: number; end?: number; step?: number };
  col?: number | { start?: number; end?: number; step?: number };
}

// --- OLS Model ---

interface OLSModel {
  exog: Matrix;
  endog: Vector;
  nobs: number;
  df_model: number;
  df_resid: number;
  coef: Vector;
  predict: Vector;
  resid: Vector;
  ybar: number;
  SST: number;
  SSE: number;
  SSR: number;
  R2: number;
  adjust_R2: number;
  t: {
    se: Vector;
    t: Vector;
    p: Vector;
    sigmaHat: number;
    interval95: [number, number][];
  };
  f: {
    F_statistic: number;
    pvalue: number;
  };
}

// --- Regression Result ---

interface RegressTResult {
  regress: jStat;
  anova: {
    residuals: jStat;
    ssr: number;
    msr: number;
    sse: number;
    mse: number;
    sst: number;
    mst: number;
    r2: number;
    fratio: number;
    pvalue: number;
    rmse: number;
    r2adj: number;
  };
  yBar: jStat;
  stats: [number, number, number, number][];
}

// --- Distribution Instance (created by jStat.dist(params)) ---

interface DistributionInstance {
  pdf(x: number): number;
  pdf(x?: number | Vector | Matrix | jStat): number | jStat;
  cdf(x: number): number;
  cdf(x?: number | Vector | Matrix | jStat): number | jStat;
  inv(p: number): number;
  inv(p?: number | Vector | Matrix | jStat): number | jStat;
  mean(): number;
  median(): number;
  mode(): number;
  variance(): number;
  sample(): number;
  sample(arr: Matrix): Matrix;
  data?: jStat;
  _a: number;
  _b: number;
  _c: number;
}

// --- Distribution Static Interfaces ---

// Full 2-parameter distribution (most common)
interface Distribution2ParamFull {
  (p1: number, p2: number): DistributionInstance;
  pdf(x: number, p1: number, p2: number): number;
  cdf(x: number, p1: number, p2: number): number;
  inv(p: number, p1: number, p2: number): number;
  mean(p1: number, p2: number): number;
  median(p1: number, p2: number): number;
  mode(p1: number, p2: number): number;
  variance(p1: number, p2: number): number;
  sample(p1: number, p2: number): number;
}

// Full 1-parameter distribution
interface Distribution1ParamFull {
  (p1: number): DistributionInstance;
  pdf(x: number, p1: number): number;
  cdf(x: number, p1: number): number;
  inv(p: number, p1: number): number;
  mean(p1: number): number;
  median(p1: number): number;
  mode(p1: number): number;
  variance(p1: number): number;
  sample(p1: number): number;
}

// Full 3-parameter distribution
interface Distribution3ParamFull {
  (p1: number, p2: number, p3: number): DistributionInstance;
  pdf(x: number, p1: number, p2: number, p3: number): number;
  cdf(x: number, p1: number, p2: number, p3: number): number;
  inv(p: number, p1: number, p2: number, p3: number): number;
  mean(p1: number, p2: number, p3: number): number;
  median(p1: number, p2: number, p3: number): number;
  mode(p1: number, p2: number, p3: number): number;
  variance(p1: number, p2: number, p3: number): number;
  sample(p1: number, p2: number, p3: number): number;
}

// Cauchy: no mean or variance
interface CauchyStatic {
  (local: number, scale: number): DistributionInstance;
  pdf(x: number, local: number, scale: number): number;
  cdf(x: number, local: number, scale: number): number;
  inv(p: number, local: number, scale: number): number;
  median(local: number, scale: number): number;
  mode(local: number, scale: number): number;
  sample(local: number, scale: number): number;
}

// CentralF: no median
interface CentralFStatic {
  (df1: number, df2: number): DistributionInstance;
  pdf(x: number, df1: number, df2: number): number;
  cdf(x: number, df1: number, df2: number): number;
  inv(p: number, df1: number, df2: number): number;
  mean(df1: number, df2: number): number | undefined;
  mode(df1: number, df2: number): number | undefined;
  variance(df1: number, df2: number): number | undefined;
  sample(df1: number, df2: number): number;
}

// Noncentralt: only pdf and cdf
interface NoncentraltStatic {
  (dof: number, ncp: number): DistributionInstance;
  pdf(x: number, dof: number, ncp: number): number;
  cdf(x: number, dof: number, ncp: number): number;
}

// Binomial: only pdf and cdf
interface BinomialStatic {
  (n: number, p: number): DistributionInstance;
  pdf(k: number, n: number, p: number): number;
  cdf(x: number, n: number, p: number): number;
}

// Negbin: only pdf and cdf
interface NegbinStatic {
  (r: number, p: number): DistributionInstance;
  pdf(k: number, r: number, p: number): number;
  cdf(x: number, r: number, p: number): number;
}

// Hypgeom: 3-param distribution, pdf/cdf only (pdf/cdf take 4 args: k/x + N + m + n)
interface HypgeomStatic {
  (N: number, m: number, n: number): DistributionInstance;
  pdf(k: number, N: number, m: number, n: number): number;
  cdf(x: number, N: number, m: number, n: number): number;
}

// Poisson: pdf, cdf, mean, variance, sample (+ sampleSmall, sampleLarge)
interface PoissonStatic {
  (l: number): DistributionInstance;
  pdf(k: number, l: number): number;
  cdf(x: number, l: number): number;
  mean(l: number): number;
  variance(l: number): number;
  sample(l: number): number;
  sampleSmall(l: number): number;
  sampleLarge(l: number): number;
}

// Tukey: only cdf and inv
interface TukeyStatic {
  (nmeans: number, df: number): DistributionInstance;
  cdf(q: number, nmeans: number, df: number): number;
  inv(p: number, nmeans: number, df: number): number;
}

// Gamma: no median
interface GammaStatic {
  (shape: number, scale: number): DistributionInstance;
  pdf(x: number, shape: number, scale: number): number;
  cdf(x: number, shape: number, scale: number): number;
  inv(p: number, shape: number, scale: number): number;
  mean(shape: number, scale: number): number;
  mode(shape: number, scale: number): number | undefined;
  variance(shape: number, scale: number): number;
  sample(shape: number, scale: number): number;
}

// InvGamma: no median
interface InvgammaStatic {
  (shape: number, scale: number): DistributionInstance;
  pdf(x: number, shape: number, scale: number): number;
  cdf(x: number, shape: number, scale: number): number;
  inv(p: number, shape: number, scale: number): number;
  mean(shape: number, scale: number): number | undefined;
  mode(shape: number, scale: number): number;
  variance(shape: number, scale: number): number | undefined;
  sample(shape: number, scale: number): number;
}

// Kumaraswamy: variance throws, no sample
interface KumaraswamyStatic {
  (alpha: number, beta: number): DistributionInstance;
  pdf(x: number, alpha: number, beta: number): number;
  cdf(x: number, alpha: number, beta: number): number;
  inv(p: number, alpha: number, beta: number): number;
  mean(alpha: number, beta: number): number;
  median(alpha: number, beta: number): number;
  mode(alpha: number, beta: number): number | undefined;
  variance(alpha: number, beta: number): never;
}

// Pareto: no sample
interface ParetoStatic {
  (scale: number, shape: number): DistributionInstance;
  pdf(x: number, scale: number, shape: number): number;
  cdf(x: number, scale: number, shape: number): number;
  inv(p: number, scale: number, shape: number): number;
  mean(scale: number, shape: number): number | undefined;
  median(scale: number, shape: number): number;
  mode(scale: number, shape: number): number;
  variance(scale: number, shape: number): number | undefined;
}

// Laplace: no inv
interface LaplaceStatic {
  (mu: number, b: number): DistributionInstance;
  pdf(x: number, mu: number, b: number): number;
  cdf(x: number, mu: number, b: number): number;
  mean(mu: number, b: number): number;
  median(mu: number, b: number): number;
  mode(mu: number, b: number): number;
  variance(mu: number, b: number): number;
  sample(mu: number, b: number): number;
}

// Uniform: mode throws
interface UniformStatic {
  (a: number, b: number): DistributionInstance;
  pdf(x: number, a: number, b: number): number;
  cdf(x: number, a: number, b: number): number;
  inv(p: number, a: number, b: number): number;
  mean(a: number, b: number): number;
  median(a: number, b: number): number;
  mode(a: number, b: number): never;
  variance(a: number, b: number): number;
  sample(a: number, b: number): number;
}

// Arcsine: mode throws
interface ArcsineStatic {
  (a: number, b: number): DistributionInstance;
  pdf(x: number, a: number, b: number): number;
  cdf(x: number, a: number, b: number): number;
  inv(p: number, a: number, b: number): number;
  mean(a: number, b: number): number;
  median(a: number, b: number): number;
  mode(a: number, b: number): never;
  variance(a: number, b: number): number;
  sample(a: number, b: number): number;
}

// --- jStat Instance Interface ---

interface jStat {
  // Array-like indexing
  [index: number]: Vector;
  length: number;

  // Array methods
  push(...items: any[]): number;
  sort(compareFn?: (a: any, b: any) => number): this;
  splice(start: number, deleteCount?: number, ...items: any[]): any[];
  slice(start?: number, end?: number): any[];

  // Core instance methods
  toArray(): Vector | Matrix;
  map(func: MapFunc, toAlter?: boolean): jStat;
  cumreduce(func: ReduceFunc, toAlter?: boolean): jStat;
  alter(func: MapFunc): jStat;

  // No-argument instance methods (with optional callback)
  transpose(): jStat;
  transpose(callback: (this: jStat, value: jStat) => void): jStat;
  clear(): jStat;
  clear(callback: (this: jStat, value: jStat) => void): jStat;
  symmetric(): boolean;
  symmetric(callback: (this: jStat, value: boolean) => void): jStat;
  rows(): number;
  rows(callback: (this: jStat, value: number) => void): jStat;
  cols(): number;
  cols(callback: (this: jStat, value: number) => void): jStat;
  dimensions(): { rows: number; cols: number };
  dimensions(
    callback: (this: jStat, value: { rows: number; cols: number }) => void
  ): jStat;
  diag(): jStat;
  diag(callback: (this: jStat, value: jStat) => void): jStat;
  antidiag(): jStat;
  antidiag(callback: (this: jStat, value: jStat) => void): jStat;

  // One-argument instance methods (with optional callback)
  row(index: number): jStat;
  row(
    index: number,
    callback: (this: jStat, value: jStat) => void
  ): jStat;
  col(index: number): jStat;
  col(
    index: number,
    callback: (this: jStat, value: jStat) => void
  ): jStat;

  // Factory instance methods
  create(rows: number, cols: number, func: (i: number, j: number) => number): jStat;
  create(rows: number, func: (i: number, j: number) => number): jStat;
  zeros(rows: number, cols?: number): jStat;
  ones(rows: number, cols?: number): jStat;
  rand(rows: number, cols?: number): jStat;
  identity(rows: number, cols?: number): jStat;

  // Vector statistics instance methods (with optional callback/flag)
  sum(): number | Vector;
  sum(callback: (this: jStat, value: number | Vector) => void): jStat;
  sum(fullbool: boolean): number | Vector;
  sumsqrd(): number | Vector;
  sumsqrd(callback: (this: jStat, value: number | Vector) => void): jStat;
  sumsqerr(): number | Vector;
  sumsqerr(callback: (this: jStat, value: number | Vector) => void): jStat;
  sumrow(): number | Vector;
  sumrow(callback: (this: jStat, value: number | Vector) => void): jStat;
  product(): number | Vector;
  product(callback: (this: jStat, value: number | Vector) => void): jStat;
  min(): number | Vector;
  min(callback: (this: jStat, value: number | Vector) => void): jStat;
  max(): number | Vector;
  max(callback: (this: jStat, value: number | Vector) => void): jStat;
  unique(): Vector | Vector[];
  unique(callback: (this: jStat, value: Vector | Vector[]) => void): jStat;
  mean(): number | Vector;
  mean(callback: (this: jStat, value: number | Vector) => void): jStat;
  meansqerr(): number | Vector;
  meansqerr(callback: (this: jStat, value: number | Vector) => void): jStat;
  geomean(): number | Vector;
  geomean(callback: (this: jStat, value: number | Vector) => void): jStat;
  median(): number | Vector;
  median(callback: (this: jStat, value: number | Vector) => void): jStat;
  diff(): Vector | Vector[];
  diff(callback: (this: jStat, value: Vector | Vector[]) => void): jStat;
  rank(): Vector | Vector[];
  rank(callback: (this: jStat, value: Vector | Vector[]) => void): jStat;
  mode(): number | number[] | (number | number[])[];
  mode(callback: (this: jStat, value: any) => void): jStat;
  range(): number | Vector;
  range(callback: (this: jStat, value: number | Vector) => void): jStat;
  variance(): number | Vector;
  variance(flag: boolean): number | Vector;
  variance(callback: (this: jStat, value: number | Vector) => void): jStat;
  deviation(): Vector | Vector[];
  deviation(callback: (this: jStat, value: Vector | Vector[]) => void): jStat;
  stdev(): number | Vector;
  stdev(flag: boolean): number | Vector;
  stdev(callback: (this: jStat, value: number | Vector) => void): jStat;
  meandev(): number | Vector;
  meandev(callback: (this: jStat, value: number | Vector) => void): jStat;
  meddev(): number | Vector;
  meddev(callback: (this: jStat, value: number | Vector) => void): jStat;
  coeffvar(): number | Vector;
  coeffvar(callback: (this: jStat, value: number | Vector) => void): jStat;
  quartiles(): [number, number, number] | [number, number, number][];
  quartiles(callback: (this: jStat, value: any) => void): jStat;
  histogram(): Vector | Vector[];
  histogram(callback: (this: jStat, value: Vector | Vector[]) => void): jStat;
  skewness(): number | Vector;
  skewness(callback: (this: jStat, value: number | Vector) => void): jStat;
  kurtosis(): number | Vector;
  kurtosis(callback: (this: jStat, value: number | Vector) => void): jStat;

  // Cumulative instance methods
  cumsum(): Vector | Vector[];
  cumsum(fullbool: boolean): Vector | Vector[];
  cumsum(callback: (this: jStat, value: Vector | Vector[]) => void): jStat;
  cumprod(): Vector | Vector[];
  cumprod(fullbool: boolean): Vector | Vector[];
  cumprod(callback: (this: jStat, value: Vector | Vector[]) => void): jStat;

  // Extra-argument instance methods
  quantiles(
    quantilesArray: Vector,
    alphap?: number,
    betap?: number
  ): Vector | Vector[];
  quantiles(
    quantilesArray: Vector,
    alphap: number,
    betap: number,
    callback: (this: jStat, value: Vector | Vector[]) => void
  ): jStat;
  percentileOfScore(score: number, kind?: string): number | Vector;
  percentileOfScore(
    score: number,
    kind: string,
    callback: (this: jStat, value: number | Vector) => void
  ): jStat;

  // Special function instance methods
  gammaln(): jStat;
  gammafn(): jStat;
  factorial(): jStat;
  factorialln(): jStat;
  randn(...args: number[]): jStat;

  // Linear algebra instance methods (with optional callback)
  add(arg: Matrix | number): jStat;
  add(arg: Matrix | number, callback: (this: jStat, value: jStat) => void): jStat;
  subtract(arg: Matrix | number): jStat;
  subtract(arg: Matrix | number, callback: (this: jStat, value: jStat) => void): jStat;
  divide(arg: Matrix | number): jStat;
  divide(arg: Matrix | number, callback: (this: jStat, value: jStat) => void): jStat;
  multiply(arg: Matrix | number): jStat | number;
  multiply(arg: Matrix | number, callback: (this: jStat, value: jStat | number) => void): jStat;
  dot(arg: Matrix | Vector): jStat | number;
  dot(arg: Matrix | Vector, callback: (this: jStat, value: jStat | number) => void): jStat;
  pow(arg: number): jStat;
  pow(arg: number, callback: (this: jStat, value: jStat) => void): jStat;
  exp(): jStat;
  exp(callback: (this: jStat, value: jStat) => void): jStat;
  log(): jStat;
  log(callback: (this: jStat, value: jStat) => void): jStat;
  abs(): jStat;
  abs(callback: (this: jStat, value: jStat) => void): jStat;
  norm(p?: number): number;
  norm(p: number, callback: (this: jStat, value: number) => void): jStat;
  angle(arg: Matrix | Vector): number;
  angle(arg: Matrix | Vector, callback: (this: jStat, value: number) => void): jStat;

  // Statistical test instance methods
  zscore(value: number, flag?: boolean): number;
  ztest(value: number, sides: number, flag?: boolean): number;
  tscore(value: number): number;
  ttest(value: number, sides: number): number;
  anovafscore(): number;
  anovaftes(): number;
  normalci(value: number, alpha: number): [number, number];
  tci(value: number, alpha: number): [number, number];
  oneSidedDifferenceOfProportions(
    p1: number,
    n1: number,
    p2: number,
    n2: number
  ): number;
  twoSidedDifferenceOfProportions(
    p1: number,
    n1: number,
    p2: number,
    n2: number
  ): number;

  // Distribution instance methods (data-bound)
  beta(alpha: number, beta: number): DistributionInstance;
  centralF(df1: number, df2: number): DistributionInstance;
  cauchy(local: number, scale: number): DistributionInstance;
  chisquare(dof: number): DistributionInstance;
  exponential(rate: number): DistributionInstance;
  gamma(shape: number, scale: number): DistributionInstance;
  invgamma(shape: number, scale: number): DistributionInstance;
  kumaraswamy(alpha: number, beta: number): DistributionInstance;
  laplace(mu: number, b: number): DistributionInstance;
  lognormal(mu: number, sigma: number): DistributionInstance;
  noncentralt(dof: number, ncp: number): DistributionInstance;
  normal(mean: number, std: number): DistributionInstance;
  pareto(scale: number, shape: number): DistributionInstance;
  studentt(dof: number): DistributionInstance;
  weibull(scale: number, shape: number): DistributionInstance;
  uniform(a: number, b: number): DistributionInstance;
  binomial(n: number, p: number): DistributionInstance;
  negbin(r: number, p: number): DistributionInstance;
  hypgeom(N: number, m: number, n: number): DistributionInstance;
  poisson(l: number): DistributionInstance;
  triangular(a: number, b: number, c: number): DistributionInstance;
  tukey(nmeans: number, df: number): DistributionInstance;
  arcsine(a: number, b: number): DistributionInstance;
}

// --- jStat Static Interface ---

declare function jStat(): jStat;
declare function jStat(data: Vector): jStat;
declare function jStat(data: Vector, mapFunc: (value: number) => number): jStat;
declare function jStat(data: Matrix): jStat;
declare function jStat(data: Matrix, mapFunc: (value: number) => number): jStat;
declare function jStat(
  min: number,
  max: number,
  length: number,
  func?: (val: number, i: number) => number
): jStat;
declare function jStat(instance: jStat): jStat;

declare namespace jStat {
  // Self-reference for CJS backwards compat
  const jStat: typeof import('./jstat');

  // Prototype alias
  const fn: jStat;

  // Internal constructor
  const _init: {
    new (args: any[]): jStat;
    prototype: jStat;
    constructor: typeof jStat;
  };

  // Random
  let _random_fn: () => number;
  function setRandom(fn: () => number): void;

  // Utilities
  namespace utils {
    function calcRdx(a: number, b: number): number;
    function isArray(arg: any): arg is any[];
    function isFunction(arg: any): arg is Function;
    function isNumber(arg: any): arg is number;
    function toVector(arr: Matrix): Vector;
  }

  // Extend
  function extend(obj: object, ...sources: object[]): any;

  // Matrix construction
  function create(
    rows: number,
    cols: number,
    func: (i: number, j: number) => number
  ): Matrix;
  function create(
    rows: number,
    func: (i: number, j: number) => number
  ): Matrix;
  function zeros(rows: number, cols?: number): Matrix;
  function ones(rows: number, cols?: number): Matrix;
  function rand(rows: number, cols?: number): Matrix;
  function identity(rows: number, cols?: number): Matrix;

  // Matrix access
  function rows(arr: Matrix): number;
  function cols(arr: Matrix): number;
  function dimensions(arr: Matrix): { rows: number; cols: number };
  function row(arr: Matrix, index: number): Vector;
  function row(arr: Matrix, index: number[]): Matrix;
  function rowa(arr: Matrix, i: number): Vector;
  function col(arr: Matrix, index: number): Matrix;
  function col(arr: Matrix, index: number[]): Matrix;
  function cola(arr: Matrix, i: number): Vector;
  function diag(arr: Matrix): Matrix;
  function antidiag(arr: Matrix): Matrix;

  // Matrix transformation
  function transpose(arr: Matrix | Vector): Matrix | Vector;
  function map(
    arr: Matrix | Vector,
    func: MapFunc,
    toAlter?: boolean
  ): Matrix | Vector;
  function cumreduce(
    arr: Matrix | Vector,
    func: ReduceFunc,
    toAlter?: boolean
  ): Matrix | Vector;
  function alter(arr: Matrix | Vector, func: MapFunc): Matrix | Vector;
  function copy(arr: Matrix): Matrix;
  function slice(list: Matrix, rcSlice?: RCSlice): any;
  function sliceAssign(A: Matrix, rcSlice: RCSlice, B: any): Matrix;

  // Matrix utilities
  function symmetric(arr: Matrix): boolean;
  function clear(arr: Matrix): Matrix;
  function diagonal(diagArray: Vector): Matrix;
  function seq(
    min: number,
    max: number,
    length: number,
    func?: (val: number, i: number) => number
  ): Vector;
  function arange(end: number): Vector;
  function arange(start: number, end: number, step?: number): Vector;

  // Vector statistics
  function sum(arr: Vector): number;
  function sumsqrd(arr: Vector): number;
  function sumsqerr(arr: Vector): number;
  function sumrow(arr: Vector): number;
  function product(arr: Vector): number;
  function min(arr: Vector): number;
  function max(arr: Vector): number;
  function unique(arr: Vector): Vector;
  function mean(arr: Vector): number;
  function meansqerr(arr: Vector): number;
  function geomean(arr: Vector): number;
  function median(arr: Vector): number;
  function cumsum(arr: Vector): Vector;
  function cumprod(arr: Vector): Vector;
  function diff(arr: Vector): Vector;
  function rank(arr: Vector): Vector;
  function mode(arr: Vector): number | Vector;
  function range(arr: Vector): number;
  function variance(arr: Vector, flag?: boolean): number;
  function pooledvariance(arr: Matrix): number;
  function deviation(arr: Vector): Vector;
  function stdev(arr: Vector, flag?: boolean): number;
  function pooledstdev(arr: Matrix): number;
  function meandev(arr: Vector): number;
  function meddev(arr: Vector): number;
  function coeffvar(arr: Vector): number;
  function quartiles(arr: Vector): [number, number, number];
  function quantiles(
    arr: Vector,
    quantilesArray: Vector,
    alphap?: number,
    betap?: number
  ): Vector;
  function percentile(arr: Vector, k: number, exclusive?: boolean): number;
  function percentileOfScore(
    arr: Vector,
    score: number,
    kind?: string
  ): number;
  function histogram(arr: Vector, binCnt?: number): Vector;
  function covariance(arr1: Vector, arr2: Vector): number;
  function corrcoeff(arr1: Vector, arr2: Vector): number;
  function spearmancoeff(arr1: Vector, arr2: Vector): number;
  function stanMoment(arr: Vector, n: number): number;
  function skewness(arr: Vector): number;
  function kurtosis(arr: Vector): number;

  // Special functions
  function gammaln(x: number): number;
  function loggam(x: number): number;
  function gammafn(x: number): number;
  function gammap(a: number, x: number): number;
  function lowRegGamma(a: number, x: number): number;
  function gammapinv(p: number, a: number): number;
  function factorial(n: number): number;
  function factorialln(n: number): number;
  function combination(n: number, m: number): number;
  function combinationln(n: number, m: number): number;
  function permutation(n: number, m: number): number;
  function betafn(x: number, y: number): number | undefined;
  function betaln(x: number, y: number): number;
  function betacf(x: number, a: number, b: number): number;
  function ibeta(x: number, a: number, b: number): number | boolean;
  function ibetainv(p: number, a: number, b: number): number;
  function erf(x: number): number;
  function erfc(x: number): number;
  function erfcinv(p: number): number;
  function randn(): number;
  function randn(n: number, m?: number): Matrix;
  function randg(shape?: number): number;
  function randg(shape: number, n: number, m?: number): Matrix;

  // Linear algebra
  function add(arr: Matrix, arg: Matrix | number): Matrix;
  function subtract(arr: Matrix, arg: Matrix | number): Matrix;
  function divide(arr: Matrix, arg: Matrix | number): Matrix;
  function multiply(arr: Matrix, arg: Matrix | number): Matrix | number;
  function outer(A: Vector, B: Vector): Matrix;
  function dot(
    arr: Matrix | Vector,
    arg: Matrix | Vector
  ): number | Vector;
  function pow(arr: Matrix, arg: number): Matrix;
  function exp(arr: Matrix): Matrix;
  function log(arr: Matrix): Matrix;
  function abs(arr: Matrix): Matrix;
  function norm(arr: Matrix | Vector, p?: number): number;
  function angle(arr: Matrix | Vector, arg: Matrix | Vector): number;
  function aug(a: Matrix, b: Matrix): Matrix;
  function inv(a: Matrix): Matrix;
  function det(a: Matrix): number;
  function gauss_elimination(a: Matrix, b: Matrix): Vector;
  function gauss_jordan(a: Matrix, b: Matrix): Matrix;
  function triaUpSolve(A: Matrix, b: Vector | Matrix): Vector | Matrix;
  function triaLowSolve(A: Matrix, b: Vector | Matrix): Vector | Matrix;
  function lu(A: Matrix): [Matrix, Matrix];
  function cholesky(A: Matrix): Matrix;
  function householder(a: Matrix): Matrix;
  function QR(A: Matrix): [Matrix, Matrix];
  function lstsq(A: Matrix, b: Vector | Matrix): Vector | Matrix;
  function gauss_jacobi(
    a: Matrix,
    b: Matrix,
    x: Matrix,
    r: number
  ): Matrix;
  function gauss_seidel(
    a: Matrix,
    b: Matrix,
    x: Matrix,
    r: number
  ): Matrix;
  function SOR(
    a: Matrix,
    b: Matrix,
    x: Matrix,
    r: number,
    w: number
  ): Matrix;
  function jacobi(a: Matrix): [Matrix, Vector];
  function rungekutta(
    f: (t: number, u: number) => number,
    h: number,
    p: number,
    t_j: number,
    u_j: number,
    order: number
  ): number;
  function romberg(
    f: (x: number) => number,
    a: number,
    b: number,
    order: number
  ): Vector;
  function richardson(
    X: Vector,
    f: Vector,
    x: number,
    h: number
  ): Vector;
  function simpson(
    f: (x: number) => number,
    a: number,
    b: number,
    n: number
  ): number;
  function gauss_quadrature(): never;
  function hermite(
    X: Vector,
    F: Vector,
    dF: Vector,
    value: number
  ): number;
  function lagrange(X: Vector, F: Vector, value: number): number;
  function cubic_spline(X: Vector, F: Vector, value: number): number;
  function PCA(X: Matrix): [Matrix, Vector, Matrix, Matrix];

  // Statistical tests
  function zscore(value: number, mean: number, sd: number): number;
  function zscore(value: number, array: Vector, flag?: boolean): number;
  function ztest(
    value: number,
    mean: number,
    sd: number,
    sides: number
  ): number;
  function ztest(zscore: number, sides: number): number;
  function ztest(
    value: number,
    array: Vector,
    sides: number,
    flag?: boolean
  ): number;
  function tscore(
    value: number,
    mean: number,
    sd: number,
    n: number
  ): number;
  function tscore(value: number, array: Vector): number;
  function ttest(
    value: number,
    mean: number,
    sd: number,
    n: number,
    sides: number
  ): number;
  function ttest(tscore: number, n: number, sides: number): number;
  function ttest(value: number, array: Vector, sides: number): number;
  function anovafscore(...arrays: Vector[]): number;
  function anovaftest(...arrays: Vector[]): number;
  function anovaftest(
    fscore: number,
    df1: number,
    df2: number
  ): number;
  function ftest(fscore: number, df1: number, df2: number): number;
  function qscore(
    mean1: number,
    mean2: number,
    n1: number,
    n2: number,
    sd: number
  ): number;
  function qscore(
    array1: Vector,
    array2: Vector,
    sd: number
  ): number;
  function qtest(qscore: number, n: number, k: number): number;
  function qtest(
    mean1: number,
    mean2: number,
    n1: number,
    n2: number,
    sd: number,
    n: number,
    k: number
  ): number;
  function qtest(
    array1: Vector,
    array2: Vector,
    sd: number,
    n: number,
    k: number
  ): number;
  function tukeyhsd(arrays: Matrix): Array<[[number, number], number]>;
  function normalci(
    value: number,
    alpha: number,
    sd: number,
    n: number
  ): [number, number];
  function normalci(
    value: number,
    alpha: number,
    array: Vector
  ): [number, number];
  function tci(
    value: number,
    alpha: number,
    sd: number,
    n: number
  ): [number, number];
  function tci(
    value: number,
    alpha: number,
    array: Vector
  ): [number, number];
  function significant(pvalue: number, alpha: number): boolean;

  // Models
  namespace models {
    function ols(endog: Vector, exog: Matrix): OLSModel;
  }

  // Regression utilities
  function buildxmatrix(...arrays: Vector[]): jStat;
  function builddxmatrix(arrayOfArrays: Matrix): jStat;
  function buildjxmatrix(jMatX: jStat): jStat;
  function buildymatrix(array: Vector): jStat;
  function buildjymatrix(jMat: jStat): jStat;
  function matrixmult(A: jStat, B: jStat): jStat;
  function xtranspx(jMatX: jStat): jStat;
  function xtranspxinv(jMatX: jStat): Matrix;
  function regress(jMatX: jStat, jMatY: jStat): jStat;
  function regresst(
    jMatX: jStat,
    jMatY: jStat,
    sides: number
  ): RegressTResult;
  function jMatYBar(jMatX: jStat, beta: jStat): jStat;
  function residuals(jMatY: jStat, jMatYBar: jStat): jStat;
  function ssr(jMatYBar: jStat, yAverage: number): number;
  function sse(jMatY: jStat, jMatYBar: jStat): number;
  function sst(jMatY: jStat, yAverage: number): number;
  function matrixsubtract(A: jStat, B: jStat): jStat;

  // Distributions
  const beta: Distribution2ParamFull;
  const centralF: CentralFStatic;
  const cauchy: CauchyStatic;
  const chisquare: Distribution1ParamFull;
  const exponential: Distribution1ParamFull;
  const gamma: GammaStatic;
  const invgamma: InvgammaStatic;
  const kumaraswamy: KumaraswamyStatic;
  const laplace: LaplaceStatic;
  const lognormal: Distribution2ParamFull;
  const noncentralt: NoncentraltStatic;
  const normal: Distribution2ParamFull;
  const pareto: ParetoStatic;
  const studentt: Distribution1ParamFull;
  const weibull: Distribution2ParamFull;
  const uniform: UniformStatic;
  const binomial: BinomialStatic;
  const negbin: NegbinStatic;
  const hypgeom: HypgeomStatic;
  const poisson: PoissonStatic;
  const triangular: Distribution3ParamFull;
  const tukey: TukeyStatic;
  const arcsine: ArcsineStatic;
}

export = jStat;
export as namespace jStat;
