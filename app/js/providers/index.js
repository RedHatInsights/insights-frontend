'use strict';

var bulk = require('bulk-require');

module.exports = angular.module('insights.providers', []);

bulk(__dirname, ['./**/!(*.spec).js']);
