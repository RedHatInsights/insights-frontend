'use strict';

var exec = require('child_process').exec;
var gulp = require('gulp');


gulp.task('kill-dev', function (cb) {

    var cmd = 'ps -ef | grep gulp | grep -v "' + process.pid + '"| awk \'{print $2}\' | xargs kill';
    exec(cmd, function () {
        cb();
    });

});
