var fs = require('fs'),
    Q = require('q'),
    path = require('path');

module.exports = function(dirsConfig, basedir) {
  // TODO: Make this asynchronous
  // TODO: Make this recursive
  var jsFilesNested = [];

  var dirQueue = [];

  dirsConfig.forEach(function(dirConfig) {
    var jsFiles = [];

    var firstFiles = dirConfig.first.map(function(filename) {
      return dirConfig.dir + '/' + filename;
    });
    var lastFiles = dirConfig.last.map(function(filename) {
      return dirConfig.dir + '/' + filename;
    });

    jsFilesNested.push(firstFiles);
    jsFilesNested.push(jsFiles);
    jsFilesNested.push(lastFiles);

    dirQueue.push({
      dirConfig: dirConfig,
      dirPath: path.join(basedir, dirConfig.dir),
      jsFiles: jsFiles
    });
  });

  var nextInQueue = function() {
    var next = dirQueue.shift();
    if (next) {
      var dirConfig = next.dirConfig;
      var dirPath = next.dirPath;
      var jsFiles = next.jsFiles;

      var files = fs.readdirSync(dirPath);

      var dirFiles = [];

      files.forEach(function(file) {
        var fullFilePath = path.join(dirPath, file);
        var stats = fs.statSync(fullFilePath);
        if (stats.isDirectory()) {
          dirQueue.push({
            dirConfig: dirConfig,
            dirPath: fullFilePath,
            jsFiles: jsFiles
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

      Array.prototype.push.apply(jsFiles, dirFiles);

      nextInQueue();
    }
  };

  nextInQueue();

  var jsFiles = [];
  jsFilesNested.forEach(function(files) {
    Array.prototype.push.apply(jsFiles, files);
  });

  return jsFiles;
};