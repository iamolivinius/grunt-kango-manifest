'use strict';

var path = require('path');

module.exports = function(grunt) {

  var _ = grunt.util._;

  grunt.registerMultiTask('kangoManifest', '', function() {
    var options = this.options({
      buildnumber: false,
      background: 'background.js',
      uglify: 'uglify',
      cssmin: 'cssmin',
      indentSize: 4
    });

    this.files.forEach(function(file) {
      var src = file.src[0];
      var dest = file.dest;
      var manifest = grunt.file.readJSON(path.join(src, 'extension_info.json'));
      var background = path.join(dest, options.background);
      var concat = grunt.config('concat') || {};
      var uglify = grunt.config(options.uglify) || {};
      var cssmin = grunt.config(options.cssmin) || {};
      var buildnumber = manifest.version.split('.');

      // update concat config for scripts in background field.
      concat.background = {
        src: [],
        dest: background
      };

      _.each(manifest.background_scripts, function(script) {
        concat.background.src.push(path.join(src, script));
      });

      // update uglify config for concated background.js.
      uglify[background] = background;

      // update uglify and css config for content scripts field.
      _.each(manifest.content_scripts, function(contentScript) {
        // _.each(contentScript.js, function (js) {
        uglify[path.join(dest, contentScript)] = path.join(src, contentScript);
        // });

        // _.each(contentScript.css, function (css) {
        //   cssmin[path.join(dest, css)] = path.join(src, css);
        // });
      });

      // update grunt configs.
      grunt.config('concat', concat);
      grunt.config(options.cssmin, cssmin);
      grunt.config(options.uglify, uglify);

      // set updated build number to manifest on dest.
      if (options.buildnumber) {
        var versionUp = function(numbers, index) {
          if (!numbers[index]) {
            throw 'Build number overflow.' + numbers;
          }
          if (numbers[index] + 1 <= 65535) {
            numbers[index]++;
            return numbers.join('.');
          } else {
            versionUp(numbers, ++index);
          }
        };
        manifest.version = versionUp(buildnumber, buildnumber.length - 1);
        grunt.file.write(path.join(src, 'extension_info.json'), JSON.stringify(manifest, null, options.indentSize));
      }

      // set updated background script list to manifest on dest.
      manifest.background_scripts = [options.background];

      // write updated manifest to dest path
      grunt.file.write(path.join(dest, 'extension_info.json'), JSON.stringify(manifest, null, options.indentSize));
    });
  });
};