var { describe, it } = require('node:test');
var assert = require('node:assert/strict');
var { jStat } = require('../helpers.js');

describe('anovafscore ', function() {
  it('anovafscore control test', function() {
    var control = [433.579, 471.484, 487.407, 518.166, 444.534,
                   434.615, 447.401, 525.873, 421.322, 425.949];
    var test = [356.139, 315.869, 327.203, 335.308, 332.547, 336.871,
                353.809, 333.462, 349.203, 340.051];
    assert.strictEqual(jStat.anovafscore(control, test), 94.76896135161758);
    assert.strictEqual(jStat.anovafscore(test, control), 94.76896135161758);
  });
});
