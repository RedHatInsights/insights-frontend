/*global require, global, __dirname*/
'use strict';

var config = require('../config');
var gulp = require('gulp');
var gulpif = require('gulp-if');
var fs = require('fs');
var sourcemaps = require('gulp-sourcemaps');
var streamify = require('gulp-streamify');
var uglify = require('gulp-uglify');
var debowerify = require('debowerify');
var ngAnnotate = require('browserify-ngannotate');
var bro = require('gulp-bro');
var buffer = require('vinyl-buffer');
var browserSync = require('browser-sync');
var envify = require('envify/custom');
var path = require('path');
var babel = require('gulp-babel');
var plumber = require('gulp-plumber');
var banify = require('banify');

gulp.task('browserify', ['bro']);

gulp.task('bro', function () {
    var createSourcemap = global.isProd && config.browserify.sourcemap;
    var env = global.isProd ? 'production' : 'development';
    var preludePath = path.resolve(__dirname, '../util/_prelude.js');

    return gulp.src(['./app/js/insights.js', './app/js/static.js'])
           .pipe(plumber())
           .pipe(bro({
                debug: (!global.isProd),
                cache: {},
                packageCache: {},
                cacheFile: config.browserify.cacheFile,
                prelude: fs.readFileSync(preludePath, 'utf8'),
                preludePath: preludePath,
                plugin: [banify(config.bannedPackages)],
                transform: [debowerify, ngAnnotate, 'brfs',
                    'bulkify', envify({ _: 'purge', NODE_ENV: env })]
            }))
           .pipe(gulpif(createSourcemap, buffer()))
           .pipe(gulpif(createSourcemap, sourcemaps.init({ loadMaps: true })))
           .pipe(gulpif(global.isProd, babel({
                presets: ['es2015-without-strict'],
                compact: true
            }).on('error', function (e) {
                console.log('babel error');
                console.log(e);
            })))
           .pipe(gulpif(global.isProd, streamify(
               uglify({ compress: { drop_console: true } })
               .on('error', function (e) {
                    console.log(e);
                }))))
           .pipe(gulpif(createSourcemap, sourcemaps.write('./')))
           .pipe(gulp.dest(config.scripts.dest))
           .pipe(gulpif(browserSync.active,
               browserSync.reload({ stream: true, once: true })));
});
