/*global require, module*/
'use strict';

require('babelify');
// const istanbul = require('browserify-istanbul');
const debowerify = require('debowerify');
const fs = require('fs');
const babelrc = JSON.parse(fs.readFileSync('.babelrc', "utf8"));

module.exports = function (config) {

    config.set({

        basePath: '../',
        frameworks: ['jasmine', 'browserify', 'should'],

        preprocessors: {
            'app/js/*.js': ['browserify'],
            'app/js/**/*.js': ['browserify'],
            'test/**/*.js': ['babel']
        },

        browsers: ['PhantomJS'],
        reporters: ['progress'],

        autoWatch: true,

        browserify: {
            debug: true,
            transform: [
                'babelify',
                debowerify,
                'bulkify'
                // istanbul({ ignore: ['**/node_modules/**', '**/test/**'] })
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
