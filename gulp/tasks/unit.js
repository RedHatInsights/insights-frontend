'use strict';

var gulp = require('gulp');
var config = require('../config');
var Server = require('karma').Server;
var path = require('path');

gulp.task('unit', ['views'], function (done) {

    new Server({
        configFile: path.normalize(path.join(__dirname, '..', '..', config.test.karma)),
        singleRun: true
    }, done).start();
});
