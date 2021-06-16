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
    // if we omit the semicolon from the last property in a css claas the satellite
    // build process will fail because sassc-rails loses it's damn mind...
    const sassOptions = global.isSat ? {level: {1: {semicolonAfterLastProperty: true}}} : null;
    const styles = global.isRelease ? config.styles.srcRelease : config.styles.src;

    return gulp.src(styles)
        .pipe(sourcemaps.init())
        .pipe(sass(sassOptions).on('error', sass.logError))
        .pipe(autoprefixer({ browsers: '> 5%' }))
        .pipe(replace('../fonts', '../static/fonts'))
        // fix asset paths for satellite
        .pipe(gulpif(global.isSat, replace('/static/', '/insights/')))
        // css gets minified again during the satellite build so skip that step here
        .pipe(gulpif(global.isRelease && !global.isSat, cleanCSS()))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(config.styles.dest))
        .pipe(gulpif(browserSync.active, browserSync.reload({ stream: true })));
});
