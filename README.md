# grunt-kango-manifest

> get scripts file list from kango_extension.json to handle, and initialize the grunt configuration appropriately, and automatically. then replaces references to non-optimized scripts into the transformed background scripts. and auto increment build version in extension_info.json.

Watch out, this task is designed for Grunt 0.4 and upwards.

## Getting Started
If you haven't used [grunt][] before, be sure to check out the [Getting Started][] guide, as it explains how to create a [gruntfile][Getting Started] as well as install and use grunt plugins. Once you're familiar with that process, install this plugin with this command:

```shell
npm install grunt-kango-manifest --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-kango-manifest');
grunt.registerTask('default', ['kangoManifest:dist']);
```


[grunt]: http://gruntjs.com/
[Getting Started]: https://github.com/gruntjs/grunt/blob/devel/docs/getting_started.md

## Documentation

### Example usage
```javascript
kangoManifest: {
  dist: {
    options: {
      buildnumber: true,
      background: 'scripts/background.js'
    },
    src: 'app',
    dest: 'dist'
  }
};
```

### Config

#### src
**Required**
Type: 'String'

Base directory where the origin source files

#### dest
**Required**
Type: 'String'

Base directory where the transformed files should be output.

### Options
#### buildnumber
Type: 'Boolean'

Flag of auto-increment build number.

#### background
Type: 'String'

Relative path of the transformed background script.

## Tests

Grunt currently doesn't have a way to test tasks directly. You can test this task by running `grunt` and manually verify that it works.

## License

[BSD license](http://opensource.org/licenses/bsd-license.php) and copyright Google
