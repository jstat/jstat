/// <reference path="./index.d.ts" />
/// <reference path="./beta.d.ts" />

import { jStat } from "jstat";
import { expectType } from "tsd";

/**
 * jStat Normal distribution instance
 */
const betaD = jStat.beta(0, 1);
expectType<InstanceType<jStat.BetaDistribution>>(betaD);

expectType<number>(jStat.beta(0, 1).pdf(0.5));
expectType<number>(jStat.beta(0, 1).cdf(0.5));
expectType<number>(jStat.beta(0, 1).inv(0.5));
expectType<number>(jStat.beta(0, 1).mean());
expectType<number>(jStat.beta(0, 1).median());
expectType<number>(jStat.beta(0, 1).mode());
expectType<number>(jStat.beta(0, 1).variance());

/**
 * jStat beta distribution functions
 */
expectType<number>(jStat.beta.pdf(0.5, 0, 1));
expectType<number>(jStat.beta.cdf(0.5, 0, 1));
expectType<number>(jStat.beta.inv(0.5, 0, 1));
expectType<number>(jStat.beta.mean(0, 1));
expectType<number>(jStat.beta.median(0, 1));
expectType<number>(jStat.beta.mode(0, 1));
expectType<number>(jStat.beta.variance(0, 1));
