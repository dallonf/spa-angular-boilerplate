var fs = require('fs'),
    Q = require('q'),
    path = require('path');

module.exports = function(dirsConfig, basedir) {
  // TODO: Make this asynchronous
  var jsFiles = [];
  dirsConfig.forEach(function(dirConfig) {
    var dirPath = path.join(basedir, dirConfig.dir);
    var files = fs.readdirSync(dirPath);
    files.forEach(function(file) {
      var fullFilePath = path.join(dirPath, file)
      jsFiles.push(path.relative(basedir, fullFilePath));
    });
  });

  jsFiles = jsFiles.map(function(filepath) {
    return filepath.split(path.sep).join('/');
  });

  return jsFiles;
};