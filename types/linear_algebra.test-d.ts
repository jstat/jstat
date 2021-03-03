/// <reference path="../index.d.ts" />
/// <reference path="./linear_algebra.d.ts" />

import { jStat } from "jstat";
import { expectType, expectError } from "tsd";

const sampleVector = [0, 1, 2];
const sampleMatrix = [sampleVector, sampleVector, sampleVector];

/**
 * jStat static linear algebra functions
 */

// jStat.add(...)
expectType<number[]>(jStat.add(sampleVector, 2));
expectType<number[][]>(jStat.add(sampleMatrix, 2));

/**
 * jStat core linear algebra methods
 */

// jStat(...).add(...)
expectType<JStatObject>(jStat(sampleVector).add(2));
expectType<JStatObject>(jStat(sampleMatrix).add(2));
