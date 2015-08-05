'use strict';

module.exports = function (grunt) {
  require('jit-grunt')(grunt);

  require('matchdep').filterAll('grunt-*').forEach(grunt.loadNpmTasks);

  var lessifyOptions = {
    compress: false,
    yuicompress: true,
    optimization: 2,
    sourceMap: true,
    sourceMapFileInline: true,
    plugins: [
      new (require('less-plugin-autoprefix'))({browsers: ["last 2 versions"]})
    ]
  };

  grunt.initConfig({
    //less: {
    //  development: {
    //    options: {
    //      compress: false,
    //      yuicompress: true,
    //      optimization: 2,
    //      sourceMap: true,
    //      sourceMapFileInline: true
    //    },
    //    plugins: [
    //      new (require('less-plugin-autoprefix'))({browsers: ["last 2 versions"]})
    //    ],
    //    files: {
    //      "build/style.css": "styles/main.less"
    //    }
    //  }
    //},

    flow: {
      options: {
        style: 'color'
      }
    },

    browserify: {
      dev: {
        options: {
          browserifyOptions: {
            debug: true
          },
          transform: [
            ['node-lessify', lessifyOptions],
            ['babelify'],
            ['livereactload', {global: true, preventCache: false}]
          ]
        },
        src: './index.js',
        dest: 'build/bundle.js'
      },
      production: {
        options: {
          transform: [
            ['node-lessify', lessifyOptions],
            ['babelify'],
            ['uglifyify', {global: true}]
          ],
          browserifyOptions: {
            debug: false
          }
        },
        src: '<%= browserify.dev.src %>',
        dest: '<%= browserify.dev.dest %>'
      }
    },

    watch: {
      browserify: {
        files: ['scripts/**/*', 'styles/*.less'],
        tasks: ['browserify:dev']
      }
    },

    concurrent: {
      dev: {
        tasks: [
          'nodemon',                  // start server
          'shell:bundleMonitoring',   // start monitoring bundle changes
          'watch'            // start watchify
        ],
        options: {
          logConcurrentOutput: true
        }
      }
    },

    nodemon: {
      dev: {
        script: 'server.js'
      }
    },

    shell: {
      bundleMonitoring: {
        command: 'node_modules/.bin/livereactload monitor build/bundle.js'
      }
    },

    jest: {
      options: {
        coverage: false,
        config: './jest.config.json'
      }
    },

    jasmine_node: {
      options: {
        forceExit: true,
        match: '.',
        matchall: false,
        extensions: 'js',
        specNameMatcher: 'spec'
      },
      all: ['spec/']
    },

    jshint: {
      all: ['Gruntfile.js', 'scripts/**/*'],
      options: {
        jshintrc: true,
        reporter: require('jshint-stylish')
      }
    }
  });

  grunt.registerTask('test', ['jasmine_node']);
  grunt.registerTask('default', ['browserify:dev', 'concurrent']);
  grunt.registerTask('package', ['browserify:production', 'test']);
};
