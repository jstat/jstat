/// <reference path="./index.d.ts" />
/// <reference path="./lognormal.d.ts" />

import { jStat } from "jstat";
import { expectType } from "tsd";

/**
 * jStat LogNormal distribution instance
 */
const lognormalD = jStat.lognormal(0, 1);
expectType<InstanceType<jStat.LogNormalDistribution>>(lognormalD);

expectType<number>(jStat.lognormal(0, 1).pdf(0.5));
expectType<number>(jStat.lognormal(0, 1).cdf(0.5));
expectType<number>(jStat.lognormal(0, 1).inv(0.5));
expectType<number>(jStat.lognormal(0, 1).mean());
expectType<number>(jStat.lognormal(0, 1).median());
expectType<number>(jStat.lognormal(0, 1).mode());
expectType<number>(jStat.lognormal(0, 1).variance());

/**
 * jStat lognormal distribution functions
 */
expectType<number>(jStat.lognormal.pdf(0.5, 0, 1));
expectType<number>(jStat.lognormal.cdf(0.5, 0, 1));
expectType<number>(jStat.lognormal.inv(0.5, 0, 1));
expectType<number>(jStat.lognormal.mean(0, 1));
expectType<number>(jStat.lognormal.median(0, 1));
expectType<number>(jStat.lognormal.mode(0, 1));
expectType<number>(jStat.lognormal.variance(0, 1));
