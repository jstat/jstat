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
}
