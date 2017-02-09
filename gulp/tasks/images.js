/*global require*/
'use strict';

var config      = require('../config'),
    changed     = require('gulp-changed'),
    gulp        = require('gulp'),
    gulpif      = require('gulp-if'),
    plumber     = require('gulp-plumber'),
    browserSync = require('browser-sync');

gulp.task('images', function () {
    return gulp.src(config.images.src)
           .pipe(plumber())
           .pipe(changed(config.images.dest))
           .pipe(gulp.dest(config.images.dest))
           .pipe(gulpif(browserSync.active, browserSync.reload({
               stream: true,
               once: true
           })));
});
