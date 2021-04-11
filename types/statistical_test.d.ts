declare module "jstat" {
  namespace jStat {
    /**
     * Returns the z-score of value given a sample.
     * isSample = true denotes use of sample standard deviation.
     * @param x
     * @param sample
     * @param isSample
     */
    export function zscore(
      x: number,
      sample: number[],
      isSample?: boolean
    ): number;

    /**
     * Returns the z-score of value given the mean and a standard deviation.
     * @param x
     * @param mean
     * @param stdev standard deviation
     */
    export function zscore(x: number, mean: number, stdev: number): number;

    /**
     * Performs the full Tukey's range test returning p-values for every
     * pairwise combination of the arrays in the format of
     * `[[[index1, index2], pvalue], ...]`
     * @param arrays population samples
     * @example
     * import { jStat } from "jstat";
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
    export type TukeyHSD = [[number, number], number];

    export function anovaftest(...args: number[][]): number;
    export function anovafscore(...args: number[][]): number;
    export function anovafscore(args: number[][]): number;

    /**
     * Returns the p-value of a the z-test of value given the `mean`
     * and `stdev` (standard deviation) of the test.
     *
     * sides is an integer value 1 or 2 denoting a one or two
     * sided z-test.
     *
     * If sides is not specified the test defaults to a two
     * sided z-test.
     * @param x
     * @param mean
     * @param stdev standard deviation
     * @param sides either 1 or 2 (for 2 sided z-test)
     * @example
     * jStat.ztest(1.5, 0, 1)
     * // => 0.13361440253771617
     * jStat.ztest(1.5, 0, 1, 1)
     * // => 0.06680720126885809
     */
    export function ztest(
      x: number,
      mean: number,
      stdev: number,
      sides?: 1 | 2
    ): number;

    /**
     * Returns the p-value of value taking the jStat object as
     * the observed values. sides is an integer value 1 or 2
     * denoting a 1 or 2 sided z-test.
     *
     * The test defaults to a 2 sided z-test if sides is not
     * specified. flag===true denotes use of sample standard
     * deviation.
     * @param value
     * @param sample
     * @param sides
     * @param flag
     * @example
     * jStat.ztest(4, [1,2,3,4,5,6,7], 1)
     * // => 0.5
     * jStat.ztest(5, [1,2,3,4,5,6], 2)
     * // => 0.379775474840949
     * jStat.ztest(5, [1,2,3,4,5,6], 1)
     * // => 0.1898877374204745
     * jStat.ztest(5, [1,2,3,4,5,6], 1, 1)
     * // => 0.21133903708531765
     */
    export function ztest(
      value: number,
      sample: number[],
      sides?: 1 | 2,
      flag?: boolean
    ): number;

    /**
     * Returns the p-value of the z-score. sides is an
     * integer value 1 or 2 denoting a one or two sided z-test.
     *
     * If sides is not specified the test defaults to a two sided
     * z-test
     * @param zscore
     * @param sides either 1 or 2 (2 for two sided z-test)
     */
    export function ztest(zscore: number, sides?: 1 | 2): number;
  }
}
