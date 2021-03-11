/// <reference path="./index.d.ts" />
/// <reference path="./statistical_test.d.ts" />

import { jStat } from "jstat";
import { expectError, expectType } from "tsd";

const sampleVector = [0, 1, 2];
const sampleMatrix = [sampleVector, sampleVector, sampleVector];

/**
 * jStat static vector functions
 */
expectType<number>(jStat.sum(sampleVector));

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
