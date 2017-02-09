/*global*/
'use strict';

var statesModule = require('../');
var priv = {};

priv.doOverview = function ($state) {
    $state.go('app.overview', {}, { location: 'replace' });
};

//DEPRECATED
priv.doLegacy = function (Report, $state, InsightsConfig, HttpHeaders) {
    var state = 'app.actions';

    //var accountNumber = window.sessionStorage.getItem(InsightsConfig.acctKey);

    // intentionally not waiting for User and AccountService here to speed up
    // loading of the initial page
    // worst case the backend will reject the request
    // if the user tries to mess with the account number
    Report.headReports().success(function (response) {
        const count = response.headers(HttpHeaders.resourceCount);
        if (count <= 0) {
            // if there are no reports, redirect to systems view instead of actions
            state = 'app.inventory';
        }
    }).finally(function () {
        $state.go(state, {}, { location: 'replace' });
    });
};

/**
 * @ngInject
 */
function InitialCtrl(Report, $state) {
    // if (window.insightsGlobal && window.insightsGlobal.isBeta) {
    return priv.doOverview($state);

    // }

    // return priv.doLegacy(Report, $state, InsightsConfig);
}

statesModule.controller('InitialCtrl', InitialCtrl);
