'use strict';

var bulk = require('bulk-require');

module.exports = angular.module('insights.constants', []);

bulk(__dirname, ['./**/!(*.spec).js']);
