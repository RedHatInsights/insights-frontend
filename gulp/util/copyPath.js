'use strict';

var exec = require('child_process').exec;

module.exports = function (root, source, target, cb) {
    exec('mkdir -p ' + root + ' && rm -rf ' + target + ' && cp -RP ' + source + ' ' + target, function (err) {
        if (err !== null) {
            console.log('exec error: ' + err);
        }
        cb(err);
    });
};
