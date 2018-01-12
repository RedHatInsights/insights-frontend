'use strict';

var componentsModule = require('../../');

/**
 * @ngInject
 */
function vulnerabilitiesModalCtrl($scope) {
    console.log('asdfasdf');
    $scope.tabs = ['asdfasdf', 'lkkdldk', 'asdqwerq'];
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
