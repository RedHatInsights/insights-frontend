'use strict';

var istanbul = require('browserify-istanbul');
var debowerify = require('debowerify');
var babelify = require('babelify');
const fs = require('fs');
const babelrc = JSON.parse(fs.readFileSync('.babelrc', "utf8"));

module.exports = function (config) {

    config.set({

        basePath: '../',
        frameworks: ['jasmine', 'browserify', 'should'],

        preprocessors: {
            'app/js/*.js': ['browserify', 'coverage'],
            'app/js/**/*.js': ['browserify', 'coverage'],
            'test/**/*.js': ['babel']
        },

        browsers: ['PhantomJS'],
        reporters: ['progress', 'coverage'],

        autoWatch: true,

        browserify: {
            debug: true,
            transform: [
                'babelify',
                debowerify,
                'bulkify',
                istanbul({
                    ignore: ['**/node_modules/**', '**/test/**']
                })
            ]
        },

        proxies: {
            '/': 'http://localhost:9876/'
        },

        urlRoot: '/__karma__/',

        files: [
            'app/js/*js',
            'app/js/**/*js',

            // app-specific code
            'app/bower_components/angular-mocks/angular-mocks.js',

            // test files
            'test/unit/**/*.js'
        ],

        babelPreprocessor: {
            options: babelrc
        }

    });
};
