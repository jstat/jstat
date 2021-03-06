/// <reference path="./parameters.d.ts" />
/// <reference path="./index.d.ts" />

// import the other tests
import "./core.test-d";
import "./beta.test-d";
import "./normal.test-d";
import "./lognormal.test-d";
import "./studentt.test-d";
import "./vector.test-d";
import "./statistical_test.test-d";
import "./linear_algebra.test-d";

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
