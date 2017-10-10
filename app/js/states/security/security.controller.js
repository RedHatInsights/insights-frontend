'use strict';

var statesModule = require('../');

/**
 * @ngInject
 */
function GettingStartedCtrl($scope, InsightsConfig) {
    $scope.gettingStartedLink = InsightsConfig.gettingStartedLink;
}

statesModule.controller('SecurityCtrl', GettingStartedCtrl);
