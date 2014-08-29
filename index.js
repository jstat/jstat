module.exports.jStat = module.exports.j$ = jStat = require('./src/core');

require('./src/vector.js')(jStat);
require('./src/special.js')(jStat);
require('./src/distribution.js')(jStat);
require('./src/linearalgebra.js')(jStat);
require('./src/test.js')(jStat);