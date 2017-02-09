'use strict';

var config = require('../config');
var gulp = require('gulp');
var replace = require('gulp-replace');

// Revision files
gulp.task('embedtag', function () {

    // Replace ___TAG___ with the current tag
    return gulp.src(config.dist.root + '/index.html')
        .pipe(replace('___TAG___', config.pkg.version))
        .pipe(gulp.dest(config.dist.root));

});
