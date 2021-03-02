/// <reference path="../index.d.ts" />
/// <reference path="./statistical_test.d.ts" />

import jStat, * as jStatCtx from "jstat";
import { expectType } from "tsd";

const sampleVector = [0, 1, 2];
const sampleMatrix = [sampleVector, sampleVector, sampleVector];

// zscore()
expectType<number>(jStatCtx.zscore(2, sampleVector));
expectType<number>(jStatCtx.zscore(2, sampleVector, true));
expectType<number>(jStatCtx.zscore(2, 0, 1));
expectType<number>(jStat(sampleMatrix).zscore(2));
expectType<number>(jStat(sampleMatrix).zscore(2, true));

// ztest()

// tscore()

// ttest()

// anovafscore()
expectType<number>(jStatCtx.anovafscore(sampleMatrix));
expectType<number>(jStatCtx.anovafscore(sampleVector, sampleVector));

// anovaftest()
expectType<number>(jStatCtx.anovaftest(sampleVector, sampleVector));

expectType<jStatCtx.TukeyHSD[]>(jStatCtx.tukeyhsd(sampleMatrix));
