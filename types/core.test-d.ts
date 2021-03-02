/// <reference path="../index.d.ts" />
/// <reference path="./core.d.ts" />

import * as jStat from "jstat";
import { expectType, expectError } from "tsd";

const sampleVector = [0, 1, 2];
const sampleMatrix = [sampleVector, sampleVector, sampleVector];

/**
 * jStat.rowa(...)
 */
expectType<number[] | undefined>(jStat.rowa(sampleMatrix, 1));
expectType<number | undefined>(jStat.rowa(sampleVector, 1));

/**
 * jStat.cola(...)
 */
expectType<number[] | undefined>(jStat.cola(sampleMatrix, 1));
// It seems that requesting a col on a vector is pointless
// so for now I'll expect an error
expectError(jStat.cola(sampleVector, 1));

/**
 * jStat.slice(...)
 */
expectType<number[][]>(
  jStat.slice(sampleMatrix, { row: { end: 2 }, col: { start: 1 } })
);
expectType<number[][]>(jStat.slice(sampleMatrix, { row: { end: 2 } }));
expectType<number[][]>(jStat.slice(sampleMatrix, { col: { start: 1 } }));
expectType<number[][]>(jStat.slice(sampleMatrix, {}));
expectError(jStat.slice(sampleMatrix));

/**
 * jStat.sliceAssign(...)
 */
expectError(
  jStat.sliceAssign(sampleMatrix, { row: { end: 2 }, col: { start: 1 } })
);
expectType<number[][]>(
  jStat.sliceAssign(
    sampleMatrix,
    { row: { end: 2 }, col: { start: 1 } },
    sampleMatrix
  )
);
