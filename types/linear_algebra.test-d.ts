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

// jStat.dot(...)
expectType<number>(jStat.dot(sampleVector, sampleVector));
expectType<number[]>(jStat.dot(sampleMatrix, sampleMatrix));

// jStat.pow(...)
expectType<number[]>(jStat.pow(sampleVector, 2));
expectType<number[][]>(jStat.pow(sampleMatrix, 2));

// jStat.exp(...)
expectType<number[]>(jStat.exp(sampleVector));
expectType<number[][]>(jStat.exp(sampleMatrix));

// jStat.log(...)
expectType<number[]>(jStat.log(sampleVector));
expectType<number[][]>(jStat.log(sampleMatrix));

// jStat.abs(...)
expectType<number[]>(jStat.abs(sampleVector));
expectType<number[][]>(jStat.abs(sampleMatrix));

// jStat.norm(...)
expectType<number>(jStat.norm(sampleVector));
expectType<number>(jStat.norm(sampleMatrix));

// jStat.angle(...)
expectType<number>(jStat.angle(sampleVector, sampleVector));
expectError(jStat.angle(sampleMatrix, sampleMatrix));

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

// jStat(...).dot(...)
expectType<number>(jStat(sampleVector).dot(sampleVector));
expectType<JStatObject>(jStat(sampleMatrix).dot(sampleMatrix));

// jStat(...).pow(...)
expectType<JStatObject>(jStat(sampleVector).pow(2));
expectType<JStatObject>(jStat(sampleMatrix).pow(2));

// jStat(...).exp(...)
expectType<JStatObject>(jStat(sampleVector).exp());
expectType<JStatObject>(jStat(sampleMatrix).exp());

// jStat(...).log(...)
expectType<JStatObject>(jStat(sampleVector).log());
expectType<JStatObject>(jStat(sampleMatrix).log());

// jStat(...).abs(...)
expectType<JStatObject>(jStat(sampleVector).abs());
expectType<JStatObject>(jStat(sampleMatrix).abs());

// jStat(...).norm(...)
expectType<number>(jStat(sampleVector).norm());
expectType<number>(jStat(sampleMatrix).norm());

// jStat(...).angle(...)
expectType<number>(jStat(sampleVector).angle(sampleVector));
expectError(jStat(sampleVector).angle(sampleMatrix));
