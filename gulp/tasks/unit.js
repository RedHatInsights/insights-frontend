/*global require, __dirname*/
'use strict';

const gulp = require('gulp');
const mocha = require('gulp-mocha');
const config = require('../config');
const Server = require('karma').Server;
const path = require('path');

gulp.task('unit', function () {
    gulp.src('app/js/**/*.unit.js', { read: false })
        .pipe(mocha());
});

gulp.task('unit-browser', ['views'], function (done) {
    new Server({
        configFile: path.normalize(path.join(__dirname, '..', '..', config.test.karma)),
        singleRun: true
    }, done).start();
});
