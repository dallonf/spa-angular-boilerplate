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
        files: './public/js/**/*.js'
      },
      html: {
        files: ['./index.ejs', './public/templates/**/*.html']
      },
      less: {
        files: './public/less/**/*.less',
        tasks: ['less'],
        options: { livereload: false }
      },
      css: {
        files: './public/css/**/*.css'
      }
    },
    less: {
      development: {
        files: {
          './public/css/stylesheet.css': './public/less/**/*.less'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-less');
};