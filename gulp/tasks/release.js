'use strict';

var config = require('../config');
var gulp = require('gulp');
var runSequence = require('run-sequence');

function buildAndRelease(cb, bump) {
    cb = cb || function () {};

    global.isProd = true;
    global.isRelease = true;
    runSequence(
        'kill-dev',
        'clean-all',
        'styles',
        'images',
        'fonts',
        'views',
        'browserify',
        bump,
        'copyrelease',
        cb);
}

gulp.task('release', ['releasepatch']);

gulp.task('releasepatch', function (cb) {
    return buildAndRelease(cb, 'patch');
});

gulp.task('releaseminor', function (cb) {
    return buildAndRelease(cb, 'minor');
});

gulp.task('releasemajor', function (cb) {
    return buildAndRelease(cb, 'major');
});

gulp.task('copyrelease', function () {
    return gulp.src([config.dist.root + '/**/*', '!**/index.html', '!**/vanilla.html'])
        .pipe(gulp.dest(config.dist.release));
});
