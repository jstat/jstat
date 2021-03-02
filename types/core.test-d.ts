/// <reference path="../index.d.ts" />
/// <reference path="./core.d.ts" />

import * as jStat from "jstat";
import { expectType, expectError } from "tsd";

const aVector = [0, 1, 2];
const aMatrix = [aVector, aVector];

/**
 * jStat.rowa(...)
 */
expectType<number[] | undefined>(jStat.rowa(aMatrix, 1));
expectType<number | undefined>(jStat.rowa(aVector, 1));

/**
 * jStat.cola(...)
 */
expectType<number[] | undefined>(jStat.cola(aMatrix, 1));
// It seems that requesting a col on a vector is pointless
// so for now I'll expect an error
expectError(jStat.cola(aVector, 1));

/**
 * jStat.slice(...)
 */
expectType<number[][]>(
  jStat.slice(aMatrix, { row: { end: 2 }, col: { start: 1 } })
);
expectType<number[][]>(jStat.slice(aMatrix, { row: { end: 2 } }));
expectType<number[][]>(jStat.slice(aMatrix, { col: { start: 1 } }));
expectType<number[][]>(jStat.slice(aMatrix, {}));
expectError<number[][]>(jStat.slice(aMatrix));

/**
 * jStat.sliceAssign(...)
 */
expectError(jStat.sliceAssign(aMatrix, { row: { end: 2 }, col: { start: 1 } }));
expectType<number[][]>(
  jStat.sliceAssign(aMatrix, { row: { end: 2 }, col: { start: 1 } }, aMatrix)
);
