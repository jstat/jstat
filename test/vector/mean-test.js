var vows = require( 'vows' ),
	assert = require('assert' )
	suite = vows.describe( 'jStat.mean' );

require( '../env.js' );

suite.addBatch({
	'mean' : {
		'topic' : function() {
			return jStat;
		},
		'return basic mean' : function( jStat ) {
			assert.equal( jStat.mean([1,2,3]), 2 );
		},
		'mean from instance' : function( jStat ) {
			assert.equal( jStat([1,2,3]).mean(), 2 );
		},
		'mean matrix cols' : function( jStat ) {
			assert.deepEqual( jStat([[1,2],[3,4]]).mean(), [2,3]);
		},
		'mean full matrix' : function( jStat ) {
			assert.equal( jStat([[1,2],[3,4]]).mean( true ), 2.5 );
		}
	},
	'fn.mean vector' : {
		'topic' : function() {
			jStat([1,2,3]).mean( this.callback );
		},
		'mean callback' : function( val, stat ) {
			assert.equal( val, 2 );
		}
	},
	'fn.mean matrix cols' : {
		'topic' : function() {
			jStat([[1,2],[3,4]]).mean( this.callback );
		},
		'mean matrix cols callback' : function( val, stat ) {
			assert.deepEqual( val, [2,3] );
		}
	},
	'fn.mean full matrix' : {
		'topic' : function() {
			jStat([[1,2],[3,4]]).mean( true, this.callback );
		},
		'mean full matrix callback' : function( val, stat ) {
			assert.equal( val, 2.5 );
		}
	}
});

suite.export( module );
