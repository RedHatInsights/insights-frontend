'use strict';

var componentsModule = require('../../');
const find = require('lodash/find');

/**
 * @ngInject
 */
function vulnerabilitiesModalCtrl($scope,
                                  $location,
                                  Rule,
                                  System,
                                  SystemModalTabs) {

    $scope.showCVEs = false;

    function round (x, to) {
        return Math.ceil(x / to) * to;
    };

    $scope.indexMe = function (index) {
        var windowWidth = document.documentElement.clientWidth,
            windowSm = 768,
            windowMd = 992;

        if (windowWidth < windowSm) {
            $scope.cveOrder = index;
        } else if (windowWidth >= windowSm && windowWidth < windowMd) {
            $scope.cveOrder = round(index, 2);
        } else if (windowWidth >= windowMd) {
            $scope.cveOrder = round(index, 4);
        }
    };

    $scope.toggleShowCVEs = function (rhsa) {
        if ($scope.selectedRHSA === rhsa || !rhsa) {
            delete $scope.selectedRHSA;
        } else {
            $scope.selectedRHSA = rhsa;
            $scope.selectedRHSA.package = pkg;
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

    $scope.goToRule = function () {
        const params = $location.search();
        params.selectedRule = $scope.selectedRule.rule_id;
        params.activeTab = SystemModalTabs.rules;
        params.selectedPackage = $scope.selectedRHSA.package.id;
        params.selectedRHSA = $scope.selectedRHSA.id;
        $location.search(params);
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

    // $scope.$watch(function () {
    //     return $location.search();
    // }, function (newVal, oldVal) {
    //     // don't do anything if it hasn't changed
    //     if (newVal === oldVal) {
    //         return;
    //     }

    //     let params = $location.search();
    //     if (params.activeTab === SystemModalTabs.vulnerabilities) {
    //         console.log('worked!!!');
    //     }
    // });

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
