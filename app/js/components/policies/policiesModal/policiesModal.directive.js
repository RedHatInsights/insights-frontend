'use strict';

var componentsModule = require('../../');

/**
 * @ngInject
 */
function policiesModalCtrl($location, $scope, System) {

    $scope.loading = true;

    // grabs policyId from url
    $scope.policyId = $location.path().split('/').pop();

    System.getSystemPolicies($scope.systemId).then((system) => {
        $scope.policies = system.data;
        $scope.loading = false;
    });
}

function policiesModal() {
    return {
        templateUrl: 'js/components/policies/policiesModal/policiesModal.html',
        restrict: 'E',
        controller: policiesModalCtrl,
        replace: true,
        scope: {
            systemId: '<'
        }
    };
}

componentsModule.directive('policiesModal', policiesModal);
