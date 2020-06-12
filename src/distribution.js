var jStat = require( './core.js' );

// generate all distribution instance methods
(function(list) {
  for (var i = 0; i < list.length; i++) (function(func) {
    // distribution instance method
    jStat[func] = function(a, b, c) {
      if (!(this instanceof arguments.callee))
        return new arguments.callee(a, b, c);
      this._a = a;
      this._b = b;
      this._c = c;
      return this;
    };
    // distribution method to be used on a jStat instance
    jStat.fn[func] = function(a, b, c) {
      var newthis = jStat[func](a, b, c);
      newthis.data = this;
      return newthis;
    };
    // sample instance method
    jStat[func].prototype.sample = function(arr) {
      var a = this._a;
      var b = this._b;
      var c = this._c;
      if (arr)
        return jStat.alter(arr, function() {
          return jStat[func].sample(a, b, c);
        });
      else
        return jStat[func].sample(a, b, c);
    };
    // generate the pdf, cdf and inv instance methods
    (function(vals) {
      for (var i = 0; i < vals.length; i++) (function(fnfunc) {
        jStat[func].prototype[fnfunc] = function(x) {
          var a = this._a;
          var b = this._b;
          var c = this._c;
          if (!x && x !== 0)
            x = this.data;
          if (typeof x !== 'number') {
            return jStat.fn.map.call(x, function(x) {
              return jStat[func][fnfunc](x, a, b, c);
            });
          }
          return jStat[func][fnfunc](x, a, b, c);
        };
      })(vals[i]);
    })('pdf cdf inv'.split(' '));
    // generate the mean, median, mode and variance instance methods
    (function(vals) {
      for (var i = 0; i < vals.length; i++) (function(fnfunc) {
        jStat[func].prototype[fnfunc] = function() {
          return jStat[func][fnfunc](this._a, this._b, this._c);
        };
      })(vals[i]);
    })('mean median mode variance'.split(' '));
  })(list[i]);
})((
  'beta centralF cauchy chisquare exponential gamma invgamma kumaraswamy ' +
  'laplace lognormal noncentralt normal pareto studentt weibull uniform ' +
  'binomial negbin hypgeom poisson triangular tukey arcsine'
).split(' '));

var betaPDF = require( '@stdlib/stats/base/dists/beta/pdf' );
var betaCDF = require( '@stdlib/stats/base/dists/beta/cdf' );
var betaQuantile = require( '@stdlib/stats/base/dists/beta/quantile' );
var betaMean = require( '@stdlib/stats/base/dists/beta/mean' );
var betaMedian = require( '@stdlib/stats/base/dists/beta/median' );
var betaMode = require( '@stdlib/stats/base/dists/beta/mode' );
var betaSample = require( '@stdlib/random/base/beta' );
var betaVariance = require( '@stdlib/stats/base/dists/beta/variance' );

// extend beta function with static methods
jStat.extend(jStat.beta, {
  pdf: betaPDF,
  cdf: betaCDF,
  inv: betaQuantile,
  mean: betaMean,
  median: betaMedian,
  mode: betaMode,
  sample: betaSample,
  variance: betaVariance
});

var fPDF = require( '@stdlib/stats/base/dists/f/pdf' );
var fCDF = require( '@stdlib/stats/base/dists/f/cdf' );
var fQuantile = require( '@stdlib/stats/base/dists/f/quantile' );
var fMean = require( '@stdlib/stats/base/dists/f/mean' );
var fMode = require( '@stdlib/stats/base/dists/f/mode' );
var fSample = require( '@stdlib/random/base/f' );
var fVariance = require( '@stdlib/stats/base/dists/f/variance' );

// extend F function with static methods
jStat.extend(jStat.centralF, {
  pdf: fPDF,
  cdf: fCDF,
  inv: fQuantile,
  mean: fMean,
  mode: fMode,
  sample: fSample,
  variance: fVariance
});

var cauchyPDF = require( '@stdlib/stats/base/dists/cauchy/pdf' );
var cauchyCDF = require( '@stdlib/stats/base/dists/cauchy/cdf' );
var cauchyQuantile = require( '@stdlib/stats/base/dists/cauchy/quantile' );
var cauchyMedian = require( '@stdlib/stats/base/dists/cauchy/median' );
var cauchyMode = require( '@stdlib/stats/base/dists/cauchy/mode' );
var cauchySample = require( '@stdlib/random/base/cauchy' );

// extend cauchy function with static methods
jStat.extend(jStat.cauchy, {
  pdf: cauchyPDF,
  cdf: cauchyCDF,
  inv: cauchyQuantile,
  median: cauchyMedian,
  mode: cauchyMode,
  sample: cauchySample
});

var chisquarePDF = require( '@stdlib/stats/base/dists/chisquare/pdf' );
var chisquareCDF = require( '@stdlib/stats/base/dists/chisquare/cdf' );
var chisquareQuantile = require( '@stdlib/stats/base/dists/chisquare/quantile' );
var chisquareMean = require( '@stdlib/stats/base/dists/chisquare/mean' );
var chisquareMode = require( '@stdlib/stats/base/dists/chisquare/mode' );
var chisquareSample = require( '@stdlib/random/base/chisquare' );
var chisquareVariance = require( '@stdlib/stats/base/dists/chisquare/variance' );

