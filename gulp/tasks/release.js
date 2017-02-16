/*global require, global*/
'use strict';

const config = require('../config');
const gulp = require('gulp');
const runSequence = require('run-sequence');
const git = require('gulp-git');

function buildAndRelease(cb, bump) {
    git.status({args: '--porcelain'}, function (err, stdout) {
        if (err) throw err;

        if (stdout !== '') {
            throw new Error(`Refusing to do a gulp release!
This release task does a Git commit and tag.
Please stash or commit everything before you continue.
We want the release commits to not include any additional changes.
`);
        }

        cb = cb || function () {};
        global.isProd = true;
        global.isRelease = true;
        runSequence(bump, cb);
    });
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
