/// <reference path="./types/core.d.ts" />
/// <reference path="./types/normal.d.ts" />
/// <reference path="./types/studentt.d.ts" />

declare module "jstat" {
  export type JStat = typeof JStat;
  // The core JStat class
  class JStat {
    // Matrix row count
    length: number;

    [index: number]: number | number[];

    /**
     * Returns the count of rows in a matrix.
     * @example
     * import jStat from "jstat";
     *
     * var stat = jStat([[1,2,3],[4,5,6]]);
     * stat.rows() === 2;
     */
    rows(callback?: (count: number) => void): number;

    /**
     * Returns the count of cols in a matrix.
     * @example
     * import jStat from "jstat";
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
      callback?: (dimensions: MatrixDimension) => void
    ): MatrixDimension;

    /**
     * Returns a new jStat instance initialized with the selected rows
     * from the current jStat instance.
     * @param matrix
     * @param index a row number or an array of row numbers
     */
    row<T extends number | number[]>(
      index: T,
      callback?: (rows: JStat) => void
    ): JStat;

    /**
     * Returns the specified column as a column vector.
     * @param index a col number or an array of col numbers
     */
    col(index: number | number[], callback?: (rows: JStat) => void): JStat;

    /**
     * Returns the diagonal of a matrix.
     * @example
     * import jStat from "jstat";
     *
     * var matrix = [[1,2,3],[4,5,6],[7,8,9]];
     * jStat( matrix ).diag() // jStat([[1],[5],[9]])
     */
    diag(callback?: (diagonal: JStat) => void): JStat;

    /**
     * Returns the anti-diagonal of the matrix.
     * @example
     * import jStat from "jstat";
     *
     * const matrix = [[1,2,3],[4,5,6],[7,8,9]];
     * jStat( matrix ).antidiag() // jStat([[3],[5],[7]])
     */
    antidiag(callback?: (diagonal: JStat) => void): JStat;

    /**
     * Transposes a matrix.
     * @example
     * import jStat from "jstat";
     *
     * const matrix = [[1,2],[3,4]];
     * jStat( matrix ).transpose(); // [[1,3],[2,4]]
     */
    transpose(callback?: (diagonal: JStat) => void): JStat;

    /**
     * Maps a function to all values and return a new object.
     * @example
     * import jStat from "jstat";
     *
     * const matrix = [[1,2],[3,4]];
     * jStat( matrix ).map((x) => x * 2); // [[2,4],[6,8]];
     */
    map(transformFn: (x: number) => number): JStat;

    /**
     * Cumulatively reduces values using a function and return a new object.
     * @example
     * import jStat from "jstat";
     *
     * const matrix = [[1,2],[3,4]];
     * jStat( matrix ).cumreduce((x) => x * 2); // [[2,4],[6,8]];
     */
    cumreduce(transformFn: (a: number, b: number) => number): JStat;

    /**
     * Destructively maps to an array (mutates the instance)
     * @example
     * import jStat from "jstat";
     *
     * const matrix = jStat([[1,2],[3,4]]);
     * matrix.alter((x) => x * 2);
     * // matrix === jStat([[2,4],[6,8]]);
     */
    alter(transformFn: (x: number) => number): JStat;

    /**
     * Creates a size x size square matrix using the supplied function.
     * @param size
     * @param valueFn
     * @example
     * import jStat from "jstat";
     *
     * jStat().create(2, (row, col) => row + col); // jStat([[0,1],[1,2]])
     */
    create(size: number, valueFn: (row: number, col: number) => number): JStat;

    /**
     * Creates a row by col matrix using the supplied function.
     * @param row
     * @param col
     * @param valueFn
     * @example
     * import jStat from "jstat";
     *
     * jStat().create(2, 3, (row, col) => row + col); // [[0,1,3],[1,2,3]]
     */
    create(
      row: number,
      col: number,
      valueFn: (row: number, col: number) => number
    ): JStat;
  }

  function jStat(): JStat;
  function jStat(
    matrix: number[][],
    transformFn?: (x: number, count: number) => number
  ): JStat;
  function jStat(
    vector: number[],
    transformFn?: (x: number, count: number) => number
  ): JStat;
  function jStat(
    start: number,
    stop: number,
    count: number,
    transformFn?: (x: number, count: number) => number
  ): JStat;

  /**
   * Returns the count of rows in a matrix.
   * @param matrix a number matrix
   * @example
   * import * as jStat from "jstat"
   *
   * var matrix = [[1,2,3],[4,5,6]];
   * jStat.rows( matrix ) === 2;
   */
  export function rows(matrix: number[][] | number[]): number;

  /**
   * Returns the count of cols in a matrix.
   * @example
   * import * as jStat from "jstat"
   *
   * var stat = jStat([[1,2,3],[4,5,6]]);
   * stat.cols() === 2;
   */
  export function cols(matrix: number[][] | number[]): number;

  /**
   * Returns a specified row or set of rows of a matrix.
   * @param matrix
   * @param index a row number or an array of row numbers
   */
  export function row<
    T extends number | number[],
    U extends number[][] | number[]
  >(
    matrix: U,
    index: T
  ): T extends number
    ? U extends number[] // if we are working on a vector
      ? number | undefined
      : Array<number | undefined>
    : U extends number[] // if we are working on a matrix
    ? Array<number | undefined>
    : Array<Array<number | undefined>>;

