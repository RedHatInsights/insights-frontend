'use strict';

var config = require('../config');
var gulp = require('gulp');
var copyPath = require('../util/copyPath');

gulp.task('static', function (cb) {
    var root = config.dist.root;
    copyPath(root, 'static', root + '/static', function (err) {
        if (err !== null) {
            console.log('exec error: ' + err);
        } else {
            cb();
        }
    });
});
