var scanjs = require('./lib/scanner/scanjs'),
    path = require('path');

var files = scanjs(require('./js-dirs'), path.join(__dirname, 'public'));

console.log(files);