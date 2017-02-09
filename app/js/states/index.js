'use strict';

var bulk = require('bulk-require');

module.exports = angular.module('insights.states', []);

bulk(__dirname, ['./**/!(*.spec).js']);
