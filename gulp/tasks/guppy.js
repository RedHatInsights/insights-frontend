/*global require, global, __dirname, process*/
'use strict';

const os = require('os');
const gulp = require('gulp');
const guppy = require('git-guppy')(gulp);
const hostname = os.hostname();
const fs = require('fs');

const priv = {};

priv.isRunner = function isRunner () {
    if (hostname && hostname.indexOf('labsgitrunner') === 0) {
        return true;
    }

    if (fs.existsSync('/I_AM_A_RUNNER')) {
        return true;
    }

    return false;
};

gulp.task('pre-commit', guppy.src('pre-commit', function () {}));

if (priv.isRunner) {
    // basically do a noop on the gitlab runners
    gulp.task('pre-push', [], guppy.src('pre-push', function () {}));
} else {
    // force linting on pre-push everywhere else
    gulp.task('pre-push', ['lint'], guppy.src('pre-push', function () {}));
}
