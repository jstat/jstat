declare module "jstat" {
  namespace jStat {
    /**
     * Adds value to all entries.
     * @param matrix
     * @param value
     * @example
     * jStat.add([1,2,3], 2);
     * // => [3, 4, 5]
     * jStat.add([[1, 2], [3, 4]], 2);
     * // => [[3, 4], [5, 6]]
     */
    export function add<T extends number[] | number[][]>(
      matrix: T,
      value: number
    ): T;
  }
}
