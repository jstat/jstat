var vows = require( 'vows' ),
	assert = require('assert' )
	suite = vows.describe( 'jStat.meddev' );

require( '../env.js' );

suite.addBatch({
	'meddev' : {
		'topic' : function() {
			return jStat;
		},
		'return basic meddev' : function( jStat ) {
			assert.equal( jStat.meddev([1,2,3,4]), 1 );
		},
		'meddev from instance' : function( jStat ) {
			assert.equal( jStat([1,2,3,4]).meddev(), 1 );
		},
		'meddev matrix cols' : function( jStat ) {
			assert.deepEqual( jStat([[1,2],[3,4]]).meddev(), [1,1]);
		}
	},
	'fn.meddev vector' : {
		'topic' : function() {
			jStat([1,2,3,4]).meddev( this.callback );
		},
		'meddev callback' : function( val, stat ) {
			assert.equal( val, 1 );
		}
	},
	'fn.meddev matrix cols' : {
		'topic' : function() {
			jStat([[1,2],[3,4]]).meddev( this.callback );
		},
		'meddev matrix cols callback' : function( val, stat ) {
			assert.deepEqual( val, [1,1] );
		}
	}
});

suite.export( module );
