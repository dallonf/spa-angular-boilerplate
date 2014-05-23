var fs = require('fs'),
    Q = require('q'),
    path = require('path');

/**
Scans the provided directories for JavaScript files

dirsConfig: [{
  dir: String, // A directory name to scan recursively (relative to basedir)
  first: [String], // Include these files (relative to dir) in order before any other scanned files
  exclude: [String], // Ignore these files (relative to dir) entirely
  last: [String] // Include these files (relative to dir) in order after any other scanned files
}]

basedir: String
Outputted filepaths will be relative to this directory. It should usually be your public folder.

callback: function(error, files: [String])

returns: Promise of [String] files

Example usage: 
scanJs([{
  "dir": "vendor",
  "first": ["lib.js"],
  "exclude": ["browser-specific-polyfill.js"],
  "last": []
}, {
  "dir": "js",
  "first": [],
  "exclude": [],
  "last": ["main.js"]
}], __dirname, function(err, files) {
  if (err) throw err;
  console.log(files); 
  // ['vendor/lib.js', 'vendor/another-lib.js', 'js/dir1/file1.js', 'js/dir2/file2.js', 'js/main.js'];
});
**/
module.exports = function scanJs(dirsConfig, basedir, callback) {
  var jsFilesNestedQ = [];

  dirsConfig.forEach(function(dirConfig) {
    var firstFiles = dirConfig.first.map(function(filename) {
      return dirConfig.dir + '/' + filename;
    });
    var lastFiles = dirConfig.last.map(function(filename) {
      return dirConfig.dir + '/' + filename;
    });

    jsFilesNestedQ.push(firstFiles);
    jsFilesNestedQ.push(scanFolder(dirConfig, basedir, path.join(basedir, dirConfig.dir)));
    jsFilesNestedQ.push(lastFiles);
  });

  Q.all(jsFilesNestedQ).then(function(jsFilesNested) {
    var jsFiles = flattenArray(jsFilesNested);

    callback(null, jsFiles);
    return jsFiles;
  }, function(err) {
    callback(err);
    throw err;
  });
};

function flattenArray(array) {
  var result = [];
  array.forEach(function(item) {
    if (Array.isArray(item)) {
      Array.prototype.push.apply(result, flattenArray(item));
    } else {
      result.push(item);
    }
  });
  return result;
}

function scanFolder(dirConfig, basedir, dirPath) {
  var filesQ = Q.ninvoke(fs, 'readdir', dirPath);

  return filesQ.then(function(files) {
    return Q.all(files.map(function(f) {
      var fullFilePath = path.join(dirPath, f);
      return Q.ninvoke(fs, 'stat', fullFilePath).then(function(stat) {
        return {
          path: f,
          fullFilePath: fullFilePath,
          stat: stat
        };
      });
    }));
  }).then(function(files) {
    var dirFiles = [];

    files.forEach(function(file) {
      var fullFilePath = file.fullFilePath;
      var stat = file.stat;
      if (stat.isDirectory()) {
        dirFiles.push(scanFolder(dirConfig, basedir, fullFilePath));
      } else if (path.extname(file.path) === '.js') {
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
    return Q.all(dirFiles);
  });  
}