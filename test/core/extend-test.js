var { describe, it } = require('node:test');
var assert = require('node:assert/strict');
var { jStat } = require('../helpers.js');

describe('jStat', function() {
    it('extending', function() {
        assert.deepStrictEqual(jStat.extend({ happy: 'sad' }, { here: 'there' }),
                               { happy: 'sad', here: 'there' });
        assert.deepStrictEqual(jStat.extend({ one: 'two' }, { one: 'more' }),
                               { one: 'more' });
    });
});