// extend chisquare function with static methods
jStat.extend(jStat.chisquare, {
  pdf: chisquarePDF,
  cdf: chisquareCDF,
  inv: chisquareQuantile,
  mean : chisquareMean,

  // TODO: this is an approximation (is there a better way?)
  median: function median(dof) {
    return dof * Math.pow(1 - (2 / (9 * dof)), 3);
  },

  mode: chisquareMode,
  sample: chisquareSample,
  variance: chisquareVariance
});

var expPDF = require( '@stdlib/stats/base/dists/exponential/pdf' );
var expCDF = require( '@stdlib/stats/base/dists/exponential/cdf' );
var expQuantile = require( '@stdlib/stats/base/dists/exponential/quantile' );
var expMean = require( '@stdlib/stats/base/dists/exponential/mean' );
var expMedian = require( '@stdlib/stats/base/dists/exponential/median' );
var expMode = require( '@stdlib/stats/base/dists/exponential/mode' );
var expSample = require( '@stdlib/random/base/exponential' );
var expVariance = require( '@stdlib/stats/base/dists/exponential/variance' );

// extend exponential function with static methods
jStat.extend(jStat.exponential, {
  pdf: expPDF,
  cdf: expCDF,
  inv: expQuantile,
  mean : expMean,
  median: expMedian,
  mode: expMode,
  sample: expSample,
  variance : expVariance
});

var gammaPDF = require( '@stdlib/stats/base/dists/gamma/pdf' );
var gammaCDF = require( '@stdlib/stats/base/dists/gamma/cdf' );
var gammaQuantile = require( '@stdlib/stats/base/dists/gamma/quantile' );
var gammaMean = require( '@stdlib/stats/base/dists/gamma/mean' );
var gammaMode = require( '@stdlib/stats/base/dists/gamma/mode' );
var gammaSample = require( '@stdlib/random/base/gamma' );
var gammaVariance = require( '@stdlib/stats/base/dists/gamma/variance' );

// extend gamma function with static methods
jStat.extend(jStat.gamma, {
  pdf: function pdf(x, shape, scale) {
    return gammaPDF(x, shape, 1.0/scale);
  },
  cdf: function cdf(x, shape, scale) {
    return gammaCDF(x, shape, 1.0/scale);
  },
  inv: function inv(x, shape, scale) {
    return gammaQuantile(x, shape, 1.0/scale);
  },
  mean : function mean(x, shape, scale) {
    return gammaMean(x, shape, 1.0/scale);
  },
  mode: function mode(x, shape, scale) {
    return gammaMode(x, shape, 1.0/scale);
  },
  sample: function sample(x, shape, scale) {
    return gammaSample(x, shape, 1.0/scale);
  },
  variance: function variance(x, shape, scale) {
    return gammaVariance(x, shape, 1.0/scale);
  }
});

var invgammaPDF = require( '@stdlib/stats/base/dists/invgamma/pdf' );
var invgammaCDF = require( '@stdlib/stats/base/dists/invgamma/cdf' );
var invgammaQuantile = require( '@stdlib/stats/base/dists/invgamma/quantile' );
var invgammaMean = require( '@stdlib/stats/base/dists/invgamma/mean' );
var invgammaMode = require( '@stdlib/stats/base/dists/invgamma/mode' );
var invgammaSample = require( '@stdlib/random/base/invgamma' );
var invgammaVariance = require( '@stdlib/stats/base/dists/invgamma/variance' );

// extend inverse gamma function with static methods
jStat.extend(jStat.invgamma, {
  pdf: invgammaPDF,
  cdf: invgammaCDF,
  inv: invgammaQuantile,
  mean: invgammaMean,
  mode: invgammaMode,
  sample: invgammaSample,
  variance: invgammaVariance
});

var kumaraswamyPDF = require( '@stdlib/stats/base/dists/kumaraswamy/pdf' );
var kumaraswamyCDF = require( '@stdlib/stats/base/dists/kumaraswamy/cdf' );
var kumaraswamyQuantile = require( '@stdlib/stats/base/dists/kumaraswamy/quantile' );
var kumaraswamyMean = require( '@stdlib/stats/base/dists/kumaraswamy/mean' );
var kumaraswamyMedian = require( '@stdlib/stats/base/dists/kumaraswamy/median' );
var kumaraswamyMode = require( '@stdlib/stats/base/dists/kumaraswamy/mode' );
var kumaraswamyVariance = require( '@stdlib/stats/base/dists/kumaraswamy/variance' );

// extend kumaraswamy function with static methods
jStat.extend(jStat.kumaraswamy, {
  pdf: kumaraswamyPDF,
  cdf: kumaraswamyCDF,
  inv: kumaraswamyQuantile,
  mean : kumaraswamyMean,
  median: kumaraswamyMedian,
  mode: kumaraswamyMode,
  variance: kumaraswamyVariance
});

var lognormalPDF = require( '@stdlib/stats/base/dists/lognormal/pdf' );
var lognormalCDF = require( '@stdlib/stats/base/dists/lognormal/cdf' );
var lognormalQuantile = require( '@stdlib/stats/base/dists/lognormal/quantile' );
var lognormalMean = require( '@stdlib/stats/base/dists/lognormal/mean' );
var lognormalMedian = require( '@stdlib/stats/base/dists/lognormal/median' );
var lognormalMode = require( '@stdlib/stats/base/dists/lognormal/mode' );
var lognormalSample = require( '@stdlib/random/base/lognormal' );
var lognormalVariance = require( '@stdlib/stats/base/dists/lognormal/variance' );

