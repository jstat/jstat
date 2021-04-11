declare module "jstat" {
  namespace jStat {
    export type NormalDistribution = typeof Normal;

    class Normal {
      /**
       * Returns the value of x in the pdf (Probability density function) of
       * the Normal distribution with preset `mean` and `std`
       * (standard deviation).
       * @param x Random variable
       * @example
       * jStat.normal(0, 1).pdf(0.6);
       * // => 0.33322460289179967
       */
      pdf(x: number): number;

      /**
       * Returns the value of x in the cdf (Cumulative distribution function)
       * of the Normal distribution with preset `mean` and `std`
       * (standard deviation).
       * @param x Random variable
       * @example
       * jStat.normal(0, 1).cdf(0.6);
       * // => 0.7257468822499265
       */
      cdf(x: number): number;

      /**
       * Returns the value of p in the inverse cdf for the Normal distribution
       * with preset `mean` and `std` (standard deviation).
       * @param p P-value
       * @example
       * jStat.normal(0, 1).inv(0.6);
       * // => 0.25334710313580006
       */
      inv(p: number): number;

      /**
       * Returns the value of the mean for the Normal distribution with
       * preset `mean` and `std` (standard deviation).
       * @example
       * jStat.normal(0, 1).mean();
       * // => 0
       */
      mean(): number;

      /**
       * Returns the value of the median for the Normal distribution with
       * preset `mean` and `std` (standard deviation).
       * @example
       * jStat.normal(0, 1).median();
       * // => 0
       */
      median(): number;

      /**
       * Returns the value of the median for the Normal distribution with
       * preset `mean` and `std` (standard deviation).
       * @example
       * jStat.normal(0, 1).mode();
       * // => 0
       */
      mode(): number;

      /**
       * Returns a random number whose distribution is the Normal distribution
       * with preset `mean` and `std` (standard deviation).
       * @example
       * jStat.normal(0, 1).sample();
       * // => -0.6672713549413156
       */
      sample(): number;

      /**
       * Returns the value of the variance for the Normal distribution with
       * preset `mean` and `std` (standard deviation).
       * @example
       * jStat.normal(0, 1).variance();
       * // => 1
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
       * @example
       * jStat.normal.pdf(0.6, 0, 1);
       * // => 0.33322460289179967
       */
      export function pdf(x: number, mean: number, std: number): number;

      /**
       * Returns the value of x in the cdf of the Normal distribution with
       * parameters `mean` and `std` (standard deviation).
       * @param x Random variable
       * @param mean Normal distribution's mean
       * @param std Standard deviation
       * @example
       * jStat.normal.cdf(0.6, 0, 1);
       * // => 0.7257468822499265
       */
      export function cdf(x: number, mean: number, std: number): number;

      /**
       * Returns the value of p in the inverse cdf for the Normal distribution with
       * parameters mean and std (standard deviation).
       * @param p P-value
       * @param mean Normal distribution's mean
       * @param std Standard deviation
       * @example
       * jStat.normal.inv(0.6, 0, 1);
       * // => 0.25334710313580006
       */
      export function inv(p: number, mean: number, std: number): number;

      /**
       * Returns the value of the mean for the Normal distribution with
       * parameters mean and std (standard deviation).
       * @param mean Normal distribution's mean
       * @param std Standard deviation
       * @example
       * jStat.normal.mean(0, 1);
       * // => 0
       */
      export function mean(mean: number, std: number): number;

      /**
       * Returns the value of the median for the Normal distribution with
       * parameters mean and std (standard deviation).
       * @param mean Normal distribution's mean
       * @param std Standard deviation
       * @example
       * jStat.normal.median(0, 1);
       * // => 0
       */
      export function median(mean: number, std: number): number;

      /**
       * Returns the value of the median for the Normal distribution with
       * parameters mean and std (standard deviation).
       * @param mean Normal distribution's mean
       * @param std Standard deviation
       * @example
       * jStat.normal.mode(0, 1);
       * // => 0
       */
      export function mode(mean: number, std: number): number;

      /**
       * Returns a random number whose distribution is the Normal distribution
       * with parameters `mean` and `std` (standard deviation).
       * @param mean Normal distribution's mean
       * @param std Standard deviation
       * @example
       * jStat.normal.sample(0, 1);
       * // => -1.665022687218225
       */
      export function sample(mean: number, std: number): number;

      /**
       * Returns the value of the variance for the Normal distribution
       * with parameters mean and std (standard deviation).
       * @param mean Normal distribution's mean
       * @param std Standard deviation
       * @example
       * jStat.normal.variance(0, 1);
       * // => 1
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
}
