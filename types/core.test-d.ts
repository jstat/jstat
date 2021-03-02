/// <reference path="../index.d.ts" />
/// <reference path="./core.d.ts" />

import { jStat } from "jstat";
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

// jStat.rows()
expectType<number>(jStat.rows(sampleMatrix));
expectType<number>(jStat.rows(sampleVector));

// jStat.cols()
expectType<number>(jStat.cols(sampleMatrix));
expectType<number>(jStat.cols(sampleVector));

// jStat.dimensions()
expectType<JSTatMatrixDimension>(jStat.dimensions(sampleMatrix));
expectType<JSTatMatrixDimension>(jStat.dimensions(sampleVector));

// jStat.row()
expectType<number | undefined>(jStat.row(sampleVector, 1));
expectType<Array<number | undefined>>(jStat.row(sampleVector, [0, 2]));
expectType<Array<number | undefined>>(jStat.row(sampleMatrix, 1));
expectType<Array<Array<number | undefined>>>(jStat.row(sampleMatrix, [0, 2]));

// jStat.col()
expectError(jStat.col(sampleVector, 1));
expectError(jStat.col(sampleVector, [0, 2]));
expectType<number[][]>(jStat.col(sampleMatrix, 1));
expectType<number[][]>(jStat.col(sampleMatrix, [0, 2]));

// jStat.diag()
expectError(jStat.diag(sampleVector));
expectType<number[]>(jStat.diag(sampleMatrix));

// jStat.antidiag()
expectError(jStat.antidiag(sampleVector));
expectType<number[]>(jStat.antidiag(sampleMatrix));

// jStat.diagonal()
expectType<number[][]>(jStat.diagonal(sampleVector));

// jStat.transpose()
expectError(jStat.transpose(sampleVector));
expectType<number[][]>(jStat.transpose(sampleMatrix));

// jStat.map()
expectType<number[]>(
  jStat.map(sampleVector, (x) => {
    expectType<number>(x);
    return x;
  })
);
expectType<number[][]>(
  jStat.map(sampleMatrix, (x) => {
    expectType<number>(x);
    return x;
  })
);

// jStat.cumreduce()
expectType<number[]>(
  jStat.cumreduce(sampleVector, (a, b) => {
    expectType<number>(a);
    expectType<number>(b);
    return a + b;
  })
);
expectType<number[][]>(
  jStat.cumreduce(sampleMatrix, (a, b) => {
    expectType<number>(a);
    expectType<number>(b);
    return a + b;
  })
);

// jStat.alter()
expectType<number[]>(
  jStat.alter(sampleVector, (x) => {
    expectType<number>(x);
    return x;
  })
);
expectType<number[][]>(
  jStat.alter(sampleMatrix, (x) => {
    expectType<number>(x);
    return x;
  })
);

// jStat.create()
expectType<number[][]>(
  jStat.create(2, (row, col) => {
    expectType<number>(row);
    expectType<number>(col);
    return row + col;
  })
);

expectType<number[][]>(
  jStat.create(2, 4, (row, col) => {
    expectType<number>(row);
    expectType<number>(col);
    return row + col;
  })
);

// jStat.zeros()
expectType<number[][]>(jStat.zeros(2));
expectType<number[][]>(jStat.zeros(2, 4));

// jStat.ones()
expectType<number[][]>(jStat.ones(2));
expectType<number[][]>(jStat.ones(2, 4));

// jStat.rand()
expectType<number[][]>(jStat.rand(2));
expectType<number[][]>(jStat.rand(2, 4));

// jStat.copy()
expectType<number[]>(jStat.copy(sampleVector));
expectType<number[][]>(jStat.copy(sampleMatrix));

// jStat.identity()
expectType<number[][]>(jStat.identity(2));
expectType<number[][]>(jStat.identity(2, 4));

// jStat.seq
expectType<number[]>(jStat.seq(1, 2, 10));

// jStat.arange
expectType<number[]>(jStat.arange(10));
expectType<number[]>(jStat.arange(1, 5));
expectType<number[]>(jStat.arange(5, 1, -1));

// jStat.clear
expectType<number[]>(jStat.clear(sampleVector));
expectType<number[][]>(jStat.clear(sampleMatrix));

// jStat.symmetric
expectError(jStat.symmetric(sampleVector));
expectType<boolean>(jStat.symmetric(sampleMatrix));
