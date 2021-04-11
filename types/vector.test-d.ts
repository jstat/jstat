/// <reference path="./index.d.ts" />
/// <reference path="./statistical_test.d.ts" />

import { jStat } from "jstat";
import { expectError, expectType } from "tsd";

const sampleVector = [0, 1, 2];
const sampleMatrix = [sampleVector, sampleVector, sampleVector];

/**
 * jStat static vector functions
 */
// jStat.sum(...)
expectType<number>(jStat.sum(sampleVector));

// jStat.sumsqrd(...)
expectType<number>(jStat.sumsqrd(sampleVector));

// jStat.sumsqerr(...)
expectType<number>(jStat.sumsqerr(sampleVector));

// jStat.sumrow(...)
expectType<number>(jStat.sumrow(sampleVector));

// jStat.product(...)
expectType<number>(jStat.product(sampleVector));

// jStat.min(...)
expectType<number>(jStat.min(sampleVector));

// jStat.max(...)
expectType<number>(jStat.max(sampleVector));

// jStat.variance(...)
expectType<number>(jStat.variance(sampleVector));
expectType<number>(jStat.variance(sampleVector, true));
expectType<number>(jStat.variance(sampleVector));
expectType<number>(jStat.variance(sampleVector, true));

// jStat.quartiles(...)
expectType<[number, number, number]>(jStat.quartiles(sampleVector));

// jStat.quantiles(...)
expectType<number[]>(jStat.quantiles(sampleVector, sampleVector));
expectType<number[]>(jStat.quantiles(sampleVector, sampleVector, 1));
expectType<number[]>(jStat.quantiles(sampleVector, sampleVector, 1, 2));

// jStat.median(...)
expectType<number>(jStat.median(sampleVector));
expectError(jStat.median(sampleMatrix));

/**
 * jStat vector methods
 */
// jStat(...).sum(...)
expectType<number | number[]>(jStat(sampleVector).sum());
expectType<number>(jStat(sampleMatrix).sum(true));
expectType<number | number[]>(jStat(sampleVector).sum(false));
expectType<JStatObject>(
  jStat(sampleVector).sum((r) => {
    expectType<number | number[]>(r);
  })
);
expectType<JStatObject>(
  jStat(sampleVector).sum(true, (r) => {
    expectType<number>(r);
  })
);
expectType<JStatObject>(
  jStat(sampleVector).sum(false, (r) => {
    expectType<number | number[]>(r);
  })
);

// jStat(...).sumsqrd(...)
expectType<number | number[]>(jStat(sampleVector).sumsqrd());
expectType<number>(jStat(sampleMatrix).sumsqrd(true));
expectType<number | number[]>(jStat(sampleVector).sumsqrd(false));
expectType<JStatObject>(
  jStat(sampleVector).sumsqrd((r) => {
    expectType<number | number[]>(r);
  })
);
expectType<JStatObject>(
  jStat(sampleVector).sumsqrd(true, (r) => {
    expectType<number>(r);
  })
);
expectType<JStatObject>(
  jStat(sampleVector).sumsqrd(false, (r) => {
    expectType<number | number[]>(r);
  })
);

// jStat(...).sumsqerr(...)
expectType<number | number[]>(jStat(sampleVector).sumsqerr());
expectType<number>(jStat(sampleMatrix).sumsqerr(true));
expectType<number | number[]>(jStat(sampleVector).sumsqerr(false));
expectType<JStatObject>(
  jStat(sampleVector).sumsqerr((r) => {
    expectType<number | number[]>(r);
  })
);
expectType<JStatObject>(
  jStat(sampleVector).sumsqerr(true, (r) => {
    expectType<number>(r);
  })
);
expectType<JStatObject>(
  jStat(sampleVector).sumsqerr(false, (r) => {
    expectType<number | number[]>(r);
  })
);

// jStat(...).sumrow(...)
expectType<number | number[]>(jStat(sampleVector).sumrow());
expectType<number>(jStat(sampleMatrix).sumrow(true));
expectType<number | number[]>(jStat(sampleVector).sumrow(false));
expectType<JStatObject>(
  jStat(sampleVector).sumrow((r) => {
    expectType<number | number[]>(r);
  })
);
expectType<JStatObject>(
  jStat(sampleVector).sumrow(true, (r) => {
    expectType<number>(r);
  })
);
expectType<JStatObject>(
  jStat(sampleVector).sumrow(false, (r) => {
    expectType<number | number[]>(r);
  })
);

// jStat(...).product(...)
expectType<number | number[]>(jStat(sampleVector).product());
expectType<number>(jStat(sampleMatrix).product(true));
expectType<number | number[]>(jStat(sampleVector).product(false));
expectType<JStatObject>(
  jStat(sampleVector).product((r) => {
    expectType<number | number[]>(r);
  })
);
expectType<JStatObject>(
  jStat(sampleVector).product(true, (r) => {
    expectType<number>(r);
  })
);
expectType<JStatObject>(
  jStat(sampleVector).product(false, (r) => {
    expectType<number | number[]>(r);
  })
);

// jStat(...).min(...)
expectType<number | number[]>(jStat(sampleVector).min());
expectType<number>(jStat(sampleMatrix).min(true));
expectType<number | number[]>(jStat(sampleVector).min(false));
expectType<JStatObject>(
  jStat(sampleVector).min((r) => {
    expectType<number | number[]>(r);
  })
);
expectType<JStatObject>(
  jStat(sampleVector).min(true, (r) => {
    expectType<number>(r);
  })
);
expectType<JStatObject>(
  jStat(sampleVector).min(false, (r) => {
    expectType<number | number[]>(r);
  })
);

// jStat(...).max(...)
expectType<number | number[]>(jStat(sampleVector).max());
expectType<number>(jStat(sampleMatrix).max(true));
expectType<number | number[]>(jStat(sampleVector).max(false));
expectType<JStatObject>(
  jStat(sampleVector).max((r) => {
    expectType<number | number[]>(r);
  })
);
expectType<JStatObject>(
  jStat(sampleVector).max(true, (r) => {
    expectType<number>(r);
  })
);
expectType<JStatObject>(
  jStat(sampleVector).max(false, (r) => {
    expectType<number | number[]>(r);
  })
);

// jStat(...).median(...)
expectType<number | number[]>(jStat(sampleVector).median());
expectType<JStatObject>(
  jStat(sampleVector).median((median) => {
    expectType<number | number[]>(median);
  })
);

// jStat(...).quantiles(...)
expectType<number[]>(jStat(sampleVector).quantiles(sampleVector));
expectType<number[]>(jStat(sampleVector).quantiles(sampleVector, 1));
expectType<number[]>(jStat(sampleVector).quantiles(sampleVector, 1, 1));

// jStat.quartiles(...)
expectType<number[] | number[][]>(jStat(sampleVector).quartiles());
expectType<number[] | number[][]>(jStat(sampleVector).quartiles());
expectType<JStatObject>(
  jStat(sampleVector).quartiles((x) => {
    expectType<number[] | number[][]>(x);
  })
);
