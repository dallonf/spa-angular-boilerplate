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
      }
    },

    clean: {
      build: 'build',
      tmp: ['tmp', '.tmp']
    },

    copy: {
      css: {
        files: [{
          expand: true,
          cwd: 'public/css',
          src: '**',
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
      jsTmp: {
        files: [{
          expand: true,
          cwd: 'public/js',
          src: '**',
          dest: 'tmp/js/'
        }]
      },
      appJs: {
        files: [{
          src: 'tmp/js/app.js',
          dest: 'build/js/app.js'
        }]
      },
      modernizr: {
        files: [{
          src: 'tmp/vendor/modernizr-2.6.2.min.js',
          dest: 'build/vendor/modernizr-2.6.2.min.js'
        }]
      },
      vendorTmp: {
        files: [{
          expand: true,
          cwd: 'public/vendor',
          src: '**',
          dest: 'tmp/vendor/'
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
      html: {
        files: [{
          src: 'tmp/index.html',
          dest: 'build/index.html'
        }]
      }
    },

    useminPrepare: {
      html: 'tmp/index.html',
      options: {
        dest: 'tmp'
      }
    },
    usemin: {
      html: 'tmp/index.html'
    }
  });

  grunt.registerTask('build', [
    'clean:build',

    'copy:jsTmp',
    'copy:vendorTmp',
    'buildEjs',
    'useminPrepare',
    'concat',
    'uglify',
    'usemin',

    'less:development',
    'copy:css',
    'copy:img',
    'copy:appJs',
    'copy:modernizr',
    'copy:templates',
    'copy:html',
    
    'clean:tmp'
  ]);

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-usemin');

  grunt.registerTask('buildEjs', "Builds index.ejs into tmp/index.html", function() {
    var scanJs = require('./lib/scanner/scanjs');
    var ejs = require('ejs');
    var jsDirs = require('./js-dirs');

    var done = this.async();

    grunt.log.writeln('Scanned JavaScript');
    scanJs(jsDirs, 'public').then(function(jsFiles) {
      ejs.render(cat('index.ejs'), {scripts: jsFiles}).to('tmp/index.html');
      grunt.log.writeln('Rendered index.html');
    }).then(function() {
      done();
    }, function(err) {
      done(err);
    })
  });
};