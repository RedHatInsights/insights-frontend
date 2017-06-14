'use strict';

var pkg = require('../package');
module.exports = {
    'pkg': pkg,
    'syncport': 9000,
    'syncproxyport': 3000,

    'styles': {
        'src': ['app/styles/**/*.scss', '!app/styles/base.scss', '!app/styles/cloudforms.scss', '!app/styles/sat5.scss', '!app/styles/sat6.scss'],
        'srcRelease': ['app/styles/**/*.scss', '!app/styles/base.scss'],
        'vendor': [],
        'temp': 'app/styles/.css',
        'vendorPath': 'app/styles/vendor',
        'dest': 'build/css/'
    },

    'scripts': {
        'src':  ['app/js/**/*.js'],
        'dest': 'build/js'
    },

    'images': {
        'src': 'app/images/**/*',
        'dest': 'build/images'
    },

    'fonts': {
        'src': ['app/fonts/**/*', 'node_modules/font-awesome/fonts/*'],
        'dest': 'build/fonts'
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
