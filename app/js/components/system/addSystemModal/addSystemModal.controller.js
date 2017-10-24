'use strict';

var componentsModule = require('../../');

/**
 * @ngInject
 */
function AddSystemModalCtrl($scope, $modalInstance, InsightsConfig) {
    $scope.close = function () {
        $modalInstance.dismiss('close');
    };

    $scope.gettingStartedLink = InsightsConfig.gettingStartedLink;
}

componentsModule.controller('AddSystemModalCtrl', AddSystemModalCtrl);
