/// <reference path="./index.d.ts" />
/// <reference path="./core.d.ts" />

import { jStat } from "jstat";
import { expectType, expectError } from "tsd";

const sampleVector = [0, 1, 2];
const sampleMatrix = [sampleVector, sampleVector, sampleVector];

/**
 * jStat static core functions
 */

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

/**
 * jStat core instance methods
 */
const stat = jStat([1, 2, 3]);

// jStat vector length of matrix width
expectType<number>(stat.length);

// array index access
expectType<number[]>(stat[0]);

// jStat(...).rows()
expectType<number>(stat.rows());
expectType<number>(stat.rows((count) => expectType<number>(count)));

// jStat(...).cols()
expectType<number>(stat.cols());
expectType<number>(stat.cols((count) => expectType<number>(count)));

// jStat(...).dimensions()
expectType<JSTatMatrixDimension>(stat.dimensions());

// jStat(...).col()
expectType<JStatObject>(stat.col(0));
expectType<JStatObject>(stat.col(0, (inst) => expectType<JStatObject>(inst)));

// jStat(...).row()
expectType<JStatObject>(stat.row(0));
expectType<JStatObject>(stat.row(0, (inst) => expectType<JStatObject>(inst)));

// jStat(...).diag()
expectType<JStatObject>(stat.diag());
expectType<JStatObject>(
  stat.diag((diagonal) => expectType<JStatObject>(diagonal))
);

// jStat(...).antidiag()
expectType<JStatObject>(stat.antidiag());
expectType<JStatObject>(
  stat.antidiag((diagonal) => expectType<JStatObject>(diagonal))
);

// jStat(...).transpose()
expectType<JStatObject>(stat.transpose());
expectType<JStatObject>(
  stat.transpose((matrix) => expectType<JStatObject>(matrix))
);

// jStat(...).map()
expectError(stat.map());
expectType<JStatObject>(
  stat.map((x) => {
    expectType<number>(x);
    return x;
  })
);

// jStat(...).cumreduce()
expectError(stat.cumreduce());
expectType<JStatObject>(
  stat.cumreduce((a, b) => {
    expectType<number>(a);
    expectType<number>(b);
    return a + b;
  })
);

// jStat(...).alter()
expectError(stat.alter());
expectType<JStatObject>(
  stat.alter((x) => {
    expectType<number>(x);
    return x;
  })
);

// jStat(...).create()
expectType<JStatObject>(
  stat.create(2, (row, col) => {
    expectType<number>(row);
    expectType<number>(col);
    return row + col;
  })
);
expectType<JStatObject>(
  stat.create(2, 4, (row, col) => {
    expectType<number>(row);
    expectType<number>(col);
    return row + col;
  })
);

// jStat(...).zeros()
expectType<JStatObject>(stat.zeros(2));
expectType<JStatObject>(stat.zeros(2, 4));

// jStat(...).ones()
expectType<JStatObject>(stat.ones(2));
expectType<JStatObject>(stat.ones(2, 4));

// jStat(...).rand()
expectType<JStatObject>(stat.rand(2));
expectType<JStatObject>(stat.rand(2, 4));

// jStat(...).identity()
expectType<JStatObject>(stat.identity(2));
expectType<JStatObject>(stat.identity(2, 4));

// jStat(...).clear
expectType<JStatObject>(stat.clear());
expectType<JStatObject>(
  stat.clear((matrix) => {
    expectType<JStatObject>(matrix);
  })
);

// jStat(...).symmetric
expectType<boolean>(stat.symmetric());
expectType<JStatObject>(
  stat.symmetric((isSymmetric) => {
    expectType<boolean>(isSymmetric);
  })
);
