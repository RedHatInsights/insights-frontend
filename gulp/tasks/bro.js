/*global require, global, __dirname*/
'use strict';

const config = require('../config');
const gulp = require('gulp');
const gulpif = require('gulp-if');
const fs = require('fs');
const sourcemaps = require('gulp-sourcemaps');
const streamify = require('gulp-streamify');
const uglify = require('gulp-uglify');
const bro = require('gulp-bro');
const buffer = require('vinyl-buffer');
const browserSync = require('browser-sync');
const envify = require('envify/custom');
const path = require('path');
const babel = require('gulp-babel');
const plumber = require('gulp-plumber');
const banify = require('banify');
const rename = require('gulp-rename');
const replace = require('gulp-replace');

gulp.task('browserify', ['bro']);

gulp.task('bro', function () {
    const createSourcemap = global.isProd && config.browserify.sourcemap;
    const env = global.isProd ? 'production' : 'development';
    const preludePath = path.resolve(__dirname, '../util/_prelude.js');

    return gulp.src(['./app/js/insights.js'])
           .pipe(plumber())
           .pipe(bro({
                debug: (!global.isProd),
                cache: {},
                packageCache: {},
                cacheFile: config.browserify.cacheFile,
                prelude: fs.readFileSync(preludePath, 'utf8'),
                preludePath: preludePath,
                plugin: [banify(config.bannedPackages)],
                transform: [ 'brfs', 'bulkify', envify({ _: 'purge', NODE_ENV: env })]
            }))
           .pipe(gulpif(createSourcemap, buffer()))
           .pipe(gulpif(createSourcemap, sourcemaps.init({ loadMaps: true })))
           .pipe(gulpif(global.isProd, babel({
                presets: ['es2015-without-strict'],
                compact: true,
                plugins: ['angularjs-annotate']
            }).on('error', function (e) {
                console.log('babel error');
                console.log(e);
            })))
           .pipe(gulpif(global.isSat, replace('static/images/', '/assets/insights/')))
           .pipe(rename('insights.unmin.js'))
           .pipe(gulp.dest(config.scripts.dest))
           .pipe(rename('insights.js'))
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
