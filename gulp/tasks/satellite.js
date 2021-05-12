/*global require, global*/
'use strict';

var gulp = require('gulp');
var runSequence = require('run-sequence');

gulp.task('sat', function (cb) {
    cb = cb || function () {};
    global.isProd = true;
    global.isRelease = true;
    global.isSat = true;

    runSequence('clean-all', 'views', 'translations', ['copy.translations', 'static', 'styles', 'browserify', 'openshift'], cb);
});
