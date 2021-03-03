/// <reference path="../index.d.ts" />
/// <reference path="./statistical_test.d.ts" />

import { expectType } from "tsd";
import { jStat } from "jstat";

const sampleVector = [0, 1, 2];
const sampleMatrix = [sampleVector, sampleVector, sampleVector];

// zscore()
expectType<number>(jStat.zscore(2, sampleVector));
expectType<number>(jStat.zscore(2, sampleVector, true));
expectType<number>(jStat.zscore(2, 0, 1));
expectType<number>(jStat(sampleMatrix).zscore(2));
expectType<number>(jStat(sampleMatrix).zscore(2, true));

// ztest()

// tscore()

// ttest()

// anovafscore()
expectType<number>(jStat.anovafscore(sampleMatrix));
expectType<number>(jStat.anovafscore(sampleVector, sampleVector));

// anovaftest()
expectType<number>(jStat.anovaftest(sampleVector, sampleVector));

expectType<jStat.TukeyHSD[]>(jStat.tukeyhsd(sampleMatrix));