// extend lognormal function with static methods
jStat.extend(jStat.lognormal, {
  pdf: lognormalPDF,
  cdf: lognormalCDF,
  inv: lognormalQuantile,
  mean: lognormalMean,
  median: lognormalMedian,
  mode: lognormalMode,
  sample: lognormalSample,
  variance: lognormalVariance
});


// extend noncentralt function with static methods
jStat.extend(jStat.noncentralt, {
  pdf: function pdf(x, dof, ncp) {
    var tol = 1e-14;
    if (Math.abs(ncp) < tol)  // ncp approx 0; use student-t
      return jStat.studentt.pdf(x, dof)

    if (Math.abs(x) < tol) {  // different formula for x == 0
      return Math.exp(jStat.gammaln((dof + 1) / 2) - ncp * ncp / 2 -
                      0.5 * Math.log(Math.PI * dof) - jStat.gammaln(dof / 2));
    }

    // formula for x != 0
    return dof / x *
        (jStat.noncentralt.cdf(x * Math.sqrt(1 + 2 / dof), dof+2, ncp) -
         jStat.noncentralt.cdf(x, dof, ncp));
  },

  cdf: function cdf(x, dof, ncp) {
    var tol = 1e-14;
    var min_iterations = 200;

    if (Math.abs(ncp) < tol)  // ncp approx 0; use student-t
      return jStat.studentt.cdf(x, dof);

    // turn negative x into positive and flip result afterwards
    var flip = false;
    if (x < 0) {
      flip = true;
      ncp = -ncp;
    }

    var prob = jStat.normal.cdf(-ncp, 0, 1);
    var value = tol + 1;
    // use value at last two steps to determine convergence
    var lastvalue = value;
    var y = x * x / (x * x + dof);
    var j = 0;
    var p = Math.exp(-ncp * ncp / 2);
    var q = Math.exp(-ncp * ncp / 2 - 0.5 * Math.log(2) -
                     jStat.gammaln(3 / 2)) * ncp;
    while (j < min_iterations || lastvalue > tol || value > tol) {
      lastvalue = value;
      if (j > 0) {
        p *= (ncp * ncp) / (2 * j);
        q *= (ncp * ncp) / (2 * (j + 1 / 2));
      }
      value = p * jStat.beta.cdf(y, j + 0.5, dof / 2) +
          q * jStat.beta.cdf(y, j+1, dof/2);
      prob += 0.5 * value;
      j++;
    }

    return flip ? (1 - prob) : prob;
  }
});

var normalPDF = require( '@stdlib/stats/base/dists/normal/pdf' );
var normalCDF = require( '@stdlib/stats/base/dists/normal/cdf' );
var normalQuantile = require( '@stdlib/stats/base/dists/normal/quantile' );
var normalMean = require( '@stdlib/stats/base/dists/normal/mean' );
var normalMedian = require( '@stdlib/stats/base/dists/normal/median' );
var normalMode = require( '@stdlib/stats/base/dists/normal/mode' );
var normalSample = require( '@stdlib/random/base/normal' );
var normalVariance = require( '@stdlib/stats/base/dists/normal/variance' );

// extend normal function with static methods
jStat.extend(jStat.normal, {
  pdf: normalPDF,
  cdf: normalCDF,
  inv: normalQuantile,
  mean : normalMean,
  median: normalMedian,
  mode: normalMode,
  sample: normalSample,
  variance : normalVariance
});

var paretoPDF = require( '@stdlib/stats/base/dists/pareto-type1/pdf' );
var paretoCDF = require( '@stdlib/stats/base/dists/pareto-type1/cdf' );
var paretoQuantile = require( '@stdlib/stats/base/dists/pareto-type1/quantile' );
var paretoMean = require( '@stdlib/stats/base/dists/pareto-type1/mean' );
var paretoMedian = require( '@stdlib/stats/base/dists/pareto-type1/median' );
var paretoMode = require( '@stdlib/stats/base/dists/pareto-type1/mode' );
var paretoVariance = require( '@stdlib/stats/base/dists/pareto-type1/variance' );

// extend pareto function with static methods
jStat.extend(jStat.pareto, {
  pdf: function pdf(x, scale, shape) {
    return paretoPDF(x, shape, scale);
  },

  cdf: function cdf(x, scale, shape) {
    return paretoCDF(x, shape, scale);
  },

  inv: function inv(p, scale, shape) {
    return paretoQuantile(p, shape, scale);
  },

  mean: function mean(scale, shape) {
    return paretoMean(shape, scale);
  },

  median: function median(scale, shape) {
    return paretoMedian(shape, scale);
  },

  mode: function mode(scale, shape) {
    return paretoMode(shape, scale);
  },

  variance: function variance(scale, shape) {
    return paretoVariance(shape, scale);
  }
});

var tPDF = require( '@stdlib/stats/base/dists/t/pdf' );
var tCDF = require( '@stdlib/stats/base/dists/t/cdf' );
var tQuantile = require( '@stdlib/stats/base/dists/t/quantile' );
var tMean = require( '@stdlib/stats/base/dists/t/mean' );
var tMedian = require( '@stdlib/stats/base/dists/t/median' );
var tMode = require( '@stdlib/stats/base/dists/t/mode' );
var tSample = require( '@stdlib/random/base/t' );
var tVariance = require( '@stdlib/stats/base/dists/t/variance' );

// extend studentt function with static methods
jStat.extend(jStat.studentt, {
  pdf: tPDF,
  cdf: tCDF,
  inv: tQuantile,
  mean: tMean,
  median: tMedian,
  mode: tMode,
  sample: tSample,
  variance: tVariance
});

