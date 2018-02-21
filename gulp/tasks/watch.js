/*global require*/
'use strict';

var config  = require('../config'),
    gulp    = require('gulp'),
    runSequence  = require('run-sequence'),
    exclude = [
    '!app/**/.#*',
    '!app/**/*~',
    '!app/js/templates.js' // do not run browserify on template cache change
];

gulp.task('watch', [ 'browserSync', 'server'], function () {
    gulp.watch(config.styles.componentsSrc, ['styles']);
    gulp.watch('app/styles/**/*.scss',  ['styles']);
    gulp.watch(config.scripts.src.concat(exclude), ['lint', 'bro']);
    gulp.watch(config.views.watch.concat(exclude), function () {
        runSequence ('views', 'bro');
    });
});

gulp.task('smoke:watch', [], function () {
    gulp.watch(config.views.watch.concat(exclude), ['smoke:run']);
    gulp.watch('./smoketest/*js', ['smoke:run']);
});

