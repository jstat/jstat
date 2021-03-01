declare module "jstat" {
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

  namespace normal {
    /**
     * Returns the value of x in the pdf of the Normal distribution with
     * parameters mean and std (standard deviation).
     * @param x Random variable
     * @param mean Normal distribution's mean
     * @param std standard deviation
     */
    export function pdf(x: number, mean: number, std: number): number;

    /**
     * Returns the value of x in the cdf of the Normal distribution with
     * parameters `mean` and `std` (standard deviation).
     * @param x Random variable
     * @param mean Normal distribution's mean
     * @param std Standard deviation
     */
    export function cdf(x: number, mean: number, std: number): number;

    /**
     * Returns the value of p in the inverse cdf for the Normal distribution with
     * parameters mean and std (standard deviation).
     * @param p P-value
     * @param mean Normal distribution's mean
     * @param std Standard deviation
     */
    export function inv(p: number, mean: number, std: number): number;

    /**
     * Returns the value of the mean for the Normal distribution with
     * parameters mean and std (standard deviation).
     * @param mean Normal distribution's mean
     * @param std Standard deviation
     */
    export function mean(mean: number, std: number): number;

    /**
     * Returns the value of the median for the Normal distribution with
     * parameters mean and std (standard deviation).
     * @param mean Normal distribution's mean
     * @param std Standard deviation
     */
    export function median(mean: number, std: number): number;

    /**
     * Returns the value of the median for the Normal distribution with
     * parameters mean and std (standard deviation).
     * @param mean Normal distribution's mean
     * @param std Standard deviation
     */
    export function mode(mean: number, std: number): number;

    /**
     * Returns a random number whose distribution is the Normal distribution
     * with parameters `mean` and `std` (standard deviation).
     * @param mean Normal distribution's mean
     * @param std Standard deviation
     */
    export function sample(mean: number, std: number): number;

    /**
     * Returns the value of the variance for the Normal distribution with parameters mean and std (standard deviation).
     * @param mean Normal distribution's mean
     * @param std Standard deviation
     */
    export function variance(mean: number, std: number): number;
  }
}
