/*global require*/
'use strict';

const config = require('../config');
const gulp = require('gulp');
const replace = require('gulp-replace');
const git = require('gulp-git');
const priv = {};

priv.changeStrings = function changeStrings(tag, hash, done) {
    return gulp.src(`${config.dist.root}/index*.html`)
        .pipe(replace('___TAG___', tag))
        .pipe(replace('___COMMIT___', hash))
        .pipe(gulp.dest(config.dist.root))
        .on('end', done);
};

gulp.task('embedversions', function (done) {
    git.revParse({args:' HEAD'}, function (err, hash) {
        return priv.changeStrings(config.pkg.version, hash, done);
    });
});

gulp.task('embedtag', function (done) {
    return priv.changeStrings(config.pkg.version, 'null', done);
});

gulp.task('embedhash', function (done) {
    git.revParse({args:' HEAD'}, function (err, hash) {
        return priv.changeStrings(hash, 'null', done);
    });
});
