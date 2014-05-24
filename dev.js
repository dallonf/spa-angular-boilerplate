var express = require('express'),
    path = require('path'),
    ejs = require('ejs'),
    fs = require('fs'),
    path = require('path'),
    Q = require('q'),

    jsDirs = require('./js-dirs'),

    scanJs = require('./lib/scanner/scanjs'),

    port = 3000 || process.env['PORT']
    app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res, next) {
  var indexQ = Q.ninvoke(fs, 'readFile', path.join(__dirname, 'index.ejs'), 'utf-8');
  var jsFilesQ = scanJs(jsDirs, path.join(__dirname, 'public'));
  Q.spread([indexQ, jsFilesQ], function(index, jsFiles) {
    try {
      res.send(ejs.render(index, {scripts: jsFiles}));  
    } catch (ex) {
      next(ex);
    }
  }, function(err) {
    next(err);
  });
});

app.listen(port, function() {
  console.log("Dev server listening on localhost:" + port);  
});