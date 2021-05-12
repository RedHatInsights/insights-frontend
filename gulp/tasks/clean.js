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

    toDelete.push(config.styles.componentsOut);

    return del(toDelete);
});

gulp.task('clean-all', ['clean'], function (cb) {
    var toDelete = [config.browserify.cacheFile];

    // Satellite has specific module dependencies: don't delete the package-lock
    if (!global.isSat) {
        toDelete.push('./package-lock.json');
    }

    return del(toDelete, cb);
});
