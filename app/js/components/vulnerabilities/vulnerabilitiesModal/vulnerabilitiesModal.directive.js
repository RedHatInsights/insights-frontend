'use strict';

var componentsModule = require('../../');

/**
 * @ngInject
 */
function vulnerabilitiesModalCtrl() {

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
