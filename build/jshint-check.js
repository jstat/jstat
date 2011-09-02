var JSHINT = require("./lib/jshint").JSHINT,
	print = require("sys").print,
	src = require("fs").readFileSync("dist/jstat.js", "utf8");

JSHINT( src, {
	browser: true,
	curly : false,
	eqnull : true,
	forin : true,
	laxbreak : true,
	maxerr : 10000,
	newcap : false,
	undef : true
});

var ok = {
	"The body of a for in should be wrapped in an if statement to filter unwanted properties from the prototype." : true,
	"Unnecessary semicolon." : true,
	"Don't make functions within a loop." : true
};

var e = JSHINT.errors, found = 0, w;

for ( var i = 0; i < e.length; i++ ) {
	w = e[i];

	if ( !ok[ w.reason ]){
		found++;
		print( "\n" + w.evidence + "\n" );
		print( "    Problem at line " + w.line + " character " + w.character + ": " + w.reason );
	};
}

if ( found > 0 ) {
	print( "\n" + found + " Error(s) found.\n" );

} else {
	print( "JSHint check passed.\n" );
}
