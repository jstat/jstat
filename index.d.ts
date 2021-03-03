/// <reference path="./types/parameters.d.ts" />
/// <reference path="./types/core.d.ts" />
/// <reference path="./types/beta.d.ts" />
/// <reference path="./types/normal.d.ts" />
/// <reference path="./types/studentt.d.ts" />
/// <reference path="./types/statistical_test.d.ts" />
/// <reference path="./types/vector.d.ts" />

// The core JStatObject class
declare class JStatObject {
  // Matrix row count
  length: number;

  [index: number]: number[];

  /**
   * Returns the count of rows in a matrix.
   * @example
   * import { jStat } from "jstat";
   *
   * var stat = jStat([[1,2,3],[4,5,6]]);
   * stat.rows() === 2;
   */
  rows(callback?: (count: number) => void): number;

  /**
   * Returns the count of cols in a matrix.
   * @example
   * import { jStat } from "jstat";
   *
   * var stat = jStat([[1,2,3],[4,5,6]]);
   * stat.cols() === 2;
   */
  cols(callback?: (count: number) => void): number;

  /**
   * Returns an object with the dimensions of a matrix.
   * @param matrix
   */
  dimensions(
    callback?: (dimensions: JSTatMatrixDimension) => void
  ): JSTatMatrixDimension;

  /**
   * Returns a new jStat instance initialized with the selected rows
   * from the current jStat instance.
   * @param matrix
   * @param index a row number or an array of row numbers
   */
  row<T extends number | number[]>(
    index: T,
    callback?: (rows: JStatObject) => void
  ): JStatObject;

  /**
   * Returns the specified column as a column vector.
   * @param index a col number or an array of col numbers
   */
  col(
    index: number | number[],
    callback?: (rows: JStatObject) => void
  ): JStatObject;

  /**
   * Returns the diagonal of a matrix.
   * @example
   * import { jStat } from "jstat";
   *
   * var matrix = [[1,2,3],[4,5,6],[7,8,9]];
   * jStat( matrix ).diag() // jStat([[1],[5],[9]])
   */
  diag(callback?: (diagonal: JStatObject) => void): JStatObject;

  /**
   * Returns the anti-diagonal of the matrix.
   * @example
   * import { jStat } from "jstat";
   *
   * const matrix = [[1,2,3],[4,5,6],[7,8,9]];
   * jStat( matrix ).antidiag() // jStat([[3],[5],[7]])
   */
  antidiag(callback?: (diagonal: JStatObject) => void): JStatObject;

  /**
   * Transposes a matrix.
   * @example
   * import { jStat } from "jstat";
   *
   * const matrix = [[1,2],[3,4]];
   * jStat( matrix ).transpose(); // [[1,3],[2,4]]
   */
  transpose(callback?: (diagonal: JStatObject) => void): JStatObject;

  /**
   * Maps a function to all values and return a new object.
   * @example
   * import { jStat } from "jstat";
   *
   * const matrix = [[1,2],[3,4]];
   * jStat( matrix ).map((x) => x * 2); // [[2,4],[6,8]];
   */
  map(transformFn: (x: number) => number): JStatObject;

  /**
   * Cumulatively reduces values using a function and return a new object.
   * @example
   * import { jStat } from "jstat";
   *
   * const matrix = [[1,2],[3,4]];
   * jStat( matrix ).cumreduce((x) => x * 2); // [[2,4],[6,8]];
   */
  cumreduce(transformFn: (a: number, b: number) => number): JStatObject;

  /**
   * Destructively maps to an array (mutates the instance)
   * @example
   * import { jStat } from "jstat";
   *
   * const matrix = jStat([[1,2],[3,4]]);
   * matrix.alter((x) => x * 2);
   * // matrix === jStat([[2,4],[6,8]]);
   */
  alter(transformFn: (x: number) => number): JStatObject;

  /**
   * Creates a size x size square matrix using the supplied function.
   * @param size
   * @param valueFn
   * @example
   * import { jStat } from "jstat";
   *
   * jStat().create(2, (row, col) => row + col); // jStat([[0,1],[1,2]])
   */
  create(
    size: number,
    valueFn: (row: number, col: number) => number
  ): JStatObject;

  /**
   * Creates a row by col matrix using the supplied function.
   * @param row
   * @param col
   * @param valueFn
   * @example
   * import { jStat } from "jstat";
   *
   * jStat().create(2, 3, (row, col) => row + col); // [[0,1,2],[1,2,3]]
   */
  create(
    row: number,
    col: number,
    valueFn: (row: number, col: number) => number
  ): JStatObject;

