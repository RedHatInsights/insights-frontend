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

    gulp.watch(config.scripts.src.concat(exclude), ['lint', 'bro']);
    gulp.watch(config.styles.src.concat(exclude),  ['styles']);
    gulp.watch(config.views.watch.concat(exclude), function () {
        runSequence ('views', 'bro');
    });
    gulp.watch(config.images.src, ['images']);
    gulp.watch(config.fonts.src,  ['fonts']);
});
