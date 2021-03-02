/// <reference path="../index.d.ts" />
/// <reference path="./statistical_test.d.ts" />

import * as jStat from "jstat";
import { expectType } from "tsd";

const sampleVector = [0, 1, 2];
const sampleMatrix = [sampleVector, sampleVector, sampleVector];

expectType<number>(jStat.variance(sampleVector));
expectType<number>(jStat.variance(sampleVector, true));
