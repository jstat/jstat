/// <reference path="./index.d.ts" />
/// <reference path="./studentt.d.ts" />

import { jStat } from "jstat";
import { expectType, expectError } from "tsd";

const aVector = [0, 1, 2];
const aMatrix = [aVector, aVector];

/**
 * jStat Studentt distribution instance
 */
const studenttD = jStat.studentt(3);
expectType<InstanceType<jStat.StudenttDistribution>>(studenttD);

expectType<number>(jStat.studentt(3).pdf(0.5));
expectType<number>(jStat.studentt(3).cdf(0.5));
expectType<number>(jStat.studentt(3).inv(0.5));
expectType<number>(jStat.studentt(3).mean());
expectType<number>(jStat.studentt(3).median());
expectType<number>(jStat.studentt(3).mode());
expectType<number>(jStat.studentt(3).variance());

/**
 * jStat studentt distribution functions
 */
expectType<number>(jStat.studentt.pdf(0.5, 3));
expectType<number>(jStat.studentt.cdf(0.5, 3));
expectType<number>(jStat.studentt.inv(0.5, 3));
expectType<number>(jStat.studentt.mean(3));
expectType<number>(jStat.studentt.median(3));
expectType<number>(jStat.studentt.mode(3));
expectType<number>(jStat.studentt.variance(3));
