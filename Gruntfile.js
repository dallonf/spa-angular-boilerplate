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
        options: { livereload: false }
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
      build: './build'
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
      js: {
        files: [{
          expand: true,
          cwd: 'public/js',
          src: '**',
          dest: 'build/js/'
        }]
      },
      vendor: {
        files: [{
          expand: true,
          cwd: 'public/vendor',
          src: '**',
          dest: 'build/vendor/'
        }]
      },
      templates: {
        files: [{
          expand: true,
          cwd: 'public/templates',
          src: '**',
          dest: 'build/templates/'
        }]
      }
    }
  });

  grunt.registerTask('build', [
    'clean:build',
    'less:development',
    'copy:css',
    'copy:img',
    'copy:js',
    'copy:vendor',
    'copy:templates',
    'build-ejs'
  ]);

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.registerTask('build-ejs', "Builds index.ejs into index.html", function() {
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