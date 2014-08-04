var vows = require('vows'),
assert = require('assert');
suite = vows.describe('jStat.distribution');

require('../env.js');

suite.addBatch({
  'beta pdf': {
    'topic' : function() {
      return jStat;
    },
    'check pdf calculation' : function(jStat) {
      // Non-log form of the Beta pdf
      var pdf = function pdf(x, alpha, beta) {
        return (x > 1 || x < 0) ? 0 : ((Math.pow(x, alpha - 1)
            * Math.pow(1 - x, beta - 1))
            / jStat.betafn(alpha, beta));
      };

      var tol = 0.0000001;
      var args = [0, 0.1, 0.3, 0.5, 0.7, 0.9, 1];
      var arg;

      for (var i=0; i < args.length; i++) {
        arg = args[i];
        assert.epsilon(tol, jStat.beta.pdf(arg, 0.1, 0.1), pdf(arg, 0.1, 0.1));
        assert.epsilon(tol, jStat.beta.pdf(arg, 1, 1), pdf(arg, 1, 1));
        assert.epsilon(tol, jStat.beta.pdf(arg, 10, 50), pdf(arg, 10, 50));

        // Show that the log form of the pdf performs
        // better for large parameter values
        assert(!isNaN(jStat.beta.pdf(arg, 1000, 5000)),
               'New Beta pdf is NaN for large parameter values.');
        assert(isNaN(pdf(arg, 1000, 5000)),
               'Old Beta pdf is not NaN for large parameter values.');
      }

      assert.equal(jStat.beta.pdf(0, 1, 4), 4);
      assert.equal(jStat.beta.pdf(1, 4, 1), 4);
    }
  },
  'gamma pdf': {
    'topic': function() {
      return jStat;
    },
    'check instance and static pdf method': function (jStat) {
      var shape = 5;
      var scale = 1;
      var gamma = jStat.gamma(shape, scale);
      var xValues = [-1, 0, 1];
      var x;
      for (var i = 0; i < xValues.length; i++) {
        x = xValues[i];
        pStatic = jStat.gamma.pdf(x, shape, scale);
        pInstance = gamma.pdf(x);
        if (isNaN(pStatic)) {
          assert(isNaN(pInstance));
        } else {
          assert(pStatic === pInstance,
                 'Gamma pdf evaluated at ' + x + ' should be equal for instance and static methods.');
        }
      }
    }

  }
});

suite.addBatch({
  'negbin pdf': {
    'topic' : function() {
      return jStat;
    },
    'check pdf calculation' : function(jStat) {
      var k = 10; // number of failures
      var r = 5; // threshold number of successes
      var p = 0.25; // probability of a success
      assert(jStat.negbin.pdf(k, r, p), 0.05504866037517786);
    }
  },
  'negbin cdf': {
    'topic' : function() {
      return jStat;
    },
    'check pdf calculation' : function(jStat) {
      var k = 10; // number of failures
      var r = 5; // threshold number of successes
      var p = 0.25; // probability of a success
      assert(jStat.negbin.cdf(k, r, p), 0.3135140584781766);
    }
  },
});

suite.addBatch({
  'hypergeometric pdf': {
    'topic' : function() {
      return jStat;
    },
    'check pdf calculation' : function(jStat) {
      var tol = 0.0000001;
      // How many 1s were obtained by sampling?
      var successes = [10, 16];
      // How big was the source population?
      var population = [100, 3589];
      // How many 1s were in it?
      var available = [20, 16];
      // How big a sample was taken?
      var draws = [15, 2290];
      // What was the probability of exactly this many 1s?
      // Obtained from the calculator at
      // <http://www.geneprof.org/GeneProf/tools/hypergeometric.jsp>
      var answers = [0.000017532028090435493, 0.0007404996809672229];

      for (var i = 0; i < answers.length; i++) {
        // See if we get the right answer for each calculation.
        var calculated = jStat.hypgeom.pdf(successes[i], population[i],
                                           available[i], draws[i]);
        // None of the answers should be NaN
        assert(!isNaN(calculated));
        // And they should all match
        assert.epsilon(tol, calculated, answers[i]);
      }
    }
  }
});

