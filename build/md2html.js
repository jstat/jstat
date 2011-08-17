var print = require( 'sys' ).print,
	//src = require("fs").readFileSync("dist/jstat.js", "utf8"),
	fs = require( 'fs' ),
	dir = fs.readdirSync( 'doc/md' ),
	toHTML = require( './lib/markdown' ).toHTML,
	header = '', footer = '', all = '';

header += '<!doctype html>\n';
header += '<html lang="en">\n';
header += '<head>\n';
header += '	<meta charset="UTF-8">\n';
header += '	<title>jStat Documentation</title>\n';
header += '</head>\n';
header += '<body>\n';

footer += '</body>\n';
footer += '</html>';


all = header;
dir.forEach(function( item, idx ) {
	all += toHTML( fs.readFileSync( 'doc/md/' + item, 'utf8' ));
});
all += footer

fs.writeFileSync( 'doc/all.html', all, 'utf8' );
