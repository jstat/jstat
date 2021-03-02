/// <reference path="../index.d.ts" />
/// <reference path="./normal.d.ts" />

import { jStat } from "jstat";
import { expectType, expectError } from "tsd";

const aVector = [0, 1, 2];
const aMatrix = [aVector, aVector];

/**
 * jStat Normal distribution instance
 */
const normalD = jStat.normal(0, 1);
expectType<InstanceType<jStat.NormalDistribution>>(normalD);

expectType<number>(jStat.normal(0, 1).pdf(0.5));
expectType<number>(jStat.normal(0, 1).cdf(0.5));
expectType<number>(jStat.normal(0, 1).inv(0.5));
expectType<number>(jStat.normal(0, 1).mean());
expectType<number>(jStat.normal(0, 1).median());
expectType<number>(jStat.normal(0, 1).mode());
expectType<number>(jStat.normal(0, 1).variance());

/**
 * jStat normal distribution functions
 */
expectType<number>(jStat.normal.pdf(0.5, 0, 1));
expectType<number>(jStat.normal.cdf(0.5, 0, 1));
expectType<number>(jStat.normal.inv(0.5, 0, 1));
expectType<number>(jStat.normal.mean(0, 1));
expectType<number>(jStat.normal.median(0, 1));
expectType<number>(jStat.normal.mode(0, 1));
expectType<number>(jStat.normal.variance(0, 1));
