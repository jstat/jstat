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
     * @param std
     */
    export function zscore(x: number, mean: number, std: number): number;

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
  }
}
