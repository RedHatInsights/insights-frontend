/*global require*/
'use strict';

var statesModule = require('../');
var priv = {};

priv.doOverview = function ($state) {
    $state.go('app.dashboard', {}, { location: 'replace' });
};
/**
 * @ngInject
 */
function InitialCtrl(Report, $state) {
    return priv.doOverview($state);
}

statesModule.controller('InitialCtrl', InitialCtrl);
