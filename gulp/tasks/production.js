/*global require, global*/
'use strict';

var gulp = require('gulp');
var runSequence = require('run-sequence');

gulp.task('prod', function (cb) {
    cb = cb || function () {};
    global.isProd = true;
    global.isRelease = true;
    runSequence('clean-all', 'views', 'translations', ['copy.translations', 'static', 'styles', 'browserify', 'openshift'], cb);
});
