var fs = require('fs'),
    Q = require('q'),
    path = require('path');

module.exports = function(dirsConfig, basedir) {
  // TODO: Make this asynchronous
  // TODO: Make this recursive
  var jsFiles = [];

  var dirQueue = [];

  dirsConfig.forEach(function(dirConfig) {
    dirQueue.push({
      dirConfig: dirConfig,
      dirPath: path.join(basedir, dirConfig.dir)
    });
  });

  var nextInQueue = function() {
    var next = dirQueue.shift();
    if (next) {
      var dirConfig = next.dirConfig;
      var dirPath = next.dirPath;

      var files = fs.readdirSync(dirPath);

      var firstFiles = dirConfig.first.map(function(filename) {
        return dirConfig.dir + '/' + filename;
      });
      var dirFiles = [];
      var lastFiles = dirConfig.last.map(function(filename) {
        return dirConfig.dir + '/' + filename;
      });

      files.forEach(function(file) {
        var fullFilePath = path.join(dirPath, file);
        var stats = fs.statSync(fullFilePath);
        if (stats.isDirectory()) {
          dirQueue.push({
            dirConfig: dirConfig,
            dirPath: fullFilePath
          });
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

      dirFiles.sort();

      jsFiles = jsFiles.concat(firstFiles, dirFiles, lastFiles);

      nextInQueue();
    }
  };

  nextInQueue();

  return jsFiles;
};