require('shelljs/global');

module.exports = function(grunt) {
  var bacon = require('bacon-grunt')(grunt);
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    watch: {
      options: {
        livereload: true
      },
      Gruntfile: {
        files: 'Gruntfile.js',
        options: { livereload: false }
      },
      js: {
        files: 'public/js/**/*.js'
      },
      html: {
        files: ['index.ejs', 'public/templates/**/*.html']
      },
      less: {
        files: 'public/less/**/*.less',
        tasks: ['less:dev', 'autoprefixer:dev'],
        options: { livereload: false }
      },
      css: {
        files: 'public/css/**/*.css'
      },
      server: {
        files: ['dev.js', 'lib/**/*.js', 'js-dirs.json'],
        tasks: ['express:dev'],
        options: {
          spawn: false
        }
      }
    },

    useminPrepare: {
      html: 'build/index.html',
      options: {
        dest: 'build'
      }
    },
    usemin: {
      html: 'build/index.html'
    },

    filerev: {
      appJs: {
        src: 'build/js/app.js'
      },
      css: {
        src: 'build/css/stylesheet.css'
      }
    },

    express: {
      dev: {
        options: {
          script: 'dev.js'
        }
      }
    },

    exec: {
      bowerInstallPackage: {
        cmd: function(packageName) {
          return 'bower install ' + packageName + ' --save';
        }
      }
    }
  });

  bacon.task('default', [
    'express:dev',
    bacon.subtask('open', { path: 'http://127.0.0.1:3000' }),
    'watch'
  ]);

  bacon.task('dev', [
    'devStylesheets'
  ]);

  bacon.task('devStylesheets', [
    bacon.subtask('less', {
      files: { 'public/css/stylesheet.css': 'public/less/stylesheet.less' }
    }),
    bacon.subtask('autoprefixer', {
      files: { 'public/css/stylesheet.css': 'public/css/stylesheet.css' }
    })
  ]);

  bacon.task('bower', [
    bacon.subtask('exec', 'bower install'),
    bacon.subtask('copy:tmpHtml', {
      files: { 'public/index.ejs.html': 'index.ejs' }
    }),
    bacon.subtask('wiredep', {
      src: 'public/index.ejs.html'
    }),
    bacon.subtask('copy:tmpHtmlBack', {
      files: { 'index.ejs': 'public/index.ejs.html' }
    }),
    bacon.subtask('clean:tmpHtml', 'public/index.ejs.html')
  ]);

  grunt.registerTask('bowerAdd', function(packageName) {
    if (!packageName) {
      grunt.warn("You must specify a package name!");
    }
    grunt.task.run('exec:bowerInstallPackage:' + packageName, 'bower');
  });

  bacon.task('build', [
    bacon.subtask('clean', 'build'),

    bacon.subtask('copy:bowerComponents',
      bacon.globFiles('public/bower_components/**', 'build/bower_components')
    ),
    bacon.subtask('copy:css', {
      expand: true,
      cwd: 'public/css',
      src: ['**', '!stylesheet.css'],
      dest: 'build/css/'
    }),
    bacon.subtask('less', {
      files: { 'build/css/stylesheet.css': 'public/less/stylesheet.less' }
    }, {
      cleancss: true
    }),
    bacon.subtask('autoprefixer', {
      files: { 'build/css/stylesheet.css': 'build/css/stylesheet.css' }
    }),
    bacon.subtask('copy:img',
      bacon.globFiles('public/img/**', 'build/img')
    ),
    bacon.subtask('copy:js', {
      expand: true,
      cwd: 'public',
      src: ['js/**', 'vendor/**'],
      dest: 'build/'
    }),
    bacon.subtask('copy:misc',
      bacon.globFiles('public/*', 'build', { filter: 'isFile' })
    ),

    bacon.subtask('ngAnnotate',
      bacon.globFiles('build/js/**/*.js', 'build/js')
    ),
    bacon.subtaskCustom('indexEjs', function() {
      var scanJs = require('./lib/scanner/scanjs');
      var ejs = require('ejs');
      var jsDirs = require('./js-dirs');

      var done = this.async();

      grunt.log.writeln('Scanned JavaScript');
      scanJs(jsDirs, 'public').then(function(jsFiles) {
        ejs.render(cat('index.ejs'), {scripts: jsFiles}).to('build/index.html');
        grunt.log.writeln('Rendered index.html');
      }).then(function() {
        done();
      }, function(err) {
        done(err);
      });
    }),
    'useminPrepare',
    bacon.subtask('ngtemplates', {
      cwd: 'public',
      src: 'templates/**/*.html',
      dest: 'build/js/_templates.js'
    }, {
      module: 'my-app',
      htmlmin: {
        collapseBooleanAttributes:      false,
        collapseWhitespace:             true,
        removeAttributeQuotes:          true,
        removeComments:                 true,
        removeEmptyAttributes:          false,
        removeRedundantAttributes:      true,
        removeScriptTypeAttributes:     true,
        removeStyleLinkTypeAttributes:  true
      },
      usemin: 'build/js/app.js'
    }),
    'concat', // usemin
    bacon.subtask('clean:js', ['build/js', 'build/vendor/**/*.js', '!build/vendor/modernizr-2.6.2.min.js']),
    bacon.subtask('clean:css', 'build/css'),
    bacon.subtask('clean:bowerComponents', 'build/bower_components'),
    'uglify', // usemin
    'cssmin', // usemin
    'filerev',
    'usemin',

    bacon.subtask('clean:tmp', ['tmp', '.tmp'])
  ]);
};