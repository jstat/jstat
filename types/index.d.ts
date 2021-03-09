/// <reference path="./parameters.d.ts" />
/// <reference path="./core.d.ts" />
/// <reference path="./beta.d.ts" />
/// <reference path="./normal.d.ts" />
/// <reference path="./lognormal.d.ts" />
/// <reference path="./studentt.d.ts" />
/// <reference path="./statistical_test.d.ts" />
/// <reference path="./vector.d.ts" />

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

  /**
   * Takes dot product.
   *
   * @param value
   * @example
   * jStat([1, 3, -5]).dot([4, -2, -1]);
   * // => 3
   * jStat([[2, 4], [6, 8]]).dot([[1, 1], [1, 1]]);
   * // => jStat([6, 14])
   */
  dot<T extends number[] | number[][]>(
    value: T
  ): T extends number[][] ? JStatObject : number;

  /**
   * Raises all entries by value.
   *
   * @param value
   * @example
   * jStat([1, 2, 3]).pow(2);
   * // => jStat([1, 4, 9])
   * jStat([[1, 2], [3, 4]]).pow(2);
   * // => jStat([[1, 4], [9, 16]])
   */
  pow(value: number): JStatObject;

  /**
   * Exponentiates all entries.
   *
   * @example
   * jStat([0, 1]).exp();
   * // => jStat([1, 2.718281828459045])
   * jStat([[0, 1], [1, 0]]).exp();
   * // => jStat([[1, 2.718281828459045], [2.718281828459045, 1]])
   */
  exp(): JStatObject;

  /**
   * Returns the natural logarithm of all entries.
   *
   * @example
   * jStat([1, 2.718281828459045]).log();
   * // => jStat([0, 1])
   * jStat([[1, 2.718281828459045], [2.718281828459045, 1]]).log();
   * // => jStat([[0, 1], [1, 0]])
   */
  log(): JStatObject;

  /**
   * Returns the absolute values of all entries.
   *
   * @example
   * jStat([1,-2,-3]).abs();
   * // => jStat([1, 2, 3])
   * jStat([[-1, 1], [2, -2]]).abs();
   * // => jStat([[1, 1], [2, 2]])
   */
  abs(): JStatObject;

  /**
   * Computes the norm of a vector. Note that if a matrix is passed,
   * then the first row of the matrix will be used as a vector
   * for `norm()`.
   *
   * @example
   * jStat([1,2,3]).norm()
   * // => 3.7416573867739413
   * jStat([[1,2,3], [4,5,6]]).norm()
   * // => 3.7416573867739413
   */
  norm(): number;

  /**
   * Computes the angle between two vectors. Note that if a matrix
   * is passed, then the first row of the matrix will be used as
   * the vector for `angle()`.
   *
   * @example
   * jStat([1,2,3]).angle([2,3,4])
   * // => 0.12186756768575456
   * jStat([1,2,3]).angle([[2,3,4], [1,2,3]])
   * // => 0.12186756768575456
   */
  angle(vector: number[]): number;

  /**
   * Returns the quartiles for a vector or matrix columns.
   * @example
   * jStat(1,100,100).quartiles()
   * // => [25, 50, 75]
   */
  quartiles(): number[] | number[][];

  /**
   * Pass the quartiles for a vector or matrix columns to the given callback.
   * Returns an instance of the jStat object for chaining
   * @param callback receives the calculated quartile array
   * @example
   * jStat(1,100,100).quartiles((x) => console.log("quartiles: ", x))
   * // => jStatObject
   */
  quartiles(callback: (results?: number[]) => void): JStatObject;

  /**
   * Like quartiles, but calculate and return arbitrary quantiles of
   * the dataArray vector or matrix (column-by-column).
   *
   * Optional parameters alphap and betap govern the quantile
   * estimation method. For more details see the Wikipedia page
   * on quantiles or scipy.stats.mstats.mquantiles documentation.
   *
   * The default values for `alphap` and `betap` are 3/8, the resulting
   * quantile estimates are approximately unbiased if x is normally
   * distributed.
   * @param quartiles
   * @param alphap
   * @param betap
   * @example
   * jStat([1,2,3,4,5,6,7,8,9,10]).quantiles([0.25, 0.5, 0.75])
   * // => [2.9375, 5.5, 8.0625]
   */
  quantiles(quartiles: number[], alphap?: number, betap?: number): number[];

  /**
   * Returns the median of the array vector or collection of vector
   * (matrix).
   * @example
   * jStat( 1, 5, 5 ).median();
   * // => 3
   * jStat([[1,2],[3,4]]).median()
   * // => [2, 3]
   */
  median(): number | number[];

  /**
   * Returns the median of the array vector or collection of vector
   * (matrix).
   * @param callback callback receives the median
   * @example
   * jStat( 1, 5, 5 ).median(
   *   (median) => console.log("median: %s", median)
   * );
   * // => jStatObject
   */
  median(callback: (median: number | number[]) => void): JStatObject;

  /**
   * Returns the p-value of value of the vector in the jStatObject.
   * sides is an integer value 1 or 2 denoting a one or two
   * sided z-test. If sides is not specified the test defaults
   * to a two sided z-test.
   *
   * flag===true denotes the use of the sample standard deviation.
   * @param x
   * @param sides
   * @param flag
   * @example
   * jStat([1,2,3,4,5,6]).ztest(5)
   * // => 0.379775474840949
   * jStat([1,2,3,4,5,6]).ztest(5, 1, true)
   * // => 0.21133903708531765
   */
  ztest(x: number, sides?: 1 | 2, flag?: boolean): number;
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
