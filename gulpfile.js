/*global global, require*/
'use strict';

global.isProd = false;
global.isRelease = false;

require('./gulp');
var gulp = require('gulp');