var weibullPDF = require( '@stdlib/stats/base/dists/weibull/pdf' );
var weibullCDF = require( '@stdlib/stats/base/dists/weibull/cdf' );
var weibullQuantile = require( '@stdlib/stats/base/dists/weibull/quantile' );
var weibullMean = require( '@stdlib/stats/base/dists/weibull/mean' );
var weibullMedian = require( '@stdlib/stats/base/dists/weibull/median' );
var weibullMode = require( '@stdlib/stats/base/dists/weibull/mode' );
var weibullSample = require( '@stdlib/random/base/t' );
var weibullVariance = require( '@stdlib/stats/base/dists/weibull/variance' );

// extend weibull function with static methods
jStat.extend(jStat.weibull, {
  pdf: function pdf(x, scale, shape) {
    return weibullPDF(x, shape, scale);
  },

  cdf: function cdf(x, scale, shape) {
    return weibullCDF(x, shape, scale);
  },

  inv: function(p, scale, shape) {
    return weibullQuantile(p, shape, scale);
  },

  mean : function(scale, shape) {
    return weibullMean(shape, scale);
  },

  median: function median(scale, shape) {
    return weibullMedian(shape, scale);
  },

  mode: function mode(scale, shape) {
    return weibullMode(shape, scale);
  },

  sample: function sample(scale, shape) {
    return weibullSample(shape, scale);
  },

  variance: function variance(scale, shape) {
    return weibullVariance(shape, scale);
  }
});

var uniformPDF = require( '@stdlib/stats/base/dists/uniform/pdf' );
var uniformCDF = require( '@stdlib/stats/base/dists/uniform/cdf' );
var uniformQuantile = require( '@stdlib/stats/base/dists/uniform/quantile' );
var uniformMean = require( '@stdlib/stats/base/dists/uniform/mean' );
var uniformMedian = require( '@stdlib/stats/base/dists/uniform/median' );
var uniformSample = require( '@stdlib/random/base/t' );
var uniformVariance = require( '@stdlib/stats/base/dists/uniform/variance' );

// extend uniform function with static methods
jStat.extend(jStat.uniform, {
  pdf: uniformPDF,
  cdf: uniformCDF,
  inv: uniformQuantile,
  mean: uniformMean,
  median: uniformMedian,

  mode: function mode(/*a, b*/) {
    throw new Error('mode is not implemented');
  },

  sample: uniformSample,
  variance: uniformVariance
});


// Got this from http://www.math.ucla.edu/~tom/distributions/binomial.html
function betinc(x, a, b, eps) {
  var a0 = 0;
  var b0 = 1;
  var a1 = 1;
  var b1 = 1;
  var m9 = 0;
  var a2 = 0;
  var c9;

  while (Math.abs((a1 - a2) / a1) > eps) {
    a2 = a1;
    c9 = -(a + m9) * (a + b + m9) * x / (a + 2 * m9) / (a + 2 * m9 + 1);
    a0 = a1 + c9 * a0;
    b0 = b1 + c9 * b0;
    m9 = m9 + 1;
    c9 = m9 * (b - m9) * x / (a + 2 * m9 - 1) / (a + 2 * m9);
    a1 = a0 + c9 * a1;
    b1 = b0 + c9 * b1;
    a0 = a0 / b1;
    b0 = b0 / b1;
    a1 = a1 / b1;
    b1 = 1;
  }

  return a1 / a;
}

var binomialPMF = require( '@stdlib/stats/base/dists/binomial/pmf' );
var binomialCDF = require( '@stdlib/stats/base/dists/binomial/cdf' );

// extend binomial function with static methods
jStat.extend(jStat.binomial, {
  pdf: binomialPMF,
  cdf: binomialCDF
});

var negativeBinomialPMF = require( '@stdlib/stats/base/dists/negative-binomial/pmf' );
var negativeBinomialCDF = require( '@stdlib/stats/base/dists/negative-binomial/cdf' );

// extend negbin function with static methods
jStat.extend(jStat.negbin, {
  pdf: negativeBinomialPMF,
  cdf: negativeBinomialCDF
});



