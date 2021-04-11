declare module "jstat" {
  namespace jStat {
    export type BetaDistribution = typeof Beta;

    class Beta {
      /**
       * Returns the value of x in the pdf for the Beta distribution with
       * presets `alpha` and `beta`.
       * @param x Random variable
       * @example
       * jStat.beta(5, 1).pdf(0.6);
       * // => 0.6479999999999999
       */
      pdf(x: number): number;

      /**
       * Returns the value of x in the cdf for the Beta distribution
       * with presets `alpha` and `beta`.
       * @param x Random variable
       * @example
       * jStat.beta(5, 1).cdf(0.6);
       * // => 0.07775999999999987
       */
      cdf(x: number): number;

      /**
       * Returns the value of p in the inverse of the cdf for the
       * Beta distribution with presets `alpha` and `beta`.
       * @param p P-value
       * @example
       * jStat.beta(5, 1).inv(0.6);
       * // => 0.9028804514421913
       */
      inv(p: number): number;

      /**
       * Returns the mean of the Beta distribution with presets
       * `alpha` and `beta`.
       * @example
       * jStat.beta(5, 1).mean();
       * // => 0.8333333333333334
       */
      mean(): number;

      /**
       * Returns the median of the Beta distribution with presets
       * `alpha` and `beta`.
       * @example
       * jStat.beta(5, 1).median();
       * // => 0.8705505632010804
       */
      median(): number;

      /**
       * Returns the mode of the Beta distribution with presets
       * `alpha` and `beta`.
       * @example
       * jStat.beta(5, 1).mode();
       * // => 1
       */
      mode(): number;

      /**
       * Returns a random number whose distribution is the Beta distribution
       * with presets `alpha` and `beta`.
       * @example
       * jStat.beta(5, 1).sample();
       * // => 0.7183692182125007
       */
      sample(): number;

      /**
       * Returns the variance of the Beta distribution with presets
       * `alpha` and `beta`.
       * @example
       * jStat.beta(5, 1).variance();
       * // => 0.01984126984126984
       */
      variance(): number;
    }

    export namespace beta {
      /**
       * Returns the value of `x` in the pdf for the Beta distribution with
       * parameters `alpha` and `beta`.
       * @param x Random variable
       * @param alpha 1st shape parameter of the probability distribution
       * @param beta 2nd shape parameter of the probability distribution
       * @example
       * jStat.beta.pdf(0.6, 5, 1);
       * // => 0.6479999999999999
       */
      export function pdf(x: number, alpha: number, beta: number): number;

      /**
       * Returns the value of `x` in the cdf for the Beta distribution
       * with parameters `alpha` and `beta`.
       * @param x Random variable
       * @param alpha 1st shape parameter of the probability distribution
       * @param beta 2nd shape parameter of the probability distribution
       * @example
       * jStat.beta.cdf(0.6, 5, 1);
       * // => 0.07775999999999987
       */
      export function cdf(x: number, alpha: number, beta: number): number;

      /**
       * Returns the value of `p` in the inverse of the cdf for the
       * Beta distribution with parameters `alpha` and `beta`.
       * @param p P-value
       * @param alpha 1st shape parameter of the probability distribution
       * @param beta 2nd shape parameter of the probability distribution
       * @example
       * jStat.beta.inv(0.6, 5, 1);
       * // => 0.9028804514421913
       */
      export function inv(p: number, alpha: number, beta: number): number;

      /**
       * Returns the mean of the Beta distribution with parameters
       * `alpha` and `beta`.
       * @param alpha 1st shape parameter of the probability distribution
       * @param beta 2nd shape parameter of the probability distribution
       * @example
       * jStat.beta.mean(5, 1);
       * // => 0.8333333333333334
       */
      export function mean(alpha: number, beta: number): number;

      /**
       * Returns the median of the Beta distribution with parameters
       * `alpha` and `beta`.
       * @param alpha 1st shape parameter of the probability distribution
       * @param beta 2nd shape parameter of the probability distribution
       * @example
       * jStat.beta.median(5, 1);
       * // => 0.8705505632010804
       */
      export function median(alpha: number, beta: number): number;

      /**
       * Returns the mode of the Beta distribution with parameters
       * `alpha` and `beta`.
       * @param alpha 1st shape parameter of the probability distribution
       * @param beta 2nd shape parameter of the probability distribution
       * @example
       * jStat.beta.mode(5, 1);
       * // => 1
       */
      export function mode(alpha: number, beta: number): number;

      /**
       * Returns a random number whose distribution is the Beta distribution
       * with parameters `alpha` and `beta`.
       * @param alpha 1st shape parameter of the probability distribution
       * @param beta 2nd shape parameter of the probability distribution
       * @example
       * jStat.beta.sample(5, 1);
       * // => 0.5667196428334971
       */
      export function sample(alpha: number, beta: number): number;

      /**
       * Returns the variance of the Beta distribution with parameters
       * `alpha` and `beta`.
       * @param alpha 1st shape parameter of the probability distribution
       * @param beta 2nd shape parameter of the probability distribution
       * @example
       * jStat.beta.variance(5, 1);
       * // => 0.01984126984126984
       */
      export function variance(alpha: number, beta: number): number;
    }

    /**
     * Return a jStat beta probability distribution instance preset with
     * `alpha` and `beta` shape parameters (positive)
     * @param alpha 1st shape parameter of the probability distribution
     * @param beta 2nd shape parameter of the probability distribution
     */
    export function beta(alpha: number, beta: number): Beta;
  }
}
