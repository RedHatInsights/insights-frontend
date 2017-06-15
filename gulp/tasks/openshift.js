'use strict';

var config = require('../config');
var gulp = require('gulp');

gulp.task('openshift', function () {
    gulp.src(['server.js', 'package.json'])
        .pipe(gulp.dest(config.dist.root));

    return gulp.src(['.openshift/**/*'])
        .pipe(gulp.dest(config.dist.root + '/.openshift'));

});
