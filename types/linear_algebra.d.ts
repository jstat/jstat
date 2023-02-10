declare module "jstat" {
  namespace jStat {
    /**
     * Adds value to all entries.
     * @param matrix
     * @param value
     * @example
     * jStat.add([1, 2, 3], 2);
     * // => [3, 4, 5]
     * jStat.add([[1, 2], [3, 4]], 2);
     * // => [[3, 4], [5, 6]]
     */
    export function add<T extends number[] | number[][]>(
      matrix: T,
      value: number
    ): T;

    /**
     * Subtracts all entries by value.
     * @param matrix
     * @param value
     * @example
     * jStat.subtract([1, 2, 3], 2);
     * // => [-1, 0, 1]
     * jStat.subtract([[1, 2], [3, 4]], 2);
     * // => [[-1, 0], [1, 2]]
     */
    export function subtract<T extends number[] | number[][]>(
      matrix: T,
      value: number
    ): T;

    /**
     * Divides all entries by value.
     *
     * @param matrix
     * @param value
     * @example
     * jStat.divide([2, 4, 6], 2);
     * // => [1, 2, 3]
     * jStat.divide([[2, 4], [6, 8]], 2);
     * // => [[1, 2], [3, 4]]
     */
    export function divide<T extends number[] | number[][]>(
      matrix: T,
      value: number
    ): T;

    /**
     * Multiplies all entries by value.
     *
     * @param matrix
     * @param value
     * @example
     * jStat.multiply([1, 2, 3], 2);
     * // => [2, 4, 6]
     * jStat.multiply([[1, 2], [3, 4]], 2);
     * // => [[2, 4], [6, 8]]
     */
    export function multiply<T extends number[] | number[][]>(
      matrix: T,
      value: number
    ): T;

    /**
     * Takes dot product of two vectors.
     *
     * @param matrixA
     * @param matrixB
     * @example
     * jStat.dot([1, 3, -5], [4, -2, -1]);
     * // => 3
     * jStat.dot([[1,2],[2,3]], [[1,0],[0,1]]);
     * // => [1, 3]
     */
    export function dot<T extends number[] | number[][]>(
      matrixA: T,
      matrixB: T
    ): T extends number[][] ? number[] : number;

    /**
     * Raises all entries by value.
     *
     * @param matrix
     * @param value
     * @example
     * jStat.pow([1, 2, 3], 2);
     * // => [1, 4, 9]
     * jStat.pow([[1, 2], [3, 4]], 2);
     * // => [[1, 4], [9, 16]]
     */
    export function pow<T extends number[] | number[][]>(
      matrix: T,
      value: number
    ): T;

    /**
     * Exponentiates all entries.
     *
     * @param matrix
     * @example
     * jStat.exp([0, 1]);
     * // => [1, 2.718281828459045]
     * jStat.exp([[0, 1], [1, 0]]);
     * // => [[1, 2.718281828459045], [2.718281828459045, 1]]
     */
    export function exp<T extends number[] | number[][]>(matrix: T): T;

    /**
     * Returns the natural logarithm of all entries.
     *
     * @param matrix
     * @example
     * jStat.log([1, 2.718281828459045]);
     * // => [0, 1]
     * jStat.log([[1, 2.718281828459045], [2.718281828459045, 1]]);
     * // => [[0, 1], [1, 0]]
     */
    export function log<T extends number[] | number[][]>(matrix: T): T;

    /**
     * Returns the absolute values of all entries.
     *
     * @param matrix
     * @example
     * jStat.abs([1,-2,-3]);
     * // => [1, 2, 3]
     * jStat.abs([-1, 1], [2, -2]]);
     * // => [[1, 1], [2, 2]]
     */
    export function abs<T extends number[] | number[][]>(matrix: T): T;

    /**
     * Computes the norm of a vector. Note that if a matrix is passed,
     * then the first row of the matrix will be used as a vector for
     * norm().
     *
     * @param matrix
     * @example
     * jStat.norm([1,2,3])
     * // => 3.7416573867739413
     * jStat.norm([[1,2,3], [4,5,6]])
     * // => 3.7416573867739413
     */
    export function norm(matrix: number[] | number[][]): number;

    /**
     * Computes the angle between two vectors. Note that if a
     * matrix is passed, then the first row of the matrix will be
     * used as the vector for angle().
     * @example
     * jStat.angle([1, 2, 3], [2, 3, 4])
     * // => 0.12186756768575456
     */
    export function angle(vectorA: number[], vectorB: number[]): number;
  }
}
