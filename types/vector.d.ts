declare module "jstat" {
  namespace jStat {
    /**
     * Returns the sum of the array vector.
     * @param vector
     * @example
     * jStat.sum([1,2,3]);
     * // => 6
     */
    export function sum(vector: number[]): number;

    /**
     * Returns the sum squared of the array vector.
     * @param vector
     * @example
     * jStat.sumsqrd([1,2,3]);
     * // => 14
     */
    export function sumsqrd(vector: number[]): number;

    /**
     * Returns the sum of squared errors of the array vector.
     * @param vector
     * @example
     * jStat.sumsqerr([1,2,3]);
     * // => 2
     */
    export function sumsqerr(vector: number[]): number;

    /**
     * Returns the sum of the array vector in row-based order.
     * @param vector
     * @example
     * jStat.sumrow([1, 2, 3, 4]);
     * // => 10
     */
    export function sumrow(vector: number[]): number;

    /**
     * Returns the product of the array vector.
     * @param vector
     * @example
     * jStat.product([1, 2, 3, 4]);
     * // => 24
     */
    export function product(vector: number[]): number;

    /**
     * Returns the minimum value of the array vector.
     * @param vector
     * @example
     * jStat.min([1,2,3]);
     * // => 1
     */
    export function min(vector: number[]): number;

    /**
     * Returns the maximum value of the array vector.
     * @param vector
     * @example
     * jStat.max([1,2,3]);
     * // => 3
     */
    export function max(vector: number[]): number;

    /**
     * Returns the variance of the array vector. By default, the population
     * variance is calculated. Passing true to flag indicates to compute the
     * sample variance instead.
     * @param arr
     * @param flag
     * @example
     * import { jStat } from "jstat";
     *
     * jStat.variance([1,2,3,4]) === 1.25
     * jStat.variance([1,2,3,4],true) === 1.66666...
     */
    export function variance(arr: number[], flag?: boolean): number;

    export function stdev(arr: number[], isSample?: boolean): number;
    export function spearmancoeff(arr1: number[], arr2: number[]): number;
    export function corrcoeff(arr1: number[], arr2: number[]): number;

    /**
     * Returns the quartiles for a vector or matrix columns.
     * @param vector
     * @example
     * jStat.quartiles([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
     * // => [3, 5, 8]
     */
    export function quartiles(vector: number[]): [number, number, number];

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
     * @param vector
     * @param quantiles List of quantiles to compute
     * @param alphap Plotting positions parameter (default to 3/8)
     * @param betap Plotting positions parameter (default to 3/8)
     * @example
     * jStat.quantiles([1, 2, 3, 4, 5, 6],[0.25, 0.5, 0.75])
     * // => [1.9375, 3.5, 5.0625]
     */
    export function quantiles(
      vector: number[],
      quantiles: number[],
      alphap?: number,
      betap?: number
    ): number[];

    /**
     * Returns the median of the array vector.
     *
     * @param vector
     * @example
     * jStat.median([1,2,3])
     * // => 2
     *
     */
    export function median(vector: number[]): number;
  }
}
