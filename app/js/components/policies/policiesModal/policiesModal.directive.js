'use strict';

const componentsModule = require('../../');
const sortBy = require('lodash/sortBy');

/**
 * @ngInject
 */
function policiesModalCtrl($location, $scope, System) {

    $scope.loading = true;

    // grabs policyId from url
    $scope.policyId = $location.path().split('/').pop();

    System.getSystemPolicies($scope.systemId).then((system) => {
        $scope.policies = sortBy(system.data.resources, [policy => {
            if ($scope.policyId && $scope.policyId === policy.policy_id) {
                return 0;
            }

            return 1;
        }, 'policy_id']);

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
