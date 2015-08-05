'use strict';

module.exports = function (grunt) {
  require('jit-grunt')(grunt);
  require('matchdep').filterAll('grunt-*').forEach(grunt.loadNpmTasks);
  var webpack = require("webpack");
  var webpackConfig = require("./webpack.config.js");

  grunt.initConfig({
    less: {
      development: {
        options: {
          compress: false,
          yuicompress: true,
          optimization: 2,
          sourceMap: true,
          sourceMapFileInline: true
        },
        plugins: [
          new (require('less-plugin-autoprefix'))({browsers: ["last 2 versions"]})
        ],
        files: {
          "build/style.css": "styles/main.less"
        }
      }
    },

    flow: {
      options: {
        style: 'color'
      }
    },

    webpack: {
      options: webpackConfig,

      dev: {
        plugins: webpackConfig.plugins.concat(
          new webpack.DefinePlugin({
            "process.env": {
              "NODE_ENV": JSON.stringify("development")
            }
          })
        ),

        devtool: "#inline-source-map",

        debug: true,

        watch: true, // use webpacks watcher
        // You need to keep the grunt process alive

        keepAlive: true,

        progress: true, // Don't show progress
        // Defaults to true
      },

      production: {
        progress: true, // Don't show progress
        // Defaults to true

        plugins: webpackConfig.plugins.concat(
          new webpack.DefinePlugin({
            "process.env": {
              // This has effect on the react lib size
              "NODE_ENV": JSON.stringify("production")
            }
          }),
          new webpack.optimize.DedupePlugin(),
          new webpack.optimize.UglifyJsPlugin()
        )
      }
    },

    "webpack-dev-server": {
      options: webpackConfig,
      dev: {
        hot: true,
        keepAlive: true
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
  grunt.registerTask('default', ['less', 'webpack:dev', 'webpack-dev-server:dev']);
  grunt.registerTask('package', ['less', 'webpack:production', 'test']);
};
