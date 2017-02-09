'use strict';

var config = require('../config');
var gulp = require('gulp');
var gettext = require('gulp-angular-gettext');
var copyPath = require('../util/copyPath');

gulp.task('translations', function () {
    return gulp.src('app/po/**/*.po')
        .pipe(gettext.compile({
            format: 'json'
        }))
        .pipe(gulp.dest('app/translations/'));
});

gulp.task('copy.translations', function (cb) {
     var root = config.dist.root;

    copyPath(root, 'app/translations', root + '/translations', function (err) {
        if (err !== null) {
            console.log('exec error: ' + err);
        } else {
            cb();
        }
    });
});
