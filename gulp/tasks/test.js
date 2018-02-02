/*global require*/
'use strict';

const gulp = require('gulp');
const shell = require('gulp-shell');

// only the unit tests are working currently
gulp.task('test', ['unit']);

gulp.task('smoke:chromedriver', shell.task('./node_modules/chromedriver/bin/chromedriver'));
gulp.task('smoke:chromedriver:background', shell.task('source ./tmp/env.sh && xvfb-run -a --server-args="-screen 0 1600x1200x24" ./node_modules/chromedriver/bin/chromedriver'));
gulp.task('smoke:run', shell.task('source ./tmp/env.sh && ./node_modules/nightwatch/bin/nightwatch smoketest/insightsTest.js'));

