/*global require, module, setTimeout*/
'use strict';

if (!global.angular) {
    const jsdom = require('jsdom').JSDOM;

    // makes angular, should, etc. global objects
    // that can be used throughout unit tests
    global.document = new jsdom('<html><head><script></script></head><body></body></html>');
    global.window = Object.create(global.document.window);
    global.angular = window.angular = {};

    // hack for sinonjs to run w/o browser
    document.createElement = function (div) { return true; };

    // emulate mocha running in browser (makes angular-mocks work)
    window.mocha = true;
    global.beforeEach = window.beforeEach = beforeEach;
    global.afterEach = window.afterEach = afterEach;

    require('angular');
    require('angular-mocks/angular-mocks');
    require('should-sinon');

    global.inject = angular.mock.inject;
    global.module = angular.mock.module;
}

const utils = {};

utils.asyncHack = (fn) => {
    setTimeout(fn, 1);
};

module.exports = {
    constants: require('./constants'),
    utils: utils
};