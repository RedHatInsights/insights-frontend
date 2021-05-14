/*global require, global*/
'use strict';

const browserSync = require('browser-sync');
const config = require('../config');
const gulp = require('gulp');
const gulpif = require('gulp-if');
const replace = require('gulp-replace');
const concat = require('gulp-concat');

const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const cleanCSS = require('gulp-clean-css');

gulp.task('make-compontents-scss', function () {
    return gulp.src(config.styles.componentsSrc)
        .pipe(concat('components.scss'))
        .pipe(gulp.dest('app/styles/'));
});

gulp.task('styles', ['make-compontents-scss'], function () {
    const styles = global.isRelease ? config.styles.srcRelease : config.styles.src;
    return gulp.src(styles)
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({ browsers: "> 5%" }))
        .pipe(replace('../fonts', '../static/fonts'))
        // fix asset paths for satellite
        .pipe(gulpif(global.isSat, replace('/static/', '/insights/')))
        .pipe(gulpif(global.isRelease, cleanCSS()))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(config.styles.dest))
        .pipe(gulpif(browserSync.active, browserSync.reload({ stream: true })));
});
