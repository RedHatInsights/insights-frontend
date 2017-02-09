'use strict';

var config = require('../config');
var gulp = require('gulp');
var jade = require('gulp-jade');
var gettext = require('gulp-angular-gettext');
var merge = require('merge-stream');

gulp.task('pot', function () {
    var viewStream = gulp.src(config.views.src).pipe(jade());
    var htmlStream = gulp.src(config.views.html);
    var scriptStream = gulp.src(config.scripts.src);

    return merge(viewStream, scriptStream, htmlStream)
        .pipe(gettext.extract('template.pot', {}))
        .pipe(gulp.dest('app/po/'));
});
