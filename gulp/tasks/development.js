/*global global, require*/

'use strict';

var gulp = require('gulp');
var runSequence = require('run-sequence');
var funcs = {};

funcs.dev = function (cb) {
    cb = cb || function () {};
    runSequence('views', ['copy.translations', 'static', 'copy', 'styles', 'images', 'fonts', 'browserify'], 'watch', cb);
};

gulp.task('dev-smoke', ['clean'], function (cb) {
    global.isProd = true; // babel is needed for casperjs
    global.isBeta = true;
    funcs.dev(cb);
});

gulp.task('dev-stable', ['clean'], function (cb) {
    global.isProd = false;
    funcs.dev(cb);
});

gulp.task('dev-beta', ['clean'], function (cb) {
    global.isProd = false;
    global.isBeta = true;
    funcs.dev(cb);
});

