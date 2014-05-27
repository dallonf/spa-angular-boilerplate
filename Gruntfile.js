module.exports = function(grunt) {
  grunt.initConfig({
    watch: {
      options: {
        livereload: true
      },
      js: {
        files: ['./public/js/**/*.js']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
};