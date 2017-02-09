'use strict';

/**
 * @ngInject
 */
function Routes($stateProvider) {
    // Base States
    $stateProvider
        .state('app', {
            templateUrl: 'js/states/base/base.html',
            abstract: true,
            controller: 'AppCtrl'
        });
    $stateProvider
        .state('info', {
            templateUrl: 'js/states/base/info.html',
            abstract: true
        });
}

module.exports = Routes;
