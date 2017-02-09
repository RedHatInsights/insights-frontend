'use strict';

var config = require('../config');
var gulp = require('gulp');
var gulpif = require('gulp-if');
var handleErrors = require('../util/handleErrors');
var browserSync = require('browser-sync');
var compass = require('gulp-compass');

gulp.task('styles', function () {
    var styles = global.isRelease ? config.styles.srcRelease : config.styles.src;
    var vendorStyles = config.styles.vendor;
    var outputStyle = global.isProd ? 'compressed' : 'nested';

    for (let i = 0; i < vendorStyles.length; i++) {
        vendorStyles[i] = '!' + vendorStyles[i];
        vendorStyles[i] = vendorStyles[i].replace('bower_components', 'styles/vendor');
    }

    styles = styles.concat(vendorStyles);
    return gulp.src(styles)
        .pipe(compass({
            sass: 'app/styles',
            css: config.styles.temp,
            style: outputStyle,
            import_path: [
                './app/bower_components/bootstrap-sass-official/' +
                'vendor/assets/stylesheets'],
            require: ['sass-css-importer']
        }))
        .on('error', handleErrors)
        .pipe(gulp.dest(config.styles.dest))
        .pipe(gulpif(browserSync.active, browserSync.reload({
            stream: true
        })));
});
