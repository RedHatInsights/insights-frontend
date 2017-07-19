/*global require*/
'use strict';

const config = require('../config');
const browserSync = require('browser-sync');
const gulp = require('gulp');

gulp.task('browserSync', function() {
    browserSync({
        https: {
            key:  "./ssl/key.pem",
            cert: "./ssl/cert.pem"
        },
        open: false,
        port: config.syncport,
        proxy: 'localhost:' + config.syncproxyport
    });
});