// extend uniform function with static methods
jStat.extend(jStat.hypgeom, {
  pdf: function pdf(k, N, m, n) {
    // Hypergeometric PDF.

    // A simplification of the CDF algorithm below.

    // k = number of successes drawn
    // N = population size
    // m = number of successes in population
    // n = number of items drawn from population

    if(k !== k | 0) {
      return false;
    } else if(k < 0 || k < m - (N - n)) {
      // It's impossible to have this few successes drawn.
      return 0;
    } else if(k > n || k > m) {
      // It's impossible to have this many successes drawn.
      return 0;
    } else if (m * 2 > N) {
      // More than half the population is successes.

      if(n * 2 > N) {
        // More than half the population is sampled.

        return jStat.hypgeom.pdf(N - m - n + k, N, N - m, N - n)
      } else {
        // Half or less of the population is sampled.

        return jStat.hypgeom.pdf(n - k, N, N - m, n);
      }

    } else if(n * 2 > N) {
      // Half or less is successes.

      return jStat.hypgeom.pdf(m - k, N, m, N - n);

    } else if(m < n) {
      // We want to have the number of things sampled to be less than the
      // successes available. So swap the definitions of successful and sampled.
      return jStat.hypgeom.pdf(k, N, n, m);
    } else {
      // If we get here, half or less of the population was sampled, half or
      // less of it was successes, and we had fewer sampled things than
      // successes. Now we can do this complicated iterative algorithm in an
      // efficient way.

      // The basic premise of the algorithm is that we partially normalize our
      // intermediate product to keep it in a numerically good region, and then
      // finish the normalization at the end.

      // This variable holds the scaled probability of the current number of
      // successes.
      var scaledPDF = 1;

      // This keeps track of how much we have normalized.
      var samplesDone = 0;

      for(var i = 0; i < k; i++) {
        // For every possible number of successes up to that observed...

        while(scaledPDF > 1 && samplesDone < n) {
          // Intermediate result is growing too big. Apply some of the
          // normalization to shrink everything.

          scaledPDF *= 1 - (m / (N - samplesDone));

          // Say we've normalized by this sample already.
          samplesDone++;
        }

        // Work out the partially-normalized hypergeometric PDF for the next
        // number of successes
        scaledPDF *= (n - i) * (m - i) / ((i + 1) * (N - m - n + i + 1));
      }

      for(; samplesDone < n; samplesDone++) {
        // Apply all the rest of the normalization
        scaledPDF *= 1 - (m / (N - samplesDone));
      }

      // Bound answer sanely before returning.
      return Math.min(1, Math.max(0, scaledPDF));
    }
  },

  cdf: function cdf(x, N, m, n) {
    // Hypergeometric CDF.

    // This algorithm is due to Prof. Thomas S. Ferguson, <tom@math.ucla.edu>,
    // and comes from his hypergeometric test calculator at
    // <http://www.math.ucla.edu/~tom/distributions/Hypergeometric.html>.

    // x = number of successes drawn
    // N = population size
    // m = number of successes in population
    // n = number of items drawn from population

    if(x < 0 || x < m - (N - n)) {
      // It's impossible to have this few successes drawn or fewer.
      return 0;
    } else if(x >= n || x >= m) {
      // We will always have this many successes or fewer.
      return 1;
    } else if (m * 2 > N) {
      // More than half the population is successes.

      if(n * 2 > N) {
        // More than half the population is sampled.

        return jStat.hypgeom.cdf(N - m - n + x, N, N - m, N - n)
      } else {
        // Half or less of the population is sampled.

        return 1 - jStat.hypgeom.cdf(n - x - 1, N, N - m, n);
      }

    } else if(n * 2 > N) {
      // Half or less is successes.

      return 1 - jStat.hypgeom.cdf(m - x - 1, N, m, N - n);

    } else if(m < n) {
      // We want to have the number of things sampled to be less than the
      // successes available. So swap the definitions of successful and sampled.
      return jStat.hypgeom.cdf(x, N, n, m);
    } else {
      // If we get here, half or less of the population was sampled, half or
      // less of it was successes, and we had fewer sampled things than
      // successes. Now we can do this complicated iterative algorithm in an
      // efficient way.

      // The basic premise of the algorithm is that we partially normalize our
      // intermediate sum to keep it in a numerically good region, and then
      // finish the normalization at the end.

      // Holds the intermediate, scaled total CDF.
      var scaledCDF = 1;

      // This variable holds the scaled probability of the current number of
      // successes.
      var scaledPDF = 1;

      // This keeps track of how much we have normalized.
      var samplesDone = 0;

      for(var i = 0; i < x; i++) {
        // For every possible number of successes up to that observed...

        while(scaledCDF > 1 && samplesDone < n) {
          // Intermediate result is growing too big. Apply some of the
          // normalization to shrink everything.

          var factor = 1 - (m / (N - samplesDone));

          scaledPDF *= factor;
          scaledCDF *= factor;

          // Say we've normalized by this sample already.
          samplesDone++;
        }

        // Work out the partially-normalized hypergeometric PDF for the next
        // number of successes
        scaledPDF *= (n - i) * (m - i) / ((i + 1) * (N - m - n + i + 1));

        // Add to the CDF answer.
        scaledCDF += scaledPDF;
      }

      for(; samplesDone < n; samplesDone++) {
        // Apply all the rest of the normalization
        scaledCDF *= 1 - (m / (N - samplesDone));
      }

      // Bound answer sanely before returning.
      return Math.min(1, Math.max(0, scaledCDF));
    }
  }
});



// extend uniform function with static methods
jStat.extend(jStat.poisson, {
  pdf: function pdf(k, l) {
    if (l < 0 || (k % 1) !== 0 || k < 0) {
      return 0;
    }

    return Math.pow(l, k) * Math.exp(-l) / jStat.factorial(k);
  },

  cdf: function cdf(x, l) {
    var sumarr = [],
    k = 0;
    if (x < 0) return 0;
    for (; k <= x; k++) {
      sumarr.push(jStat.poisson.pdf(k, l));
    }
    return jStat.sum(sumarr);
  },

  mean : function(l) {
    return l;
  },

  variance : function(l) {
    return l;
  },

  sampleSmall: function sampleSmall(l) {
    var p = 1, k = 0, L = Math.exp(-l);
    do {
      k++;
      p *= jStat._random_fn();
    } while (p > L);
    return k - 1;
  },

  sampleLarge: function sampleLarge(l) {
    var lam = l;
    var k;
    var U, V, slam, loglam, a, b, invalpha, vr, us;

    slam = Math.sqrt(lam);
    loglam = Math.log(lam);
    b = 0.931 + 2.53 * slam;
    a = -0.059 + 0.02483 * b;
    invalpha = 1.1239 + 1.1328 / (b - 3.4);
    vr = 0.9277 - 3.6224 / (b - 2);

    while (1) {
      U = Math.random() - 0.5;
      V = Math.random();
      us = 0.5 - Math.abs(U);
      k = Math.floor((2 * a / us + b) * U + lam + 0.43);
      if ((us >= 0.07) && (V <= vr)) {
          return k;
      }
      if ((k < 0) || ((us < 0.013) && (V > us))) {
          continue;
      }
      /* log(V) == log(0.0) ok here */
      /* if U==0.0 so that us==0.0, log is ok since always returns */
      if ((Math.log(V) + Math.log(invalpha) - Math.log(a / (us * us) + b)) <= (-lam + k * loglam - jStat.loggam(k + 1))) {
          return k;
      }
    }
  },

  sample: function sample(l) {
    if (l < 10)
      return this.sampleSmall(l);
    else
      return this.sampleLarge(l);
  }
});

