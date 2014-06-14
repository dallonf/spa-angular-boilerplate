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
        tasks: ['less'],
        options: { livereload: false, atBegin: true }
      },
      css: {
        files: 'public/css/**/*.css'
      }
    },

    less: {
      development: {
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
    }
  });

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