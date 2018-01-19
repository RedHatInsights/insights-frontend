'use strict';

var componentsModule = require('../../');

/**
 * @ngInject
 */
function vulnerabilitiesModalCtrl($scope, VulnerabilitiesService) {
    $scope.getCurrentView = VulnerabilitiesService.getCurrentView;
    $scope.views = VulnerabilitiesService.getViews();
}

function vulnerabilitiesModal() {
    return {
        templateUrl:
          'js/components/vulnerabilities/vulnerabilitiesModal/vulnerabilitiesModal.html',
        restrict: 'E',
        controller: vulnerabilitiesModalCtrl,
        replace: true,
        scope: {
            systemId: '<'
        }
    };
}

componentsModule.directive('vulnerabilitiesModal', vulnerabilitiesModal);