// extend triangular function with static methods
jStat.extend(jStat.triangular, {
  pdf: function pdf(x, a, b, c) {
    if (b <= a || c < a || c > b) {
      return NaN;
    } else {
      if (x < a || x > b) {
        return 0;
      } else if (x < c) {
          return (2 * (x - a)) / ((b - a) * (c - a));
      } else if (x === c) {
          return (2 / (b - a));
      } else { // x > c
          return (2 * (b - x)) / ((b - a) * (b - c));
      }
    }
  },

  cdf: function cdf(x, a, b, c) {
    if (b <= a || c < a || c > b)
      return NaN;
    if (x <= a)
      return 0;
    else if (x >= b)
      return 1;
    if (x <= c)
      return Math.pow(x - a, 2) / ((b - a) * (c - a));
    else // x > c
      return 1 - Math.pow(b - x, 2) / ((b - a) * (b - c));
  },

  inv: function inv(p, a, b, c) {
    if (b <= a || c < a || c > b) {
      return NaN;
    } else {
      if (p <= ((c - a) / (b - a))) {
        return a + (b - a) * Math.sqrt(p * ((c - a) / (b - a)));
      } else { // p > ((c - a) / (b - a))
        return a + (b - a) * (1 - Math.sqrt((1 - p) * (1 - ((c - a) / (b - a)))));
      }
    }
  },

  mean: function mean(a, b, c) {
    return (a + b + c) / 3;
  },

  median: function median(a, b, c) {
    if (c <= (a + b) / 2) {
      return b - Math.sqrt((b - a) * (b - c)) / Math.sqrt(2);
    } else if (c > (a + b) / 2) {
      return a + Math.sqrt((b - a) * (c - a)) / Math.sqrt(2);
    }
  },

  mode: function mode(a, b, c) {
    return c;
  },

  sample: function sample(a, b, c) {
    var u = jStat._random_fn();
    if (u < ((c - a) / (b - a)))
      return a + Math.sqrt(u * (b - a) * (c - a))
    return b - Math.sqrt((1 - u) * (b - a) * (b - c));
  },

  variance: function variance(a, b, c) {
    return (a * a + b * b + c * c - a * b - a * c - b * c) / 18;
  }
});


// extend arcsine function with static methods
jStat.extend(jStat.arcsine, {
  pdf: function pdf(x, a, b) {
    if (b <= a) return NaN;

    return (x <= a || x >= b) ? 0 :
      (2 / Math.PI) *
        Math.pow(Math.pow(b - a, 2) -
                  Math.pow(2 * x - a - b, 2), -0.5);
  },

  cdf: function cdf(x, a, b) {
    if (x < a)
      return 0;
    else if (x < b)
      return (2 / Math.PI) * Math.asin(Math.sqrt((x - a)/(b - a)));
    return 1;
  },

  inv: function(p, a, b) {
    return a + (0.5 - 0.5 * Math.cos(Math.PI * p)) * (b - a);
  },

  mean: function mean(a, b) {
    if (b <= a) return NaN;
    return (a + b) / 2;
  },

  median: function median(a, b) {
    if (b <= a) return NaN;
    return (a + b) / 2;
  },

  mode: function mode(/*a, b*/) {
    throw new Error('mode is not yet implemented');
  },

  sample: function sample(a, b) {
    return ((a + b) / 2) + ((b - a) / 2) *
      Math.sin(2 * Math.PI * jStat.uniform.sample(0, 1));
  },

  variance: function variance(a, b) {
    if (b <= a) return NaN;
    return Math.pow(b - a, 2) / 8;
  }
});


function laplaceSign(x) { return x / Math.abs(x); }

jStat.extend(jStat.laplace, {
  pdf: function pdf(x, mu, b) {
    return (b <= 0) ? 0 : (Math.exp(-Math.abs(x - mu) / b)) / (2 * b);
  },

  cdf: function cdf(x, mu, b) {
    if (b <= 0) { return 0; }

    if(x < mu) {
      return 0.5 * Math.exp((x - mu) / b);
    } else {
      return 1 - 0.5 * Math.exp(- (x - mu) / b);
    }
  },

  mean: function(mu/*, b*/) {
    return mu;
  },

  median: function(mu/*, b*/) {
    return mu;
  },

  mode: function(mu/*, b*/) {
    return mu;
  },

  variance: function(mu, b) {
    return 2 * b * b;
  },

  sample: function sample(mu, b) {
    var u = jStat._random_fn() - 0.5;

    return mu - (b * laplaceSign(u) * Math.log(1 - (2 * Math.abs(u))));
  }
});

