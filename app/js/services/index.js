'use strict';

var bulk = require('bulk-require');

module.exports = angular.module('insights.services', []);

bulk(__dirname, ['./**/!(*.spec).js']);
