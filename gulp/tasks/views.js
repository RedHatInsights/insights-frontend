/*global global, require*/
'use strict';

var config        = require('../config'),
    gulp          = require('gulp'),
    jade          = require('gulp-jade'),
    rename        = require('gulp-rename'),
    plumber       = require('gulp-plumber'),
    templateCache = require('gulp-angular-templatecache');

// Views task
gulp.task('views', function () {

    // Put our index.html in the dist folder
    gulp.src(['app/vanilla.html']).pipe(gulp.dest(config.dist.root));

    if (global.isBeta) {
        // Replace index.html with the indexbeta.html
        gulp.src('app/indexbeta.html')
        .pipe(rename('index.html'))
        .pipe(gulp.dest(config.dist.root));
    } else {
        gulp.src(['app/index.html']).pipe(gulp.dest(config.dist.root));
    }

    // Copy support dir
    gulp.src('support/**/*').pipe(gulp.dest(config.dist.root + '/support'));

    // Process any other view files from app/views
    return gulp.src(config.views.src)
           .pipe(plumber())
           .pipe(jade())
           .pipe(templateCache({
               module: 'insights.templates',
               moduleSystem: 'Browserify',
               standalone: true
           }))
           .pipe(gulp.dest(config.views.dest));

});
