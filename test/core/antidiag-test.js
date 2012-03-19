var vows = require( 'vows' ),
	assert = require('assert' )
	suite = vows.describe( 'jStat.antidiag' );

require( '../env.js' );

suite.addBatch({
	'antidiag' : {
		'topic' : function() {
			return jStat;
		},
		'return antidiag' : function( jStat ) {
			assert.deepEqual( jStat.antidiag([[1,2],[3,4]]), [[2],[3]] );
			assert.deepEqual( jStat([[1,2],[3,4]]).antidiag().toArray(), [[2],[3]] );
		}
	},
	'fn.antidiag' : {
		'topic' : function() {
			jStat([[1,2],[3,4]]).antidiag( this.callback );
		},
		'antidiag callback' : function( val, stat ) {
			assert.deepEqual( val.toArray(), [[2],[3]] );
		}
	}
});

suite.export( module );
