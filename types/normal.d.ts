declare module "jstat" {
  export type NormalDistribution = typeof Normal;

  class Normal {
    /**
     * Returns the value of x in the pdf of the Normal distribution with
     * preset `mean` and `std` (standard deviation).
     * @param x Random variable
     */
    pdf(x: number): number;

    /**
     * Returns the value of x in the cdf of the Normal distribution with
     * preset `mean` and `std` (standard deviation).
     * @param x Random variable
     */
    cdf(x: number): number;

    /**
     * Returns the value of p in the inverse cdf for the Normal distribution with
     * preset `mean` and `std` (standard deviation).
     * @param p P-value
     */
    inv(p: number): number;

    /**
     * Returns the value of the mean for the Normal distribution with
     * preset `mean` and `std` (standard deviation).
     */
    mean(): number;

    /**
     * Returns the value of the median for the Normal distribution with
     * preset `mean` and `std` (standard deviation).
     */
    median(): number;

    /**
     * Returns the value of the median for the Normal distribution with
     * preset `mean` and `std` (standard deviation).
     */
    mode(): number;

    /**
     * Returns a random number whose distribution is the Normal distribution
     * with preset `mean` and `std` (standard deviation).
     */
    sample(): number;

    /**
     * Returns the value of the variance for the Normal distribution with
     * preset `mean` and `std` (standard deviation).
     */
    variance(): number;
  }

  export namespace normal {
    /**
     * Returns the value of x in the pdf of the Normal distribution with
     * parameters `mean` and `std` (standard deviation).
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
     * Returns the value of the variance for the Normal distribution
     * with parameters mean and std (standard deviation).
     * @param mean Normal distribution's mean
     * @param std Standard deviation
     */
    export function variance(mean: number, std: number): number;
  }

  /**
   * Return a jStat normal distribution instance preset with mean and std
   * @param mean Normal distribution's mean
   * @param std standard deviation
   */
  export function normal(mean: number, std: number): Normal;
}
