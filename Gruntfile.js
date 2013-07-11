'use strict';
module.exports = function(grunt) {
  grunt.initConfig({
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: [
        'Gruntfile.js',
        'lib/*.js',
        'tasks/*.js',
        'test/**/*.js',
        '!test/temp/scripts/*.js',
      ]
    },
    mochacli: {
      options: {
        require: ['should'],
        reporter: 'spec',
        bail: true
      },
      all: ['test/test-*.js']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-mocha-cli');
  grunt.loadTasks('tasks');

  grunt.registerTask('default', ['jshint', 'mochacli']);
};