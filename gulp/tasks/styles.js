/*global require, global*/
'use strict';

const browserSync = require('browser-sync');
const compass = require('gulp-compass');
const concat = require('gulp-concat');
const config = require('../config');
const gulp = require('gulp');
const gulpif = require('gulp-if');
const handleErrors = require('../util/handleErrors');
const replace = require('gulp-replace');

gulp.task('make-compontents-scss', function () {
    return gulp.src(config.styles.componentsSrc)
        .pipe(concat('components.scss'))
        .pipe(gulp.dest('app/styles/'));
});

gulp.task('styles', ['make-compontents-scss'], function () {
    let styles = global.isRelease ? config.styles.srcRelease : config.styles.src;
    const vendorStyles = config.styles.vendor;
    const outputStyle = global.isProd ? 'compressed' : 'nested';

    for (let i = 0; i < vendorStyles.length; i++) {
        vendorStyles[i] = '!' + vendorStyles[i];
        vendorStyles[i] = vendorStyles[i].replace('styles/vendor');
    }

    styles = styles.concat(vendorStyles);
    return gulp.src(styles)
        .pipe(compass({
            sass:  'app/styles',
            css:   config.styles.temp,
            style: outputStyle,
            import_path: [
                './node_modules/flexboxgrid/css/',
                './node_modules/bootstrap-sass/vendor/assets/stylesheets/'
            ],
            require: ['sass-css-importer']
        }))
        .on('error', handleErrors)
        .pipe(replace('../fonts', '../static/fonts'))
        .pipe(gulp.dest(config.styles.dest))
        .pipe(gulpif(browserSync.active, browserSync.reload({
            stream: true
        })));
});