  /**
   * Returns the specified column as a column vector.
   * @param matrix
   * @param index a col number or an array of col numbers
   */
  export function col(matrix: number[][], index: number | number[]): number[][];

  export interface MatrixDimension {
    cols: number;
    rows: number;
  }
  /**
   * Returns an object with the dimensions of a matrix.
   * @param matrix
   */
  export function dimensions(matrix: number[][] | number[]): MatrixDimension;

  /**
   * Returns the anti-diagonal of the matrix.
   * @param matrix
   * @example
   * import * as jStat from "jstat";
   *
   * const matrix = [[1,2,3],[4,5,6],[7,8,9]];
   * jStat.antidiag( matrix ) // [[1],[5],[9]];
   */
  export function diag(matrix: number[][]): number[];

  /**
   * Returns the diagonal of a matrix.
   * @param matrix
   * @example
   * import * as jStat from "jstat";
   *
   * const matrix = [[1,2,3],[4,5,6],[7,8,9]];
   * jStat.diag( matrix ) // [[1],[5],[9]]
   */
  export function antidiag(matrix: number[][]): number[];

  /**
   * Creates a new diagonal matrix by given 1d diag array.
   * @param vector
   * @example
   * import * as jStat from "jstat";
   *
   * jStat.diagonal([1,2,3]); // [[1,0,0],[0,2,0],[0,0,3]]
   */
  export function diagonal(vector: number[]): number[][];

  /**
   * Transposes a matrix.
   * @param matrix
   * @example
   * import * as jStat from "jstat";
   *
   * const matrix = [[1,2],[3,4]];
   * jStat.transpose(matrix); // [[1,3],[2,4]];
   */
  export function transpose(matrix: number[][]): number[][];

  /**
   * Maps a function to all values and return a new object.
   * @param matrix
   * @param transformFn
   * @example
   * import * as jStat from "jstat";
   *
   * const matrix = [[1,2],[3,4]];
   * jStat.map(matrix, (x) => x * 2); // [[2,4],[6,8]];
   */
  export function map<T extends number[] | number[][]>(
    matrix: T,
    transformFn: (x: number) => number
  ): T;

  /**
   * Cumulatively reduces values using a function and return a new object.
   * @example
   * import * as jStat from "jstat";
   *
   * const matrix = [[1,2],[3,4]];
   * jStat.cumreduce(matrix, (x) => x * 2); // [[1,3],[3,7]];
   */
  export function cumreduce<T extends number[] | number[][]>(
    matrix: T,
    transformFn: (a: number, b: number) => number
  ): T;

  /**
   * Destructively maps to an array (mutates the matrix).
   * @param matrix
   * @param transformFn
   * @example
   * import * as jStat from "jstat";
   *
   * const matrix = [[1,2],[3,4]];
   * jStat.alter(matrix, (x) => x * 2); // matrix === [[2,4],[6,8]];
   */
  export function alter<T extends number[] | number[][]>(
    matrix: T,
    transformFn: (x: number) => number
  ): T;

  /**
   * Creates a size x size square matrix using the supplied function.
   *
   * @param size
   * @param valueFn
   * @example
   * import * as jStat from "jstat";
   *
   * jStat.create(2, (row, col) => row + col); // [[0,1],[1,2]]
   */
  export function create(
    size: number,
    valueFn: (row: number, col: number) => number
  ): number[][];

  /**
   * Creates a row by col matrix using the supplied function.
   *
   * @param row
   * @param col
   * @param valueFn
   * @example
   * import * as jStat from "jstat";
   *
   * jStat.create(2, 3, (row, col) => row + col); // [[0,1,3],[1,2,3]]
   */
  export function create(
    row: number,
    col: number,
    valueFn: (row: number, col: number) => number
  ): number[][];

  /**
   * Performs the full Tukey's range test returning p-values for every
   * pairwise combination of the arrays in the format of
   * `[[[index1, index2], pvalue], ...]`
   * @param arrays population samples
   * @example
   * import * as jStat from "jstat";
   *
   * jStat.tukeyhsd([[1, 2], [3, 4, 5], [6], [7, 8]])
   * [ [ [ 0, 1 ], 0.10745283896120883 ],
   *   [ [ 0, 2 ], 0.04374051946838586 ],
   *   [ [ 0, 3 ], 0.007850804224287633 ],
   *   [ [ 1, 2 ], 0.32191548545694226 ],
   *   [ [ 1, 3 ], 0.03802747415485819 ],
   *   [ [ 2, 3 ], 0.5528665999257486 ] ]
   */
  export function tukeyhsd(arrays: number[][]): TukeyHSD[];
  type TukeyHSD = [[number, number], number];

  /**
   * Returns the variance of the array vector. By default, the population
   * variance is calculated. Passing true to flag indicates to compute the
   * sample variance instead.
   * @param arr
   * @param flag
   * @example
   * import * as jStat from "jstat";
   *
   * jStat.variance([1,2,3,4]) === 1.25
   * jStat.variance([1,2,3,4],true) === 1.66666...
   */
  export function variance(arr: number[], flag?: boolean): number;

  export function spearmancoeff(arr1: number[], arr2: number[]): number;
  export function corrcoeff(arr1: number[], arr2: number[]): number;
  export function stdev(arr: number[], isSample?: boolean): number;

  export function anovaftest(...args: number[][]): number;
  export function anovafscore(...args: number[][]): number;
  export function anovafscore(args: number[][]): number;

  export default jStat;
}
