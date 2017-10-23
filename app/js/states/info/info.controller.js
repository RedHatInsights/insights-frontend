'use strict';

var statesModule = require('../');

/**
 * @ngInject
 */
function InfoCtrl($scope, InsightsConfig, PermalinkService) {
    $scope.gettingStartedLink = InsightsConfig.gettingStartedLink;

    PermalinkService.scroll();
}

statesModule.controller('InfoCtrl', InfoCtrl);
