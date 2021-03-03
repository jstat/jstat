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
  }
}
