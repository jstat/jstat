/// <reference path="./types/parameters.d.ts" />
/// <reference path="./index.d.ts" />

// import the other tests
import "./types/core.test-d";
import "./types/normal.test-d";
import "./types/studentt.test-d";

import { jStat } from "jstat";
import { expectType, expectError } from "tsd";

const sampleVector = [0, 1, 2];
const sampleMatrix = [sampleVector, sampleVector, sampleVector];

// shortcut to the JStat type as we need the jStat
// for static functional tests

const x = jStat();

// jStat constructor function should return a JStat instance
expectType<JStatObject>(jStat());

// Vector initialization
expectType<JStatObject>(jStat(sampleVector));
// Vector initialization with transform callback
expectType<JStatObject>(
  jStat(sampleVector, (x) => {
    expectType<number>(x);
    return x * 2; // to prevent editor warning we respect return requirements
  })
);

// Matrix initialization
expectType<JStatObject>(jStat(sampleMatrix));
// Matrix initialization with transform callback
expectType<JStatObject>(
  jStat(sampleMatrix, (x) => {
    expectType<number>(x);
    return x * 2; // to prevent editor warning we respect return requirements
  })
);

// start-stop initialization
expectType<JStatObject>(jStat(0, 4, 2));
// start-stop initialization with optional transform callback
expectType<JStatObject>(
  jStat(0, 4, 2, (x) => {
    expectType<number>(x);
    return x * 2; // to prevent editor warning we respect return requirements
  })
);
// start-stop initialization with optional transform callback and count param
expectType<JStatObject>(
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
