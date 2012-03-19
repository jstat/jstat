var vows = require( 'vows' ),
	assert = require('assert' )
	suite = vows.describe( 'jStat.col' );

require( '../env.js' );

suite.addBatch({
	'col' : {
		'topic' : function() {
			return jStat;
		},
		'return col at index' : function( jStat ) {
			assert.deepEqual( jStat.col([[1,2],[3,4]], 1 ), [[2],[4]] );
			assert.deepEqual( jStat([[1,2],[3,4]]).col( 1 ).toArray(), [[2],[4]] );
		}
	}
});

suite.export( module );
