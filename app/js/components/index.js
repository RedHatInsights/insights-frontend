'use strict';

var bulk = require('bulk-require');

module.exports = angular.module('insights.components', []);

bulk(__dirname, ['./**/!(*.spec).js']);
