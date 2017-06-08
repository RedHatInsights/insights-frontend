/*global require, global*/
'use strict';

const config = require('../config');
const gulp = require('gulp');
const runSequence = require('run-sequence');
const git = require('gulp-git');
const fs = require('fs');
const priv = {};

priv.getVersion = function getVersion () {
    return JSON.parse(fs.readFileSync('./package.json')).version;
};

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
        runSequence(bump, 'release-commit', 'release-tag', cb);
    });
}

gulp.task('release-tag', function () {
    const version = priv.getVersion();
    git.tag(version, `Release TEST ${version}`, function (err) {
        if (err) { throw err; }
    });
});

gulp.task('release-commit', function (cb) {
    const version = priv.getVersion();
    gulp.src(['./package.json', './bower.json'])
        .pipe(git.commit(`Release ${version}`))
        .on('end', cb);
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
