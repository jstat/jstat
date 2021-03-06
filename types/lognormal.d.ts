declare module "jstat" {
  namespace jStat {
    export type LogNormalDistribution = typeof LogNormal;

    class LogNormal {
      /**
       * Returns the value of x in the pdf (Probability density function) of
       * the Log-normal distribution with preset `mu` (mean) and `sigma`
       * (standard deviation).
       * @param x Random variable
       * @example
       * jStat.lognormal(0, 1).pdf(0.6);
       * // => 0.583573822594504
       */
      pdf(x: number): number;

      /**
       * Returns the value of x in the cdf (Cumulative distribution function)
       * of the Log-normal distribution with preset `mu` (mean) and `sigma`
       * (standard deviation).
       * @param x Random variable
       * @example
       * jStat.lognormal(0, 1).cdf(0.6);
       * // => 0.3047365825102317
       */
      cdf(x: number): number;

      /**
       * Returns the value of p in the inverse cdf for the Log-normal distribution
       * with preset `mu` (mean) and `sigma` (standard deviation).
       * @param p P-value
       * @example
       * jStat.lognormal(0, 1).inv(0.6);
       * // => 1.2883303827500079
       */
      inv(p: number): number;

      /**
       * Returns the value of the mu for the Log-normal distribution with
       * preset `mu` (mean) and `sigma` (standard deviation).
       * @example
       * jStat.lognormal(0, 1).mean();
       * // => 1.6487212707001282
       */
      mean(): number;

      /**
       * Returns the value of the median for the Log-normal distribution with
       * preset `mu` (mean) and `sigma` (standard deviation).
       * @example
       * jStat.lognormal(0, 1).median();
       * // => 1
       */
      median(): number;

      /**
       * Returns the value of the median for the Log-normal distribution with
       * preset `mu` (mean) and `sigma` (standard deviation).
       * @example
       * jStat.lognormal(0, 1).mode();
       * // => 0.36787944117144233
       */
      mode(): number;

      /**
       * Returns a random number whose distribution is the Log-normal distribution
       * with preset `mu` (mean) and `sigma` (standard deviation).
       * @example
       * jStat.lognormal(0, 1).sample();
       * // => -0.6672713549413156
       */
      sample(): number;

      /**
       * Returns the value of the variance for the Log-normal distribution with
       * preset `mu` (mean) and `sigma` (standard deviation).
       * @example
       * jStat.lognormal(0, 1).variance();
       * // => 2.673446090431473
       */
      variance(): number;
    }

    export namespace lognormal {
      /**
       * Returns the value of x in the pdf of the Log-normal distribution with
       * parameters `mu` (mean) and `sigma` (standard deviation).
       * @param x Random variable
       * @param mu mean of the Normal Distributon
       * @param sigma standard deviation of the Normal Distributon
       * @example
       * jStat.lognormal.pdf(0.6, 0, 1);
       * // => 0.583573822594504
       */
      export function pdf(x: number, mu: number, sigma: number): number;

      /**
       * Returns the value of x in the cdf of the Log-normal distribution with
       * parameters `mu` (mean) and `sigma` (standard deviation).
       * @param x Random variable
       * @param mu mean of the Normal Distributon
       * @param sigma standard deviation of the Normal Distributon
       * @example
       * jStat.lognormal.cdf(0.6, 0, 1);
       * // => 0.3047365825102317
       */
      export function cdf(x: number, mu: number, sigma: number): number;

      /**
       * Returns the value of p in the inverse cdf for the Log-normal distribution with
       * parameters `mu` (mean) and `sigma` (standard deviation).
       * @param p P-value
       * @param mu mean of the Normal Distributon
       * @param sigma standard deviation of the Normal Distributon
       * @example
       * jStat.lognormal.inv(0.6, 0, 1);
       * // => 1.2883303827500079
       */
      export function inv(p: number, mu: number, sigma: number): number;

      /**
       * Returns the value of the mu for the Log-normal distribution with
       * parameters `mu` (mean) and `sigma` (standard deviation).
       * @param mu mean of the Normal Distributon
       * @param sigma standard deviation of the Normal Distributon
       * @example
       * jStat.lognormal.mean(0, 1);
       * // => 1.6487212707001282
       */
      export function mean(mu: number, sigma: number): number;

      /**
       * Returns the value of the median for the Log-normal distribution with
       * parameters `mu` (mean) and `sigma` (standard deviation).
       * @param mu mean of the Normal Distributon
       * @param sigma standard deviation of the Normal Distributon
       * @example
       * jStat.lognormal.median(0, 1);
       * // => 1
       */
      export function median(mu: number, sigma: number): number;

      /**
       * Returns the value of the median for the Log-normal distribution with
       * parameters `mu` (mean) and `sigma` (standard deviation).
       * @param mu mean of the Normal Distributon
       * @param sigma standard deviation of the Normal Distributon
       * @example
       * jStat.lognormal.mode(0, 1);
       * // => 0.36787944117144233
       */
      export function mode(mu: number, sigma: number): number;

      /**
       * Returns a random number whose distribution is the Log-normal distribution
       * with parameters `mu` (mean) and `sigma` (standard deviation).
       * @param mu mean of the Normal Distributon
       * @param sigma standard deviation of the Normal Distributon
       * @example
       * jStat.lognormal.sample(0, 1);
       * // => 2.7327088083005
       */
      export function sample(mu: number, sigma: number): number;

      /**
       * Returns the value of the variance for the Log-normal distribution
       * with parameters `mu` (mean) and `sigma` (standard deviation).
       * @param mu mean of the Normal Distributon
       * @param sigma standard deviation of the Normal Distributon
       * @example
       * jStat.lognormal.variance(0, 1);
       * // => 4.670774270471604
       */
      export function variance(mu: number, sigma: number): number;
    }

    /**
     * Return a jStat Log-normal distribution instance preset with
     * `mu` (mean) and `sigma` (standard deviation)
     * @param mu mean of the Normal Distributon
     * @param sigma standard deviation of the Normal Distributon
     */
    export function lognormal(mu: number, sigma: number): LogNormal;
  }
}
