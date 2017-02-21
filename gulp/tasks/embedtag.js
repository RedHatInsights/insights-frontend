/*global require*/
'use strict';

const config = require('../config');
const gulp = require('gulp');
const replace = require('gulp-replace');
const git = require('gulp-git');
const priv = {};

priv.changeTagString = function changeTagString(newString) {
    return gulp.src(config.dist.root + '/index.html')
        .pipe(replace('___TAG___', newString))
        .pipe(gulp.dest(config.dist.root));
};

gulp.task('embedtag', function () {
    return priv.changeTagString(config.pkg.version);
});

gulp.task('embedhash', function () {
    git.revParse({args:' HEAD'}, function (err, hash) {
        return priv.changeTagString(hash);
    });
});


