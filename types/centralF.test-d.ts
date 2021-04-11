/// <reference path="./index.d.ts" />
/// <reference path="./centralF.d.ts" />

import { jStat } from "jstat";
import { expectType } from "tsd";

/**
 * jStat Normal distribution instance
 */
const centralFD = jStat.centralF(2, 3);
expectType<InstanceType<jStat.CentralFDistribution>>(centralFD);

expectType<number>(jStat.centralF(2, 3).pdf(0.5));
expectType<number>(jStat.centralF(2, 3).cdf(0.5));
expectType<number>(jStat.centralF(2, 3).inv(0.5));
expectType<number | undefined>(jStat.centralF(2, 3).mean());
expectType<number | undefined>(jStat.centralF(2, 3).mode());
expectType<number | undefined>(jStat.centralF(2, 3).variance());

/**
 * jStat centralF distribution functions
 */
expectType<number>(jStat.centralF.pdf(0.5, 2, 3));
expectType<number>(jStat.centralF.cdf(0.5, 2, 3));
expectType<number>(jStat.centralF.inv(0.5, 2, 3));
expectType<number | undefined>(jStat.centralF.mean(2, 3));
expectType<number | undefined>(jStat.centralF.mode(2, 3));
expectType<number | undefined>(jStat.centralF.variance(2, 3));