  /**
   * Creates a size x size square matrix of all 0
   * @param size
   */
  zeros(size: number): JStatObject;
  /**
   * Creates a row by col matrix of all 0
   * @param row
   * @param col
   */
  zeros(row: number, col: number): JStatObject;

  /**
   * Creates a size x size square matrix of all 1
   * @param size
   */
  ones(size: number): JStatObject;
  /**
   * Creates a row by col matrix of all 1
   * @param row
   * @param col
   */
  ones(row: number, col: number): JStatObject;

  /**
   * Creates a size x size square matrix of normally distributed random
   * numbers
   * @param size
   */
  rand(size: number): JStatObject;

  /**
   * Creates a row by col matrix of normally distributed random numbers
   * @param row
   * @param col
   */
  rand(row: number, col: number): JStatObject;

  /**
   * Creates an identity size x size square matrix
   * @param size
   */
  identity(size: number): JStatObject;

  /**
   * Creates an identity matrix of row by col
   * @param row
   * @param col
   */
  identity(row: number, col: number): JStatObject;

  /**
   * Sets all values in the vector or matrix to zero.
   *
   * If a callback is passed then the original object is not altered.
   * @param callback
   */
  clear(callback?: (matrix: JStatObject) => void): JStatObject;

  /**
   * Tests if a matrix is symmetric. This method returns
   * a boolean unless provided with a callback.
   *
   * @example
   * import { jStat } from "jstat";
   *
   * jStat([[1,2],[2,1]]).symmetric() // true
   */
  symmetric(): boolean;

  /**
   * Tests if a matrix is symmetric. This method returns
   * a jStat instance for chaining when a callback is
   * provided.
   * @param callback
   * @example
   * import { jStat } from "jstat";
   *
   * const stat = jStat([[1,2],[2,1]])
   * jStat.symmetric((isSymmetric) => console.log(isSymmetric))
   * // returns stat object but displays `isSymmetric` value
   */
  symmetric(callback?: (isSemmetric: boolean) => void): JStatObject;

  /**
   * Returns the z-score of value taking the jStat object as the
   * observed values. isSample = true denotes use of sample
   * standard deviation.
   *
   * @param x
   * @param isSample
   * @example
   * import { jStat } from "jstat";
   *
   * const stat = jStat(0, 1)
   * jStat.symmetric((isSymmetric) => console.log(isSymmetric))
   */
  zscore(x: number, isSample?: boolean): number;

  /**
   * Adds value to all entries.
   *
   * @param value
   * @example
   * jStat([1,2,3]).add(2);
   * // => jStat([3, 4, 5])
   * jStat([[1, 2], [3, 4]]).add(2);
   * // => jStat([[3, 4], [5, 6]])
   */
  add(value: number): JStatObject;

  /**
   * Subtracts all entries by value.
   *
   * @param value
   * @example
   * jStat([1,2,3]).subtract(2);
   * // => jStat([-1, 0, 1])
   * jStat([[1, 2], [3, 4]]).subtract(2);
   * // => jStat([[-1, 0], [1, 2]])
   */
  subtract(value: number): JStatObject;

  /**
   * Divides all entries by value.
   *
   * @param value
   * @example
   * jStat([2, 4, 6]).divide(2);
   * // => jStat([1, 2, 3])
   * jStat([[2, 4], [6, 8]]).divide(2);
   * // => jStat([[1, 2], [3, 4]])
   */
  divide(value: number): JStatObject;

  /**
   * Multiplies all entries by value.
   *
   * @param value
   * @example
   * jStat([1,2,3]).multiply(2);
   * // => jStat([2, 4, 6])
   * jStat([[1, 2], [3, 4]]).multiply(2);
   * // => jStat([[2, 4], [6, 8]])
   */
  multiply(value: number): JStatObject;
}

declare module "jstat" {
  /**
   * Create an empty JStatObject object
   */
  export function jStat(): JStatObject;

  /**
   * Create a JStatObject from a matrix object
   * @param matrix
   * @param transformFn
   */
  export function jStat(
    matrix: number[][],
    transformFn?: (x: number, count: number) => number
  ): JStatObject;

  /**
   * create a new jStat from a vector object
   * @param vector
   * @param transformFn
   */
  export function jStat(
    vector: number[],
    transformFn?: (x: number, count: number) => number
  ): JStatObject;

  /**
   * Creates a new jStat object from a sequence (same form jStat.seq())
   * @param start
   * @param stop
   * @param count
   * @param transformFn
   */
  export function jStat(
    start: number,
    stop: number,
    count: number,
    transformFn?: (x: number, count: number) => number
  ): JStatObject;
}
