const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { jStat, assertEpsilon } = require('../helpers.js');

describe('hypergeometric pdf', function () {
  it('check pdf calculation', function () {
    const tol = 0.0000001;
    // How many 1s were obtained by sampling?
    const successes = [10, 16];
    // How big was the source population?
    const population = [100, 3589];
    // How many 1s were in it?
    const available = [20, 16];
    // How big a sample was taken?
    const draws = [15, 2290];
    // What was the probability of exactly this many 1s?
    // Obtained from the calculator at
    // <http://www.geneprof.org/GeneProf/tools/hypergeometric.jsp>
    const answers = [0.000017532028090435493, 0.0007404996809672229];

    for (let i = 0; i < answers.length; i++) {
      // See if we get the right answer for each calculation.
      const calculated = jStat.hypgeom.pdf(successes[i], population[i], available[i], draws[i]);
      // None of the answers should be NaN
      assert.ok(!isNaN(calculated));
      // And they should all match
      assertEpsilon(tol, calculated, answers[i]);
    }
  });
});
