declare module "jstat" {
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
}
