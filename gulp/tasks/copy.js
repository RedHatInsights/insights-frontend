'use strict';

var config = require('../config');
var gulp = require('gulp');
var gulpCopy = require('gulp-copy');
var handleErrors = require('../util/handleErrors');

gulp.task('copy', function () {
    var vendorStyles = config.styles.vendor;
    return gulp.src(vendorStyles)
        .pipe(gulpCopy(config.styles.vendorPath, {prefix: 2}))
        .on('error', handleErrors);
});
