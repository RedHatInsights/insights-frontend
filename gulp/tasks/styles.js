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

gulp.task('styles', ['make-compontents-scss', 'vendor-css'], function () {
    const styles = global.isRelease ? config.styles.srcRelease : config.styles.src;
    return gulp.src(styles)
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({ browsers: "> 5%" }))
        .pipe(gulpif(global.isRelease, cleanCSS()))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(config.styles.dest))
        .pipe(gulpif(browserSync.active, browserSync.reload({ stream: true })));
});

gulp.task('vendor-css', function () {
    return gulp.src([
        './node_modules/font-awesome/css/font-awesome.min.css',
        './node_modules/ui-select/dist/select.min.css',
        './node_modules/sweetalert2/dist/sweetalert2.min.css',
        './node_modules/c3/c3.min.css',
        './node_modules/ng-table/bundles/ng-table.min.css',
        './node_modules/angular-material/angular-material.min.css',
        './node_modules/patternfly/dist/css/patternfly.min.css',
        './node_modules/patternfly/dist/css/patternfly-additions.min.css'
    ]).pipe(concat('vendor.css'))
        .pipe(replace('../fonts', '../static/fonts'))
        .pipe(gulp.dest('./build/css/'));
});

