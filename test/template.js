var vows = require( 'vows' ),
	assert = require('assert' )
	suite = vows.describe( 'jStat.' );

require( '../env.js' );

suite.addBatch({
	'' : {
		'topic' : function() {
			return jStat.;
		},
		'' : function(  ) {
		}
	}
});

suite.export( module );
