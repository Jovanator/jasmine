module.exports = function(grunt) {
  var pkg = require("./package.json");
  global.jasmineVersion = pkg.version;

  grunt.initConfig({
    pkg: pkg,
    jshint: require('./grunt/config/jshint.js'),
    concat: require('./grunt/config/concat.js'),
    compass: require('./grunt/config/compass.js'),
    compress: require('./grunt/config/compress.js')
  });

  require('load-grunt-tasks')(grunt);

  grunt.loadTasks('grunt/tasks');

  grunt.registerTask('default', ['jshint:all']);

  var version = require('./grunt/tasks/version.js');
  var standaloneBuilder = require('./grunt/tasks/build_standalone.js');

  grunt.registerTask('build:copyVersionToGem',
    "Propagates the version from package.json to version.rb",
    version.copyToGem);

  grunt.registerTask('buildDistribution',
    'Builds and lints jasmine.js, jasmine-html.js, jasmine.css',
    [
      'compass',
      'jshint:beforeConcat',
      'concat',
      'jshint:afterConcat',
      'build:copyVersionToGem'
    ]
  );

  grunt.registerTask("execSpecsInNode",
    "Run Jasmine core specs in Node.js",
    function() {
      var exit_code = require("shelljs").exec("jasmine");
      if (exit_code !== 0) {
        grunt.fail.fatal("Specs Failed", exit_code);
      }
    }
  );

  grunt.registerTask("execSpecsInNode:performance",
    "Run Jasmine performance specs in Node.js",
    function() {
      require("shelljs").exec("JASMINE_JSON=spec/support/jasmine-performance.json jasmine");
    }
  );
};
