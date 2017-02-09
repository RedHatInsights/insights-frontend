'use strict';

var gulp = require('gulp');
var runSequence = require('run-sequence');

// only the unit tests are working currently
gulp.task('test', ['unit']);

/*
gulp.task('test', ['server'], function () {
    return runSequence('unit', 'protractor');
});
*/
