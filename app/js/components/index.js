/*global require, module, __dirname, angular, process*/
'use strict';

if (process && process.env && process.env.NODE_ENV && process.env.NODE_ENV !== 'test') {
    const bulk = require('bulk-require');
    module.exports = angular.module('insights.components', []);
    bulk(__dirname, ['./**/!(*.spec).js']);
} else {
    module.exports = {
        testMode: true,
        directive: () => {}
    };
}
