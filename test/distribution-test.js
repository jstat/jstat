var vows = require('vows'),
assert = require('assert');
suite = vows.describe('jStat.distribution');

require('./env.js');

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
    }
  }
});

suite.addBatch({
  'hypergeometric pdf': {
    'topic' : function() {
      return jStat;
    },
    'check pdf calculation' : function(jStat) {
      var tol = 0.0000001;
      // How many 1s were obtained by sampling?
      var successes = [
                        10,
                        16
                      ]; 
      // How big was the source population?
      var population = [
                        100,
                        3589
                       ]; 
      // How many 1s were in it?
      var available = [
                        20,
                        16
                      ]; 
      // How big a sample was taken?
      var draws = [
                    15,
                    2290
                  ]; 
      // What was the probability of exactly this many 1s?
      var answers = [
                      0.000017532028090435493,
                      0.0007404996809672229
                    ]; 

      for (var i=0; i < answers.length; i++) {
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

suite.export(module);
