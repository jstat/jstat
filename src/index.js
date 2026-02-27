import jStat from './core.js';
import './vector.js';
import './special.js';
import './distribution.js';
import './linearalgebra.js';
import './test.js';
import './models.js';
import './regression.js';

// Backwards compatibility: require('jstat').jStat === require('jstat')
jStat.jStat = jStat;

export default jStat;
