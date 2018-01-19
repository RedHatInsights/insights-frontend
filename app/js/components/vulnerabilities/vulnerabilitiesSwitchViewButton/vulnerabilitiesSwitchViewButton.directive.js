'use strict';

var componentsModule = require('../../');
const controllerName = 'vulnerabilitiesSwitchViewButton';

/**
 * @ngInject
 */
function vulnerabilitiesSwitchViewButtonCtrl($scope, VulnerabilitiesService) {
    $scope.setCurrentView = VulnerabilitiesService.setCurrentView;
    $scope.getCurrentView = VulnerabilitiesService.getCurrentView;
    $scope.views = VulnerabilitiesService.getViews();
}

function vulnerabilitiesSwitchViewButton() {
    return {
        templateUrl:
          'js/components/vulnerabilities/vulnerabilitiesSwitchViewButton/' +
          'vulnerabilitiesSwitchViewButton.html',
        restrict: 'E',
        controller: vulnerabilitiesSwitchViewButtonCtrl,
        replace: true,
        scope: {
            systemId: '<'
        }
    };
}

componentsModule.directive(controllerName, vulnerabilitiesSwitchViewButton);
