declare module "jstat" {
  /**
   * Returns a array from matrix row.
   * @param matrix number matrix
   * @param row column index
   */
  export function rowa(matrix: number[][], row: number): number[] | undefined;
  export function rowa(matrix: number[], row: number): number | undefined;

  /**
   * Returns an array from matrix column (col() will return a matrix
   * form instead of an array form).
   * @param matrix number matrix
   * @param col column index
   */
  export function cola(matrix: number[][], col: number): number[] | undefined;

  export interface JStatSliceConfig {
    row?: { end?: number; start?: number };
    col?: { end?: number; start?: number };
  }
  /**
   * Slices matrix as numpy style.
   * @param matrix
   * @param config
   * @example
   * import * as jStat from "jstat";
   *
   * A=[[1,2,3],[4,5,6],[7,8,9]];
   * slice(A,{row:{end:2},col:{start:1}}); // [[2,3],[5,6]];
   * slice(A,1,{start:1}); // [5,6];
   */
  export function slice(
    matrix: number[][],
    config: JStatSliceConfig
  ): number[][];

  /**
   * Do slice assign as numpy style.
   * @param matrix
   * @param config
   * @param content
   * @example
   * import * as jStat from "jstat";
   *
   * const A = [[1,2,3],[4,5,6],[7,8,9]];
   * jStat.sliceAssign(A,{row : {start : 1}, col : {start : 1}},[[0,0],[0,0]]);
   * // A = [[1,2,3],[4,0,0],[7,0,0]];
   */
  export function sliceAssign(
    matrix: number[][],
    config: JStatSliceConfig,
    content: number[][]
  ): number[][];

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
   * jStat.create(2, 3, (row, col) => row + col); // [[0,1,2],[1,2,3]]
   */
  export function create(
    row: number,
    col: number,
    valueFn: (row: number, col: number) => number
  ): number[][];

  /**
   * Creates a size x size square matrix of all 0
   * @param size
   */
  export function zeros(size: number): number[][];

  /**
   * Creates a row by col matrix of all 0
   * @param row
   * @param col
   */
  export function zeros(row: number, col: number): number[][];

  /**
   * Creates a size x size square matrix of all 1
   * @param size
   */
  export function ones(size: number): number[][];

  /**
   * Creates a row by col matrix of all 1
   * @param row
   * @param col
   */
  export function ones(row: number, col: number): number[][];

  /**
   * Creates a size x size square matrix of normally distributed random
   * numbers
   * @param size
   */
  export function rand(size: number): number[][];

  /**
   * Creates a row by col matrix of normally distributed random numbers
   * @param row
   * @param col
   */
  export function rand(row: number, col: number): number[][];

  /**
   * Returns a copy of given matrix.
   *
   * @param matrix
   */
  export function copy<T extends number[] | number[][]>(matrix: T): T;

  /**
   * Creates an identity size x size square matrix
   * @param size
   */
  export function identity(size: number): number[][];

  /**
   * Creates an identity matrix of row by col
   * @param row
   * @param col
   */
  export function identity(row: number, col: number): number[][];

  /**
   * Creates an arithmetic sequence by given length.
   * @param start
   * @param stop
   * @param length
   * @example
   * import * as jStat from "jstat";
   *
   * jStat.seq(1,5,9); // [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];
   */
  export function seq(start: number, stop: number, length: number): number[];

  /**
   * Creates an arithmetic sequence of a given length starting at 0.
   * @param length
   * @example
   * import * as jStat from "jstat";
   *
   * jStat.arange(5); // [0,1,2,3,4]
   */
  export function arange(length: number): number[];

  /**
   * Creates an arithmetic sequence from start to stop (excluded) with
   * a given step (step defaults to `1` if not provided)
   * @param start
   * @param stop
   * @param step
   * @example
   * import * as jStat from "jstat";
   *
   * jStat.arange(1, 5); // [1,2,3,4]
   * jStat.arange(5,1,-1); // [5,4,3,2]
   */
  export function arange(start: number, stop: number, step?: number): number[];

  /**
   * Sets all values in the vector or matrix to zero. (mutates the argument)
   * @param vector
   * @example
   * import * as jStat from "jstat";
   *
   * const vector = [1,2,3];
   * jStat.clear(vector);
   * // vector === [0,0,0]
   */
  export function clear<T extends number[] | number[][]>(vector: T): T;

  /**
   * Tests if a matrix is symmetric.
   * @param matrix
   * @example
   * import * as jStat from "jstat";
   *
   * jStat.symmetric([[1,2],[2,1]]); // true
   */
  export function symmetric(matrix: number[][]): boolean;
}
