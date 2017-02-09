'use strict';

var bulk = require('bulk-require');

module.exports = angular.module('insights.api', []);

bulk(__dirname, ['./**/!(*.spec).js']);
