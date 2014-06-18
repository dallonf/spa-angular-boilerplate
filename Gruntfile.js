require('shelljs/global');

module.exports = function(grunt) {
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
        tasks: ['less:dev'],
        options: { livereload: false }
      },
      css: {
        files: 'public/css/**/*.css'
      },
      server: {
        files: ['dev.js', 'lib/**/*.js'],
        tasks: ['express:dev'],
        options: {
          spawn: false
        }
      }
    },

    less: {
      dev: {
        files: {
          'public/css/stylesheet.css': 'public/less/**/*.less'
        }
      },
      build: {
        options: {
          cleancss: true
        },
        files: {
          'build/css/stylesheet.css': 'public/less/**/*.less'
        }
      }
    },

    clean: {
      build: 'build',
      tmp: ['tmp', '.tmp'],
      buildJs: ['build/js', 'build/vendor/**/*.js', 'build/vendor/polyfills', '!build/vendor/modernizr-2.6.2.min.js'],
      buildCss: ['build/css']
    },

    copy: {
      css: {
        files: [{
          expand: true,
          cwd: 'public/css',
          src: ['**', '!stylesheet.css'],
          dest: 'build/css/'
        }]
      },
      img: {
        files: [{
          expand: true,
          cwd: 'public/img',
          src: '**',
          dest: 'build/img/'
        }]
      },
      js: {
        files: [{
          expand: true,
          cwd: 'public',
          src: ['js/**', 'vendor/**'],
          dest: 'build/'
        }]
      },
      templates: {
        files: [{
          expand: true,
          cwd: 'public/templates',
          src: '**',
          dest: 'build/templates/'
        }]
      },
      misc: {
        files: [{
          expand: true,
          cwd: 'public',
          src: '*',
          dest: 'build',
          filter: 'isFile'
        }]
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

    ngtemplates: {
      'my-app': {
        cwd: 'public',
        src: 'templates/**.html',
        dest: 'build/js/_templates.js',
        options: {
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
        }
      }
    },

    express: {
      dev: {
        options: {
          script: 'dev.js'
        }
      }
    },

    open: {
      dev: { path: 'http://127.0.0.1:3000' }
    },

    wiredep: {
      target: {
        src: 'index.ejs',
        fileTypes: {
          ejs: {
            block: /(([ \t]*)<!--\s*bower:*(\S*)\s*-->)(\n|\r|.)*?(<!--\s*endbower\s*-->)/gi,
            detect: {
              js: /<script.*src=['"](.+)['"]>/gi,
              css: /<link.*href=['"](.+)['"]/gi
            },
            replace: {
              js: '<script src="{{filePath}}"></script>',
              css: '<link rel="stylesheet" href="{{filePath}}" />'
            }
          }
        }
      }
    }
  });

  grunt.registerTask('default', [
    'express:dev',
    'less:dev',
    'open:dev',
    'watch'
  ]);

  grunt.registerTask('build', [
    'clean:build',

    'copy:css',
    'less:build',
    'copy:img',
    'copy:js',
    'copy:misc',

    'buildEjs',
    'useminPrepare',
    'ngtemplates',
    'concat',
    'clean:buildJs',
    'clean:buildCss',
    'uglify',
    'cssmin',
    'filerev',
    'usemin',

    'clean:tmp'
  ]);

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-filerev');
  grunt.loadNpmTasks('grunt-usemin');
  grunt.loadNpmTasks('grunt-angular-templates');
  grunt.loadNpmTasks('grunt-express-server');
  grunt.loadNpmTasks('grunt-open');
  grunt.loadNpmTasks('grunt-wiredep');

  grunt.registerTask('buildEjs', "Builds index.ejs into build/index.html", function() {
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
    })
  });
};