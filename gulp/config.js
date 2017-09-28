/*global module, require*/
'use strict';

const pkg = require('../package');

module.exports = {
    'pkg': pkg,
    'syncport': 9000,
    'syncproxyport': 3000,

    'styles': {
        'componentsSrc': 'app/js/components/**/*.scss',
        'componentsOut': 'app/styles/components.scss',
        'src': ['app/styles/insights.scss'],
        'srcRelease': ['app/styles/insights.scss',
                       'app/styles/sat5.scss',
                       'app/styles/sat6.scss',
                       'app/styles/cloudforms.scss'],
        'vendor': [],
        'temp': 'app/styles/.css',
        'vendorPath': 'app/styles/vendor',
        'dest': 'build/css/'
    },

    'scripts': {
        'src':  ['app/js/**/*.js'],
        'dest': 'build/js'
    },
    'views': {
        'watch': [
            'app/index.html',
            'app/indexbeta.html',
            'app/vanilla.html',
            'support/**/*',
            'app/**/*.jade'
        ],
        'src':  'app/**/*.jade',
        'html': 'support/**/*.html',
        'dest': 'app/js'
    },

    'dist': {
        'root': 'build',
        'release': 'release'
    },

    'browserify': {
        'bundleName': 'insights.js',
        'sourcemap': true,
        'cacheFile': './.browserify-cache.json'
    },

    'test': {
        'karma': 'test/karma.conf.js',
        'protractor': 'test/protractor.conf.js'
    },

    'bannedPackages': [
        // import specific lodash functions instead of the entire library to keep insights.js small
        // e.g. require('lodash/collection/map') instead of require('lodash')
        'lodash'
    ]

};