suite.addBatch({
  'hypergeometric pdf': {
    'topic' : function() {
      return jStat;
    },

    'check pdf agreement' : function(jStat) {
      var tol = 0.0000001;

      // Define an easy pdf
      var easyPDF = function pdf(k, N, m, n) {
        return k !== k | 0
          ? false
          : (k < 0)
            ? 0
            : jStat.combination(m, k) * jStat.combination(N - m , n - k) /
              jStat.combination(N, n);
      }

      // Now test the easy PDF agaisnt the real one.

      for(var N = 0; N < 10; N++) {
        // For several population sizes
        for(var m = 0; m < N; m++) {
          // For all possible success counts
          for(var n = 0; n < N; n++) {
            // For all possible sample sizes
            for(var x = 0; x < n; x++) {
              // For all subset sizes of the sampled set

              // Get the probability be each method
              var probEasy = easyPDF(x, N, m, n);

              if(!isNaN(probEasy)) {
                // The easy PDF worked for this situation. Compare it to the
                // real one.

                var probReal = jStat.hypgeom.pdf(x, N, m, n);

                assert(!isNaN(probReal),
                  "Hypergeometric PDF returned NaN");
                assert.epsilon(tol, probReal, probEasy,
                  "Hypergeometric PDF didn't match naive implementation");
              }
            }
          }
        }
      }

    },

    'check cdf agreement' : function(jStat) {
      var tol = 0.0000001;

      // Define an easy pdf
      var easyPDF = function pdf(k, N, m, n) {
        return k !== k | 0
          ? false
          : (k < 0)
            ? 0
            : jStat.combination(m, k) * jStat.combination(N - m , n - k) /
              jStat.combination(N, n);
      }

      // Define a summation cdf based on it
      var easyCDF = function(x, N, m, n) {
        // Sum up the total probability of every number of successes <= x, and
        // put it here.
        var sum = 0;
        for(var i = 0; i <= x; i++) {
          sum += easyPDF(i, N, m, n);
        }
        return sum;
      }

      // Now test the easy CDF agaisnt the real one.

      for(var N = 0; N < 10; N++) {
        // For several population sizes
        for(var m = 0; m < N; m++) {
          // For all possible success counts
          for(var n = 0; n < N; n++) {
            // For all possible sample sizes
            for(var x = 0; x < n; x++) {
              // For all subset sizes of the sampled set

              // Get the probability be each method
              var probEasy = easyCDF(x, N, m, n);

              if(!isNaN(probEasy)) {
                // The easy CDF worked for this situation. Compare it to the
                // real one.

                var probReal = jStat.hypgeom.cdf(x, N, m, n);

                assert(!isNaN(probReal),
                  "Hypergeometric CDF returned NaN");
                assert.epsilon(tol, probReal, probEasy,
                  "Hypergeometric CDF didn't match naive implementation");
              }
            }
          }
        }
      }

    },
    'check pdf calculation' : function(jStat) {
      var tol = 0.0000001;
      // How many 1s were obtained by sampling?
      var successes = [
                        10,
                        16,
                        252
                      ];
      // How big was the source population?
      var population = [
                        100,
                        3589,
                        3589
                       ];
      // How many 1s were in it?
      var available = [
                        20,
                        16,
                        252
                      ];
      // How big a sample was taken?
      var draws = [
                    15,
                    2290,
                    252
                  ];
      // What was the probability of exactly this many 1s?
      // Obtained from the calculator at
      // <http://www.geneprof.org/GeneProf/tools/hypergeometric.jsp>
      var answers = [
                      0.000017532028090435493,
                      0.0007404996809672229,
                      0 // Too small to represent on that calculator
                    ];

      for (var i=0; i < answers.length; i++) {
        // See if we get the right answer for each calculation.

        var calculated = jStat.hypgeom.pdf(successes[i], population[i],
                                           available[i], draws[i]);

        // None of the answers should be NaN
        assert(!isNaN(calculated), "Hypergeometric PDF returned NaN");

        // And they should all match
        assert.epsilon(tol, calculated, answers[i],
          "Hypergeometric PDF returned incorrect answer");
      }
    },
    'check cdf calculation' : function(jStat) {
      var tol = 0.0000001;
      // How many 1s were obtained by sampling?
      var successes = [
                        10,
                        16,
                        10
                      ];
      // How big was the source population?
      var population = [
                        100,
                        3589,
                        3589
                       ];
      // How many 1s were in it?
      var available = [
                        20,
                        16,
                        16
                      ];
      // How big a sample was taken?
      var draws = [
                    15,
                    2290,
                    2290
                  ];
      // What was the probability of this many 1s or fewer?
      // Obtained from the calculator at
      // <http://www.geneprof.org/GeneProf/tools/hypergeometric.jsp>
      var answers = [
                      0.9999989096,
                      1,
                      0.55047323949
                    ];

      for (var i=0; i < answers.length; i++) {
        // See if we get the right answer for each calculation.

        var calculated = jStat.hypgeom.cdf(successes[i], population[i],
                                           available[i], draws[i]);

        // None of the answers should be NaN
        assert(!isNaN(calculated), "Hypergeometric CDF returned NaN");

        // And they should all match
        assert.epsilon(tol, calculated, answers[i],
          "Hypergeometric CDF returned incorrect answer");
      }
    }
  }
});

suite.export(module);
