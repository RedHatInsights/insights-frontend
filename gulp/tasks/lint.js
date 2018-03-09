/*global require*/
'use strict';

var config = require('../config');
var gulp = require('gulp');
var jshint = require('gulp-jshint');
var jscs = require('gulp-jscs');
var stylish = require('gulp-jscs-stylish');
var map = require('map-stream');

gulp.task('lint-fix', function () {
    return gulp.src(config.scripts.src.concat(['!app/js/templates.js', '!app/js/components/ui-bootstrap-custom.js']))
        .pipe(jscs({fix: true}))
        .pipe(gulp.dest('app/js'));
});

gulp.task('lint', function () {
    // return gulp.src(config.scripts.src.concat(['!app/js/templates.js', '!app/js/components/ui-bootstrap-custom.js']))
    //     .pipe(jshint())
    //     .pipe(jscs())
    //     .pipe(stylish.combineWithHintResults())
    //     .pipe(jshint.reporter('jshint-stylish'))
    //     .pipe(map(function (file, cb) {
    //         if (file.jshint && !file.jshint.success) {
    //             // this captures both jshint and jscs because combineWithHintResults()
    //             cb('Lint validation failed!');
    //         } else {
    //             cb();
    //         }
    //     }));
});
