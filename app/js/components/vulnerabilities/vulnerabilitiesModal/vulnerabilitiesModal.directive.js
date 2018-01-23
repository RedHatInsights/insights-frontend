'use strict';

var componentsModule = require('../../');

/**
 * @ngInject
 */
function vulnerabilitiesModalCtrl($scope, System) {
    $scope.showCVEs = false;

    $scope.toggleShowCVEs = function (rhsa) {
        if ($scope.selectedRHSA === rhsa || rhsa === undefined) {
            $scope.selectedRHSA = undefined;
        } else {
            $scope.selectedRHSA = rhsa;
            $scope.selectedCVE = rhsa.cves[0];
        }
    };

    $scope.getRuleHits = function (rhsa) {
        return rhsa.rule_hits === 1 ? '1 Hit' : `${rhsa.rule_hits} Hits`;
    };

    $scope.selectCVE = function (cve) {
        if ($scope.selectedCVE !== cve) {
            $scope.selectedCVE = cve;
        }
    };

    function getData() {
        System.getVulnerabilities($scope.systemId)
            .then((system) => {
                $scope.packages = system.packages;
            });
    }

    $scope.$on('reload:data', getData);

    getData();
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
