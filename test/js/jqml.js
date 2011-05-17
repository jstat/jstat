/* jqml - jQuery JSONML Plugin
 * Author: Trevor Norris
 * This document is licensed as free software under the terms of the
 * MIT License: http://www.opensource.org/licenses/mit-license.php */

(function( $, document ) {
	function createObj( elem ) {
		var fragment = document.createDocumentFragment(),
			i = 0, selector;

		// check if is an element or array of elements
		if ( typeof elem[0] == 'string' ) {
			selector = document.createElement( elem[0] );
			i = 1;
		};

		for ( ; i < elem.length; i++ ) {

			// if array create new element
			if ( $.isArray( elem[i] ) ) {
				fragment.appendChild( createObj( elem[i] ) );

			// if object set element attributes
			} else if ( $.isPlainObject( elem[i] ) ) {
				$.fn.attr.call( [selector], elem[i], true  );

			// if string or number insert text node
			} else if ( typeof elem[i] == 'number' || typeof elem[i] == 'string' ) {
				fragment.appendChild( document.createTextNode( elem[i] ) );

			// if is an element append to fragment
			} else if ( elem[i].nodeType ) {
				fragment.appendChild( elem[i] );
			};
		};

		// if a selector is set append children and return
		if ( selector ) {
			selector.appendChild( fragment );
			return selector;
		};

		// otherwise return children of fragment
		return fragment.childNodes;
	};

	$.jqml = function( arg ) {

		// return new jQuery object of elements
		return $( createObj( arg ) );
	};
})( jQuery, document );
