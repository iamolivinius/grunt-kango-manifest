'use strict';
var path = require('path');
var assert = require('assert');
var grunt = require('grunt');
var rimraf = require('rimraf');
var mkdirp = require('mkdirp');

grunt.task.init([]);
grunt.config.init({});

var opts = grunt.cli.options;
opts.redirect = !opts.silent;

var directory = function directory(dir) {
  return function directory(done) {
    process.chdir(__dirname);
    rimraf(dir, function(err) {
      if (err) {
        return done(err);
      }
      mkdirp(dir, function(err) {
        if (err) {
          return done(err);
        }
        process.chdir(dir);
        done();
      });
    });
  };
};

var _ = grunt.util._;

describe('chrome', function() {

  before(directory('temp'));

  var targets = {
    dist: {
      options: {
        background: 'scripts/background.js'
      },
      src: 'app',
      dest: 'dist'
    }
  };

  it('should update the configs and extension_info.json', function() {
    var concat, uglify, cssmin, manifest;
    var target = targets.dist;
    var src = target.src;
    var dest = target.dest;
    var background = path.join(dest, target.options.background || 'background.js');

    grunt.file.copy(path.join(__dirname, 'fixtures/extension_info.json'), 'app/extension_info.json');
    grunt.log.muted = true;
    grunt.config.init();
    grunt.config('kangoManifest', {
      dist: target
    });
    grunt.task.run('kangoManifest:dist');
    grunt.task.start();

    concat = grunt.config('concat');
    uglify = grunt.config('uglify');
    cssmin = grunt.config('cssmin');
    manifest = grunt.file.readJSON(path.join(src, 'extension_info.json'));

    // check concat and uglify list on background scripts.
    _.each(concat.background.src, function(script, i) {
      assert.equal(concat.background.src[i], path.join(src, manifest.background_scripts[i]));
    });
    assert.equal(concat.background.dest, background);
    assert.ok(uglify[background]);
    assert.equal(uglify[background], background);

    // check cssmin and uglify list on contents scripts.
    for (var cs = 0, max = manifest.content_scripts.length; cs < max; ++cs) {
      var file; // i, maxChild;
      // for (i = 0, maxChild = manifest.content_scripts[cs].js.length; i < maxChild; ++i) {
      // file = 'scripts/contentscript-' + parseInt(cs, 10) + parseInt(i, 10) + '.js';
      file = 'content.js';
      assert.ok(uglify[path.join(dest, file)]);
      assert.equal(uglify[path.join(dest, file)], path.join(src, file));
      // }

      // for (i = 0, maxChild = manifest.content_scripts[cs].css.length; i < maxChild; ++i) {
      //   file = 'styles/contentstyle-' + parseInt(cs, 10) + parseInt(i, 10) + '.css';
      //   assert.ok(cssmin[path.join(dest, file)]);
      //   assert.equal(cssmin[path.join(dest, file)], path.join(src, file));
      // }
    }

    // check updated manifest.json
    manifest = grunt.file.readJSON(path.join(dest, 'extension_info.json'));
    assert.ok(manifest);
    assert.ok(manifest.background_scripts);
    assert.ok(manifest.background_scripts.length > 0);
    assert.equal(manifest.background_scripts[0], target.options.background || 'background.js');

  });

  it('should update the buildnumber', function() {
    var target = targets.dist;

    grunt.file.copy(path.join(__dirname, 'fixtures/extension_info.json'), 'app/extension_info.json');
    grunt.log.muted = false;
    grunt.config.init();
    target.options.buildnumber = true;
    grunt.config('kangoManifest', {
      dist: target
    });
    grunt.task.run('kangoManifest:dist');
    grunt.task.start();

    var manifest = grunt.file.readJSON(path.join(target.src, 'extension_info.json'));
    assert.equal(manifest.version, '1.2.1');
  });

});