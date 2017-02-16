/*global require, global*/
'use strict';

const config = require('../config');
const gulp = require('gulp');
const runSequence = require('run-sequence');
const git = require('gulp-git');
const fs = require('fs');

function buildAndRelease(cb, bump) {
    git.status({args: '--porcelain'}, function (err, stdout) {
        if (err) throw err;

        if (stdout !== '') {
            let modified = false;
            stdout.split('\n').forEach(function (line) {
                if (line.match(/[ ]*M/)) {
                    modified = true;
                }
            });

            if (modified) {
                throw new Error(`Refusing to do a gulp release!
This release task does a Git commit and tag.
Please stash or commit everything before you continue.
We want the release commits to not include any additional changes.
`);
            }
        }

        cb = cb || function () {};
        global.isProd = true;
        global.isRelease = true;
        runSequence(bump, 'release-tag', 'release-commit', cb);
    });
}

gulp.task('release-tag', function () {
    const json = JSON.parse(fs.readFileSync('./package.json'));
    git.tag(json.version, `Release ${json.version}`);
});

gulp.task('release-commit', function () {
});

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
