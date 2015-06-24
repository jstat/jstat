/*
	Build jStat
*/

var fs = require("fs");
var path = require("path");
var mkdirp = require('mkdirp');

var file_names = ["./src/core.js", "./src/vector.js", "./src/special.js",
                  "./src/distribution.js", "./src/linearalgebra.js", "./src/test.js"];
var files = [];

mkdirp('dist', function(err) {
  if(err) {
    console.error(err)
  }
});

for(var i = 0; i < file_names.length; i++) {
  files.push(fs.readFileSync(file_names[i]));
}

fs.writeFileSync('./dist/jstat.js', Buffer.concat(files));

