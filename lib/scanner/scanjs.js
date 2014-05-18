var fs = require('fs'),
    Q = require('q'),
    path = require('path');

module.exports = function(dirsConfig, basedir) {
  // TODO: Make this asynchronous
  // TODO: Make this recursive
  var jsFilesNested = [];

  var dirQueue = [];

  var scanFolder = function(dirConfig, dirPath) {
    var files = fs.readdirSync(dirPath);

    var dirFiles = [];

    files.forEach(function(file) {
      var fullFilePath = path.join(dirPath, file);
      var stats = fs.statSync(fullFilePath);
      if (stats.isDirectory()) {
        Array.prototype.push.apply(dirFiles, scanFolder(dirConfig, fullFilePath));
      } else if (path.extname(file) === '.js') {
        var filepath = path.relative(basedir, fullFilePath);
        var relativeFilepath = path.relative(dirConfig.dir, filepath);
        filepath = filepath.split(path.sep).join('/');
        if (dirConfig.exclude.indexOf(relativeFilepath) === -1 &&
          dirConfig.first.indexOf(relativeFilepath) === -1 &&
          dirConfig.last.indexOf(relativeFilepath) === -1) {
          dirFiles.push(filepath);
        }
      }
    });

    return dirFiles;
  };

  dirsConfig.forEach(function(dirConfig) {
    var firstFiles = dirConfig.first.map(function(filename) {
      return dirConfig.dir + '/' + filename;
    });
    var lastFiles = dirConfig.last.map(function(filename) {
      return dirConfig.dir + '/' + filename;
    });

    jsFilesNested.push(firstFiles);
    jsFilesNested.push(scanFolder(dirConfig, path.join(basedir, dirConfig.dir)));
    jsFilesNested.push(lastFiles);
  });

  var jsFiles = [];
  jsFilesNested.forEach(function(files) {
    Array.prototype.push.apply(jsFiles, files);
  });

  return jsFiles;
};