function tukeyWprob(w, rr, cc) {
  var nleg = 12;
  var ihalf = 6;

  var C1 = -30;
  var C2 = -50;
  var C3 = 60;
  var bb   = 8;
  var wlar = 3;
  var wincr1 = 2;
  var wincr2 = 3;
  var xleg = [
    0.981560634246719250690549090149,
    0.904117256370474856678465866119,
    0.769902674194304687036893833213,
    0.587317954286617447296702418941,
    0.367831498998180193752691536644,
    0.125233408511468915472441369464
  ];
  var aleg = [
    0.047175336386511827194615961485,
    0.106939325995318430960254718194,
    0.160078328543346226334652529543,
    0.203167426723065921749064455810,
    0.233492536538354808760849898925,
    0.249147045813402785000562436043
  ];

  var qsqz = w * 0.5;

  // if w >= 16 then the integral lower bound (occurs for c=20)
  // is 0.99999999999995 so return a value of 1.

  if (qsqz >= bb)
    return 1.0;

  // find (f(w/2) - 1) ^ cc
  // (first term in integral of hartley's form).

  var pr_w = 2 * jStat.normal.cdf(qsqz, 0, 1, 1, 0) - 1; // erf(qsqz / M_SQRT2)
  // if pr_w ^ cc < 2e-22 then set pr_w = 0
  if (pr_w >= Math.exp(C2 / cc))
    pr_w = Math.pow(pr_w, cc);
  else
    pr_w = 0.0;

  // if w is large then the second component of the
  // integral is small, so fewer intervals are needed.

  var wincr;
  if (w > wlar)
    wincr = wincr1;
  else
    wincr = wincr2;

  // find the integral of second term of hartley's form
  // for the integral of the range for equal-length
  // intervals using legendre quadrature.  limits of
  // integration are from (w/2, 8).  two or three
  // equal-length intervals are used.

  // blb and bub are lower and upper limits of integration.

  var blb = qsqz;
  var binc = (bb - qsqz) / wincr;
  var bub = blb + binc;
  var einsum = 0.0;

  // integrate over each interval

  var cc1 = cc - 1.0;
  for (var wi = 1; wi <= wincr; wi++) {
    var elsum = 0.0;
    var a = 0.5 * (bub + blb);

    // legendre quadrature with order = nleg

    var b = 0.5 * (bub - blb);

    for (var jj = 1; jj <= nleg; jj++) {
      var j, xx;
      if (ihalf < jj) {
        j = (nleg - jj) + 1;
        xx = xleg[j-1];
      } else {
        j = jj;
        xx = -xleg[j-1];
      }
      var c = b * xx;
      var ac = a + c;

      // if exp(-qexpo/2) < 9e-14,
      // then doesn't contribute to integral

      var qexpo = ac * ac;
      if (qexpo > C3)
        break;

      var pplus = 2 * jStat.normal.cdf(ac, 0, 1, 1, 0);
      var pminus= 2 * jStat.normal.cdf(ac, w, 1, 1, 0);

      // if rinsum ^ (cc-1) < 9e-14,
      // then doesn't contribute to integral

      var rinsum = (pplus * 0.5) - (pminus * 0.5);
      if (rinsum >= Math.exp(C1 / cc1)) {
        rinsum = (aleg[j-1] * Math.exp(-(0.5 * qexpo))) * Math.pow(rinsum, cc1);
        elsum += rinsum;
      }
    }
    elsum *= (((2.0 * b) * cc) / Math.sqrt(2 * Math.PI));
    einsum += elsum;
    blb = bub;
    bub += binc;
  }

  // if pr_w ^ rr < 9e-14, then return 0
  pr_w += einsum;
  if (pr_w <= Math.exp(C1 / rr))
    return 0;

  pr_w = Math.pow(pr_w, rr);
  if (pr_w >= 1) // 1 was iMax was eps
    return 1;
  return pr_w;
}

function tukeyQinv(p, c, v) {
  var p0 = 0.322232421088;
  var q0 = 0.993484626060e-01;
  var p1 = -1.0;
  var q1 = 0.588581570495;
  var p2 = -0.342242088547;
  var q2 = 0.531103462366;
  var p3 = -0.204231210125;
  var q3 = 0.103537752850;
  var p4 = -0.453642210148e-04;
  var q4 = 0.38560700634e-02;
  var c1 = 0.8832;
  var c2 = 0.2368;
  var c3 = 1.214;
  var c4 = 1.208;
  var c5 = 1.4142;
  var vmax = 120.0;

  var ps = 0.5 - 0.5 * p;
  var yi = Math.sqrt(Math.log(1.0 / (ps * ps)));
  var t = yi + (((( yi * p4 + p3) * yi + p2) * yi + p1) * yi + p0)
     / (((( yi * q4 + q3) * yi + q2) * yi + q1) * yi + q0);
  if (v < vmax) t += (t * t * t + t) / v / 4.0;
  var q = c1 - c2 * t;
  if (v < vmax) q += -c3 / v + c4 * t / v;
  return t * (q * Math.log(c - 1.0) + c5);
}

