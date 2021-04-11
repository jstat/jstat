/// <reference path="./index.d.ts" />
/// <reference path="./statistical_test.d.ts" />

import { expectType } from "tsd";
import { jStat } from "jstat";

const sampleVector = [0, 1, 2];
const sampleMatrix = [sampleVector, sampleVector, sampleVector];

/**
 * jStat statistical test functions
 */
// jStat.zscore(...)
expectType<number>(jStat.zscore(2, sampleVector));
expectType<number>(jStat.zscore(2, sampleVector, true));
expectType<number>(jStat.zscore(2, 0, 1));

// jStat.ztest(...)
expectType<number>(jStat.ztest(1.5, 0, 1));
expectType<number>(jStat.ztest(1.5, 0, 1, 1));
expectType<number>(jStat.ztest(0.5));
expectType<number>(jStat.ztest(0.5, 1));
expectType<number>(jStat.ztest(5, [1, 2, 3, 4, 5, 6]));
expectType<number>(jStat.ztest(5, [1, 2, 3, 4, 5, 6], 1));
expectType<number>(jStat.ztest(5, [1, 2, 3, 4, 5, 6], 1, true));

// jStat.tscore(...)

// jStat.ttest(...)

// jStat.anovafscore(...)
expectType<number>(jStat.anovafscore(sampleMatrix));
expectType<number>(jStat.anovafscore(sampleVector, sampleVector));

// jStat.anovaftest(...)
expectType<number>(jStat.anovaftest(sampleVector, sampleVector));

// jStat.tukeyhsd(...)
expectType<jStat.TukeyHSD[]>(jStat.tukeyhsd(sampleMatrix));

/**
 * jStat statistical test methods
 */
// jStat(...).zscore(...)
expectType<number>(jStat(sampleMatrix).zscore(2));
expectType<number>(jStat(sampleMatrix).zscore(2, true));

// jStat(...).ztest(...)
expectType<number>(jStat(sampleMatrix).ztest(5));
expectType<number>(jStat(sampleMatrix).ztest(5, 1));
expectType<number>(jStat(sampleMatrix).ztest(5, 1, true));
