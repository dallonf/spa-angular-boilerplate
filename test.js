var scanjs = require('./lib/scanner/scanjs'),
    path = require('path');

scanjs(require('./js-dirs'), path.join(__dirname, 'public'), function(err, files) {
  if (err) {
    console.error(err);
    return;  
  }
  
  console.log(files);
});