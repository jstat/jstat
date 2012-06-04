var vows = require( 'vows' ),
	assert = require('assert' )
	suite = vows.describe( 'jStat' );

require( '../env.js' );

suite.addBatch({
	'jStat' : {
		'topic' : function() {
			return jStat;
		},
		'basic checks' : function( jStat ) {
			assert.isFunction( jStat.fn.toArray );
			assert.isFunction( jStat.fn.push );
			assert.isFunction( jStat.fn.sort );
			assert.isFunction( jStat.fn.splice );

			assert.deepEqual( jStat().toArray(), [] );
			assert.deepEqual( jStat( null ).toArray(), [] );
			assert.deepEqual( jStat( undefined ).toArray(), [] );
			assert.deepEqual( jStat( [] ).toArray(), [] );

			assert.isTrue( jStat.fn.constructor === jStat );
			assert.isTrue( jStat.fn.init.prototype === jStat.fn );
			assert.isTrue( jStat() instanceof jStat );
			assert.isTrue( jStat( null ) instanceof jStat );
			assert.isTrue( jStat( undefined ) instanceof jStat );
			assert.isTrue( jStat( [] ) instanceof jStat );

			assert.equal( jStat.fn.length, 0 );
			assert.equal( jStat([ 1, 2, 3 ]).length, 1 );
			assert.equal( jStat([ 1, 2, 3 ])[0].length, 3 );
		},
		'matrix/vector generation' : function( jStat ) {
			assert.deepEqual( jStat([1,2,3]).toArray(), [1,2,3] );
			assert.deepEqual( jStat([[1,2],[3,4]]).toArray(), [[1,2],[3,4]] );
			assert.deepEqual( jStat( jStat([[1,2],[3,4]])).toArray(), [[1,2],[3,4]] );
			assert.deepEqual( jStat([[1,2],[3,4]], function( x ) {
				return x * 2;
			}).toArray(), [[2,4],[6,8]] );
		},
		'sequence generation' : function( jStat ) {
			assert.deepEqual( jStat( 0, 0.5, 6 ).toArray(), [ 0, 0.1, 0.2, 0.3, 0.4, 0.5 ]);
			assert.deepEqual( jStat( 0, 5, 6, function( x ) {
				return x * 2;
			}).toArray(), [ 0, 2, 4, 6, 8, 10 ]);
		}
	}
});

suite.export( module );
