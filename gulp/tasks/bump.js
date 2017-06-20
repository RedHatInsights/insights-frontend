'use strict';

var config = require('../config');
var gulp = require('gulp');
var bump = require('gulp-bump');

function _bump(type) {
    return gulp.src(['./package.json'])
        .pipe(bump({
            type: type
        }))
        .pipe(gulp.dest('.'));
}

gulp.task('patch', function () {
    return _bump('patch');
});
gulp.task('minor', function () {
    return _bump('minor');
});
gulp.task('major', function () {
    return _bump('major');
});
