'use strict';

var config = require('../config');
var gulp = require('gulp');
var del = require('del');

gulp.task('clean', function (cb) {
    var toDelete = [config.dist.root];
    if (global.isProd) {
        toDelete.push(config.styles.temp);
    }
    if (global.isRelease) {
        toDelete.push(config.dist.release);
    }
    del(toDelete, cb);
});

gulp.task('clean-all', ['clean'], function (cb) {
    del(config.browserify.cacheFile, cb);
});
