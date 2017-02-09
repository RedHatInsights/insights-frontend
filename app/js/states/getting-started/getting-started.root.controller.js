'use strict';

var statesModule = require('../');

/**
 * @ngInject
 */
function GettingStartedRootCtrl($scope, PermalinkService, GettingStarted) {
    $scope.sections = GettingStarted.sections;
    PermalinkService.scroll();
}

statesModule.controller('GettingStartedRootCtrl', GettingStartedRootCtrl);
