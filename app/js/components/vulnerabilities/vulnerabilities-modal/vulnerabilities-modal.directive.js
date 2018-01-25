'use strict';

var componentsModule = require('../../');
const find = require('lodash/find');

/**
 * @ngInject
 */
function vulnerabilitiesModalCtrl($scope, Rule, System) {
    $scope.showCVEs = false;

    $scope.toggleShowCVEs = function (rhsa) {
        if ($scope.selectedRHSA === rhsa || !rhsa) {
            delete $scope.selectedRHSA;
        } else {
            $scope.selectedRHSA = rhsa;
            $scope.selectCVE(rhsa.cves[0]);
        }
    };

    $scope.inPackage = function (pkg) {
        return find(pkg.rhsas, $scope.selectedRHSA) ? true : false;
    };

    $scope.isSelected = function (rhsa) {
        if (rhsa && $scope.selectedRHSA) {
            return rhsa.id === $scope.selectedRHSA.id;
        }

        return false;
    };

    $scope.getRuleHits = function (rhsa) {
        return rhsa.rule_hits === 1 ? '1 Hit' : `${rhsa.rule_hits} Hits`;
    };

    $scope.selectCVE = function (cve) {
        if ($scope.selectedCVE !== cve) {
            $scope.selectedCVE = cve;
            fetchRule($scope.selectedCVE.insights_rule);
        }
    };

    function fetchRule (rule_id) {
        $scope.loadingRule = true;
        $scope.selectedRule = null;

        if (rule_id) {
            Rule.byId(rule_id, true).then((rule) => {
                $scope.selectedRule = rule.data;
                $scope.loadingRule = false;
            });
        }
    }

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
          'js/components/vulnerabilities/vulnerabilities-modal/vulnerabilities-modal.html',
        restrict: 'E',
        controller: vulnerabilitiesModalCtrl,
        replace: true,
        scope: {
            systemId: '<'
        }
    };
}

componentsModule.directive('vulnerabilitiesModal', vulnerabilitiesModal);
