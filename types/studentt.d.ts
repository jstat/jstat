declare module "jstat" {
  class Studentt {
    /**
     * Returns the value of x in the pdf of the Student's T distribution with
     * preset dof degrees of freedom.
     * @param x Random variable
     */
    pdf: (x: number) => number;

    /**
     * Returns the value of x in the cdf of the Student's T distribution with
     * dof degrees of freedom.
     * @param x Random variable
     */
    cdf: (x: number) => number;

    /**
     * Returns the value of p in the inverse of the cdf for the Student's
     * T distribution with dof degrees of freedom.
     * @param p P-value
     */
    inv: (p: number) => number;

    /**
     * Returns the value of the mean of the Student's T distribution
     * with dof degrees of freedom.
     */
    mean: () => number;

    /**
     * Returns the value of the median of the Student's T distribution
     * with dof degrees of freedom.
     */
    median: () => number;

    /**
     * Returns the value of the mode of the Student's T distribution with
     * dof degrees of freedom.
     */
    mode: () => number;

    /**
     * Returns a random number whose distribution is the Student's
     * T distribution with dof degrees of freedom.
     */
    sample: () => number;

    /**
     * Returns the value of the variance for the Student's T distribution
     * with dof degrees of freedom.
     */
    variance: () => number;
  }

  export namespace studentt {
    /**
     * Returns the value of x in the pdf of the Student's T distribution with
     * dof degrees of freedom.
     * @param x Random variable
     * @param dof Degrees of freedom
     */
    export function pdf(x: number, dof: number): number;

    /**
     * Returns the value of x in the cdf of the Student's T distribution with
     * dof degrees of freedom.
     * @param x Random variable
     * @param dof Degrees of freedom
     */
    export function cdf(x: number, dof: number): number;

    /**
     * Returns the value of p in the inverse of the cdf for the Student's
     * T distribution with dof degrees of freedom.
     * @param p P-value
     * @param dof Degrees of freedom
     */
    export function inv(p: number, dof: number): number;

    /**
     * Returns the value of the mean of the Student's T distribution
     * with dof degrees of freedom.
     * @param dof Degrees of freedom
     */
    export function mean(dof: number): number;

    /**
     * Returns the value of the median of the Student's T distribution
     * with dof degrees of freedom.
     * @param dof Degrees of freedom
     */
    export function median(dof: number): number;

    /**
     * Returns the value of the mode of the Student's T distribution
     * with dof degrees of freedom.
     * @param dof Degrees of freedom
     */
    export function mode(dof: number): number;

    /**
     * Returns a random number whose distribution is the Student's
     * T distribution with dof degrees of freedom.
     * @param dof Degrees of freedom
     */
    export function sample(dof: number): number;

    /**
     * Returns the value of the variance for the Student's T
     * distribution with dof degrees of freedom.
     * @param dof Degrees of freedom
     */
    export function variance(dof: number): number;
  }

  /**
   * Return a jStat studentt distribution instance preset with `dof`
   * degrees of freedom
   * @param dof Degrees of freedom
   */
  export function studentt(dof: number): Studentt;
}
