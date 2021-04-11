declare module "jstat" {
  namespace jStat {
    export type CentralFDistribution = typeof CentralF;

    class CentralF {
      /**
       * Given x in the range [0, infinity), returns the probability
       * density of the (central) F distribution at x.
       *
       * This function corresponds to the `df(x, df1, df2)` function in R.
       * @param x Random variable
       * @example
       * jStat.centralF(5, 1).pdf(0.6);
       * // => 0.3445805577043995
       */
      pdf(x: number): number;

      /**
       * Given x in the range [0, infinity), returns the cumulative
       * probability density of the central F distribution. That is,
       * jStat.centralF(10, 20).cdf(2.5) will return the probability
       * that a number randomly selected from the central F distribution
       * with df1 = 10 and df2 = 20 will be less than 2.5.
       *
       * This function corresponds to the `pf(q, df1, df2)` function in R.
       * @param x Random variable
       * @example
       * jStat.centralF(10, 20).cdf(2.5)
       * // => 0.9610963636580113
       */
      cdf(x: number): number;

      /**
       * Given p in [0, 1), returns the value of x for which the cumulative
       * probability density of the central F distribution is p. That is,
       * `jStat.centralF(df1, df2).inv(p) = x` if and only if
       * `jStat.centralF(df1, df2).cdf(x) = p`.
       *
       * This function corresponds to the `qf(p, df1, df2)` function in R.
       * @param p P-value
       * @example
       * jStat.centralF(5, 1).inv(0.6);
       * // => 3.1952809316288433
       */
      inv(p: number): number;

      /**
       * Returns the mean of the (Central) F distribution with presets
       * `df1` and `df2`.
       *
       * Note that df2 needs to be greater than 2 or the mean will be
       * undefined
       * @example
       * jStat.centralF(5, 3).mean();
       * // => 3
       * jStat.centralF(5, 2).mean();
       * // => undefined
       */
      mean(): number | undefined;

      /**
       * Returns the mode of the (Central) F distribution with presets
       * `df1` and `df2`.
       *
       * Note that `df1` needs to be greater than 2 or the mode will be
       * undefined
       * @example
       * jStat.centralF(5, 3).mode()
       * // => 0.36
       */
      mode(): number | undefined;

      /**
       * Returns a random number whose distribution is the (Central) F
       * distribution with presets `df1` and `df2`.
       *
       * This function corresponds to the `rf(n, df1, df2)` function in R.
       * @example
       * jStat.centralF(5, 3).sample()
       * // => 0.270656809917426
       */
      sample(): number;

      /**
       * Returns the variance of the (Central) F distribution with presets
       * `df1` and `df2`.
       *
       * Note that df2 needs to be greater than 4 or the variance will be
       * undefined
       * @example
       * jStat.centralF(5, 6).variance();
       * // => 4.05
       */
      variance(): number | undefined;
    }

    export namespace centralF {
      /**
       * Given x in the range [0, infinity), returns the probability
       * density of the (central) F distribution at x.
       *
       * This function corresponds to the `df(x, df1, df2)` function in R.
       * @param x Random variable
       * @param df1 numerator degrees of freedom
       * @param df2 denominator degrees of freedom
       * @example
       * jStat.centralF.pdf(0.6, 5, 1);
       * // => 0.3445805577043995
       */
      export function pdf(x: number, df1: number, df2: number): number;

      /**
       * Given x in the range [0, infinity), returns the cumulative
       * probability density of the central F distribution. That is,
       * jStat.centralF(10, 20).cdf(2.5) will return the probability
       * that a number randomly selected from the central F distribution
       * with df1 = 10 and df2 = 20 will be less than 2.5.
       *
       * This function corresponds to the `pf(q, df1, df2)` function in R.
       * @param x Random variable
       * @param df1 numerator degrees of freedom
       * @param df2 denominator degrees of freedom
       * @example
       * jStat.centralF.cdf(3.1952, 5, 1);
       * // => 0.5999955167201906
       */
      export function cdf(x: number, df1: number, df2: number): number;

      /**
       * Given p in [0, 1), returns the value of x for which the cumulative
       * probability density of the central F distribution is p. That is,
       * `jStat.centralF.inv(p, df1, df2) = x` if and only if
       * `jStat.centralF.cdf(x, df1, df2) = p`.
       *
       * This function corresponds to the `qf(p, df1, df2)` function in R.
       * @param p P-value
       * @param df1 numerator degrees of freedom
       * @param df2 denominator degrees of freedom
       * @example
       * jStat.centralF.inv(0.6, 5, 1);
       * // => 3.1952809316288433
       */
      export function inv(p: number, df1: number, df2: number): number;

      /**
       * Returns the mean of the (Central) F distribution with parameters
       * `df1` and `df2`.
       *
       * Note that df2 needs to be greater than 2 or the mean will be
       * undefined
       * @param df1 numerator degrees of freedom
       * @param df2 denominator degrees of freedom
       * @example
       * jStat.centralF.mean(2, 3);
       * // => 3
       * jStat.centralF.mean(2, 2);
       * // => undefined
       */
      export function mean(df1: number, df2: number): number | undefined;

      /**
       * Returns the mode of the (Central) F distribution with parameters
       * `df1` and `df2`.
       *
       * Note that `df1` needs to be greater than 2 or the mode will be
       * undefined
       * @param df1 numerator degrees of freedom
       * @param df2 denominator degrees of freedom
       * @example
       * jStat.centralF.mode(5, 3);
       * // => 0.36
       * jStat.centralF.mode(2, 3);
       * // => undefined
       */
      export function mode(df1: number, df2: number): number | undefined;

      /**
       * Returns a random number whose distribution is the (Central) F distribution
       * with parameters `df1` and `df2`.
       *
       * This function corresponds to the `rf(n, df1, df2)` function in R.
       * @param df1 numerator degrees of freedom
       * @param df2 denominator degrees of freedom
       * @example
       * jStat.centralF.sample(5, 3);
       * // => 1.0358980195608107
       */
      export function sample(df1: number, df2: number): number;

      /**
       * Returns the variance of the (Central) F distribution with parameters
       * `df1` and `df2`.
       *
       * Note that `df2` needs to be greater than 4 or the variance will be
       * undefined
       * @param df1 numerator degrees of freedom
       * @param df2 denominator degrees of freedom
       * @example
       * jStat.centralF.variance(5, 4);
       * // => undefined
       * jStat.centralF.variance(5, 6);
       * // => 4.05
       */
      export function variance(df1: number, df2: number): number | undefined;
    }

    /**
     * Returns the variance of the (Central) F distribution with presets
     * `df1` and `df2`.
     * @param df1 numerator degrees of freedom
     * @param df2 denominator degrees of freedom
     */
    export function centralF(df1: number, df2: number): CentralF;
  }
}
