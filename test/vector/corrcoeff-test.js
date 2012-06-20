var vows = require( 'vows' ),
	assert = require('assert' )
	suite = vows.describe( 'jStat.corrcoeff' );

require( '../env.js' );

suite.addBatch({
	'corrcoeff' : {
		'topic' : function() {
			return jStat;
		},
		'return basic corrcoeff' : function( jStat ) {
			assert.equal( jStat.corrcoeff([1,2,3,4],[4,5,6,7]), 0.75 );
		}
	}
});

suite.export( module );
