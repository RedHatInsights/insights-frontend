/*global global, require*/

'use strict';

var gulp = require('gulp');
var runSequence = require('run-sequence');
var funcs = {};

funcs.dev = function (cb) {
    cb = cb || function () {};
    global.isProd = false;
    runSequence('views', ['copy.translations', 'static', 'copy', 'styles', 'images', 'fonts', 'browserify'], 'watch', cb);
};


gulp.task('dev-stable', ['clean'], function (cb) {
    funcs.dev(cb);
});

gulp.task('dev-beta', ['clean'], function (cb) {
    global.isBeta = true;
    funcs.dev(cb);
});

