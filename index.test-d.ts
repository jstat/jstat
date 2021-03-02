/// <reference path="./index.d.ts" />

// import the other tests
import "./types/core.test-d";
import "./types/normal.test-d";
import "./types/studentt.test-d";

import jStat, * as jStatCtx from "jstat";
import { expectType, expectError } from "tsd";

const sampleVector = [0, 1, 2];
const sampleMatrix = [sampleVector, sampleVector, sampleVector];

// shortcut to the JStat type as we need the jStatCtx
// for static functional tests
type JStat = jStatCtx.JStat;

// jStat constructor function should return a JStat instance
expectType<InstanceType<JStat>>(jStat());

// Vector initialization
expectType<InstanceType<JStat>>(jStat(sampleVector));
// Vector initialization with transform callback
expectType<InstanceType<JStat>>(
  jStat(sampleVector, (x) => {
    expectType<number>(x);
    return x * 2; // to prevent editor warning we respect return requirements
  })
);

// Matrix initialization
expectType<InstanceType<JStat>>(jStat(sampleMatrix));
// Matrix initialization with transform callback
expectType<InstanceType<JStat>>(
  jStat(sampleMatrix, (x) => {
    expectType<number>(x);
    return x * 2; // to prevent editor warning we respect return requirements
  })
);

// start-stop initialization
expectType<InstanceType<JStat>>(jStat(0, 4, 2));
// start-stop initialization with optional transform callback
expectType<InstanceType<JStat>>(
  jStat(0, 4, 2, (x) => {
    expectType<number>(x);
    return x * 2; // to prevent editor warning we respect return requirements
  })
);
// start-stop initialization with optional transform callback and count param
expectType<InstanceType<JStat>>(
  jStat(0, 4, 2, (x, cnt) => {
    expectType<number>(x);
    expectType<number>(cnt);
    return x * 2; // to prevent editor warning we respect return requirements
  })
);

/**
 * jStat instance methods
 */
const stat = jStat([1, 2, 3]);

// jStat vector length of matrix width
expectType<number>(stat.length);

// array index access
expectType<number | number[]>(stat[0]);

// jStat(...).rows()
expectType<number>(stat.rows());
expectType<number>(stat.rows((count) => expectType<number>(count)));

// jStat(...).cols()
expectType<number>(stat.cols());
expectType<number>(stat.cols((count) => expectType<number>(count)));

// jStat(...).dimensions()
expectType<jStatCtx.MatrixDimension>(stat.dimensions());

// jStat(...).col()
expectType<InstanceType<JStat>>(stat.col(0));
expectType<InstanceType<JStat>>(
  stat.col(0, (inst) => expectType<InstanceType<JStat>>(inst))
);

// jStat(...).row()
expectType<InstanceType<JStat>>(stat.row(0));
expectType<InstanceType<JStat>>(
  stat.row(0, (inst) => expectType<InstanceType<JStat>>(inst))
);

// jStat(...).diag()
expectType<InstanceType<JStat>>(stat.diag());
expectType<InstanceType<JStat>>(
  stat.diag((diagonal) => expectType<InstanceType<JStat>>(diagonal))
);

// jStat(...).antidiag()
expectType<InstanceType<JStat>>(stat.antidiag());
expectType<InstanceType<JStat>>(
  stat.antidiag((diagonal) => expectType<InstanceType<JStat>>(diagonal))
);

// jStat(...).transpose()
expectType<InstanceType<JStat>>(stat.transpose());
expectType<InstanceType<JStat>>(
  stat.transpose((matrix) => expectType<InstanceType<JStat>>(matrix))
);

// jStat(...).map()
expectError<InstanceType<JStat>>(stat.map());
expectType<InstanceType<JStat>>(
  stat.map((x) => {
    expectType<number>(x);
    return x;
  })
);

// jStat(...).cumreduce()
expectError<InstanceType<JStat>>(stat.cumreduce());
expectType<InstanceType<JStat>>(
  stat.cumreduce((a, b) => {
    expectType<number>(a);
    expectType<number>(b);
    return a + b;
  })
);

/**
 * jStat functions
 */

// jStat.rows()
expectType<number>(jStatCtx.rows(sampleMatrix));
expectType<number>(jStatCtx.rows(sampleVector));

// jStat.cols()
expectType<number>(jStatCtx.cols(sampleMatrix));
expectType<number>(jStatCtx.cols(sampleVector));

// jStat.dimensions()
expectType<jStatCtx.MatrixDimension>(jStatCtx.dimensions(sampleMatrix));
expectType<jStatCtx.MatrixDimension>(jStatCtx.dimensions(sampleVector));

// jStat.row()
expectType<number | undefined>(jStatCtx.row(sampleVector, 1));
expectType<Array<number | undefined>>(jStatCtx.row(sampleVector, [0, 2]));
expectType<Array<number | undefined>>(jStatCtx.row(sampleMatrix, 1));
expectType<Array<Array<number | undefined>>>(
  jStatCtx.row(sampleMatrix, [0, 2])
);

// jStat.col()
expectError(jStatCtx.col(sampleVector, 1));
expectError(jStatCtx.col(sampleVector, [0, 2]));
expectType<number[][]>(jStatCtx.col(sampleMatrix, 1));
expectType<number[][]>(jStatCtx.col(sampleMatrix, [0, 2]));

// jStat.diag()
expectError(jStatCtx.diag(sampleVector));
expectType<number[]>(jStatCtx.diag(sampleMatrix));

// jStat.antidiag()
expectError(jStatCtx.antidiag(sampleVector));
expectType<number[]>(jStatCtx.antidiag(sampleMatrix));

// jStat.diagonal()
expectType<number[][]>(jStatCtx.diagonal(sampleVector));

// jStat.transpose()
expectError(jStatCtx.transpose(sampleVector));
expectType<number[][]>(jStatCtx.transpose(sampleMatrix));

// jStat.map()
expectType<number[]>(
  jStatCtx.map(sampleVector, (x) => {
    expectType<number>(x);
    return x;
  })
);
expectType<number[][]>(
  jStatCtx.map(sampleMatrix, (x) => {
    expectType<number>(x);
    return x;
  })
);

// jStat.cumreduce()
expectType<number[]>(
  jStatCtx.cumreduce(sampleVector, (a, b) => {
    expectType<number>(a);
    expectType<number>(b);
    return a + b;
  })
);
expectType<number[][]>(
  jStatCtx.cumreduce(sampleMatrix, (a, b) => {
    expectType<number>(a);
    expectType<number>(b);
    return a + b;
  })
);
