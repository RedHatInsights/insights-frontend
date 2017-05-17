/*global require, global*/
'use strict';

const config = require('../config');
const gulp = require('gulp');
const del = require('del');

gulp.task('clean', function () {
    var toDelete = [config.dist.root];

    if (global.isProd) {
        toDelete.push(config.styles.temp);
    }

    if (global.isRelease) {
        toDelete.push(config.dist.release);
    }

    return del(toDelete);
});

gulp.task('clean-all', ['clean'], function (cb) {
    return del(config.browserify.cacheFile, cb);
});
