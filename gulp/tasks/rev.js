'use strict';

var config = require('../config');
var gulp = require('gulp');
var rev = require('gulp-rev-append');

// Revision files
gulp.task('rev', function () {
    // Replace rev=@@hash with the hash of the files
    return gulp.src(config.dist.root + '/index.html')
        .pipe(rev())
        .pipe(gulp.dest(config.dist.root));
});