jStat.extend(jStat.tukey, {
  cdf: function cdf(q, nmeans, df) {
    // Identical implementation as the R ptukey() function as of commit 68947
    var rr = 1;
    var cc = nmeans;

    var nlegq = 16;
    var ihalfq = 8;

    var eps1 = -30.0;
    var eps2 = 1.0e-14;
    var dhaf  = 100.0;
    var dquar = 800.0;
    var deigh = 5000.0;
    var dlarg = 25000.0;
    var ulen1 = 1.0;
    var ulen2 = 0.5;
    var ulen3 = 0.25;
    var ulen4 = 0.125;
    var xlegq = [
      0.989400934991649932596154173450,
      0.944575023073232576077988415535,
      0.865631202387831743880467897712,
      0.755404408355003033895101194847,
      0.617876244402643748446671764049,
      0.458016777657227386342419442984,
      0.281603550779258913230460501460,
      0.950125098376374401853193354250e-1
    ];
    var alegq = [
      0.271524594117540948517805724560e-1,
      0.622535239386478928628438369944e-1,
      0.951585116824927848099251076022e-1,
      0.124628971255533872052476282192,
      0.149595988816576732081501730547,
      0.169156519395002538189312079030,
      0.182603415044923588866763667969,
      0.189450610455068496285396723208
    ];

    if (q <= 0)
      return 0;

    // df must be > 1
    // there must be at least two values

    if (df < 2 || rr < 1 || cc < 2) return NaN;

    if (!Number.isFinite(q))
      return 1;

    if (df > dlarg)
      return tukeyWprob(q, rr, cc);

    // calculate leading constant

    var f2 = df * 0.5;
    var f2lf = ((f2 * Math.log(df)) - (df * Math.log(2))) - jStat.gammaln(f2);
    var f21 = f2 - 1.0;

    // integral is divided into unit, half-unit, quarter-unit, or
    // eighth-unit length intervals depending on the value of the
    // degrees of freedom.

    var ff4 = df * 0.25;
    var ulen;
    if      (df <= dhaf)  ulen = ulen1;
    else if (df <= dquar) ulen = ulen2;
    else if (df <= deigh) ulen = ulen3;
    else                  ulen = ulen4;

    f2lf += Math.log(ulen);

    // integrate over each subinterval

    var ans = 0.0;

    for (var i = 1; i <= 50; i++) {
      var otsum = 0.0;

      // legendre quadrature with order = nlegq
      // nodes (stored in xlegq) are symmetric around zero.

      var twa1 = (2 * i - 1) * ulen;

      for (var jj = 1; jj <= nlegq; jj++) {
        var j, t1;
        if (ihalfq < jj) {
          j = jj - ihalfq - 1;
          t1 = (f2lf + (f21 * Math.log(twa1 + (xlegq[j] * ulen))))
              - (((xlegq[j] * ulen) + twa1) * ff4);
        } else {
          j = jj - 1;
          t1 = (f2lf + (f21 * Math.log(twa1 - (xlegq[j] * ulen))))
              + (((xlegq[j] * ulen) - twa1) * ff4);
        }

        // if exp(t1) < 9e-14, then doesn't contribute to integral
        var qsqz;
        if (t1 >= eps1) {
          if (ihalfq < jj) {
            qsqz = q * Math.sqrt(((xlegq[j] * ulen) + twa1) * 0.5);
          } else {
            qsqz = q * Math.sqrt(((-(xlegq[j] * ulen)) + twa1) * 0.5);
          }

          // call wprob to find integral of range portion

          var wprb = tukeyWprob(qsqz, rr, cc);
          var rotsum = (wprb * alegq[j]) * Math.exp(t1);
          otsum += rotsum;
        }
        // end legendre integral for interval i
        // L200:
      }

      // if integral for interval i < 1e-14, then stop.
      // However, in order to avoid small area under left tail,
      // at least  1 / ulen  intervals are calculated.
      if (i * ulen >= 1.0 && otsum <= eps2)
        break;

      // end of interval i
      // L330:

      ans += otsum;
    }

    if (otsum > eps2) { // not converged
      throw new Error('tukey.cdf failed to converge');
    }
    if (ans > 1)
      ans = 1;
    return ans;
  },

  inv: function(p, nmeans, df) {
    // Identical implementation as the R qtukey() function as of commit 68947
    var rr = 1;
    var cc = nmeans;

    var eps = 0.0001;
    var maxiter = 50;

    // df must be > 1 ; there must be at least two values
    if (df < 2 || rr < 1 || cc < 2) return NaN;

    if (p < 0 || p > 1) return NaN;
    if (p === 0) return 0;
    if (p === 1) return Infinity;

    // Initial value

    var x0 = tukeyQinv(p, cc, df);

    // Find prob(value < x0)

    var valx0 = jStat.tukey.cdf(x0, nmeans, df) - p;

    // Find the second iterate and prob(value < x1).
    // If the first iterate has probability value
    // exceeding p then second iterate is 1 less than
    // first iterate; otherwise it is 1 greater.

    var x1;
    if (valx0 > 0.0)
      x1 = Math.max(0.0, x0 - 1.0);
    else
      x1 = x0 + 1.0;
    var valx1 = jStat.tukey.cdf(x1, nmeans, df) - p;

    // Find new iterate

    var ans;
    for(var iter = 1; iter < maxiter; iter++) {
      ans = x1 - ((valx1 * (x1 - x0)) / (valx1 - valx0));
      valx0 = valx1;

      // New iterate must be >= 0

      x0 = x1;
      if (ans < 0.0) {
        ans = 0.0;
        valx1 = -p;
      }
      // Find prob(value < new iterate)

      valx1 = jStat.tukey.cdf(ans, nmeans, df) - p;
      x1 = ans;

      // If the difference between two successive
      // iterates is less than eps, stop

      var xabs = Math.abs(x1 - x0);
      if (xabs < eps)
        return ans;
    }

    throw new Error('tukey.inv failed to converge');
  }
});
