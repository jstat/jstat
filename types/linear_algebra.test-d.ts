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

// jStat.subtract(...)
expectType<number[]>(jStat.subtract(sampleVector, 2));
expectType<number[][]>(jStat.subtract(sampleMatrix, 2));

// jStat.divide(...)
expectType<number[]>(jStat.divide(sampleVector, 2));
expectType<number[][]>(jStat.divide(sampleMatrix, 2));

// jStat.multiply(...)
expectType<number[]>(jStat.multiply(sampleVector, 2));
expectType<number[][]>(jStat.multiply(sampleMatrix, 2));

/**
 * jStat core linear algebra methods
 */

// jStat(...).add(...)
expectType<JStatObject>(jStat(sampleVector).add(2));
expectType<JStatObject>(jStat(sampleMatrix).add(2));

// jStat(...).subtract(...)
expectType<JStatObject>(jStat(sampleVector).subtract(2));
expectType<JStatObject>(jStat(sampleMatrix).subtract(2));

// jStat(...).divide(...)
expectType<JStatObject>(jStat(sampleVector).divide(2));
expectType<JStatObject>(jStat(sampleMatrix).divide(2));

// jStat(...).multiply(...)
expectType<JStatObject>(jStat(sampleVector).multiply(2));
expectType<JStatObject>(jStat(sampleMatrix).multiply(2));
