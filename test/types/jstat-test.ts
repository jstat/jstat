import jStat = require('jstat');

// --- Constructor overloads ---
const empty: jStat = jStat();
const vector: jStat = jStat([1, 2, 3]);
const matrix: jStat = jStat([
  [1, 2],
  [3, 4]
]);
const mapped: jStat = jStat([1, 2, 3], (x) => x * 2);
const seq: jStat = jStat(1, 5, 11);
const clone: jStat = jStat(vector);

// --- Core static methods ---
const r: number = jStat.rows([
  [1, 2],
  [3, 4]
]);
const c: number = jStat.cols([
  [1, 2],
  [3, 4]
]);
const dims: { rows: number; cols: number } = jStat.dimensions([[1, 2]]);
const z: number[][] = jStat.zeros(3, 3);
const id: number[][] = jStat.identity(3);
const s: boolean = jStat.symmetric([
  [1, 0],
  [0, 1]
]);

// --- Vector statistics ---
const total: number = jStat.sum([1, 2, 3]);
const avg: number = jStat.mean([1, 2, 3]);
const sd: number = jStat.stdev([1, 2, 3], true);
const q: [number, number, number] = jStat.quartiles([1, 2, 3, 4]);
const pct: number = jStat.percentile([1, 2, 3, 4], 0.5);
const cov: number = jStat.covariance([1, 2], [3, 4]);
const corr: number = jStat.corrcoeff([1, 2, 3], [4, 5, 6]);

// --- Instance methods ---
const m: number | number[] = jStat([1, 2, 3]).mean();
const chained: jStat = jStat([1, 2, 3]).mean(function (val) {
  const self: jStat = this;
});

// --- Special functions ---
const gl: number = jStat.gammaln(5);
const fact: number = jStat.factorial(10);
const comb: number = jStat.combination(10, 3);
const errfn: number = jStat.erf(1);

// --- Distributions (static) ---
const npdf: number = jStat.normal.pdf(0, 0, 1);
const ncdf: number = jStat.normal.cdf(0, 0, 1);
const ninv: number = jStat.normal.inv(0.5, 0, 1);
const nmean: number = jStat.normal.mean(0, 1);
const nsample: number = jStat.normal.sample(0, 1);

// --- Distributions (instance) ---
const d = jStat.normal(0, 1);
const dpdf: number = d.pdf(0);
const dcdf: number = d.cdf(0);
const dinv: number = d.inv(0.5);
const dmean: number = d.mean();
const dsample: number = d.sample();

// --- Linear algebra ---
const added: number[][] = jStat.add([[1, 2]], [[3, 4]]);
const det: number = jStat.det([
  [1, 2],
  [3, 4]
]);
const decomp: [number[][], number[][]] = jStat.lu([
  [1, 2],
  [3, 4]
]);
const qr: [number[][], number[][]] = jStat.QR([
  [1, 2],
  [3, 4]
]);

// --- Statistical tests ---
const zs: number = jStat.zscore(1, 0, 1);
const zs2: number = jStat.zscore(1, [1, 2, 3]);
const zt: number = jStat.ztest(1.5, 0, 1, 2);
const sig: boolean = jStat.significant(0.04, 0.05);

// --- Models ---
const model = jStat.models.ols(
  [1, 2, 3],
  [
    [1, 1],
    [1, 2],
    [1, 3]
  ]
);
const r2: number = model.R2;
const coefs: number[] = model.coef;
const fstat: number = model.f.F_statistic;
const tse: number[] = model.t.se;

// --- Regression ---
const xmat: jStat = jStat.buildxmatrix([1, 2], [3, 4]);
const ymat: jStat = jStat.buildymatrix([1, 2, 3]);

// --- Type errors (should fail) ---
// @ts-expect-error: sum requires an array, not a number
jStat.sum(5);
// @ts-expect-error: mean requires an array, not a string
jStat.mean('hello');
// @ts-expect-error: normal.pdf requires 3 arguments
jStat.normal.pdf(0, 0);
