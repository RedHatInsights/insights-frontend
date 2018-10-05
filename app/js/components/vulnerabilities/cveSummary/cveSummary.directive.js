/*global require*/
'use strict';

const componentsModule = require('../../');
const find = require('lodash/find');
const map = require('lodash/map');

function cveSummaryCtrl($location, $q, $scope, $stateParams, Rule, Utils) {

    $scope.ruleLoader = new Utils.Loader(false);

    const fetchRules = $scope.ruleLoader.bind(rules => {
        return $q.all(rules.map(rule_id => Rule.byId(rule_id, true)))
        .then(res => $scope.rules = map(res, 'data'));
    });

    $scope.selectCVE = function (cve) {
        if ($scope.selectedCVE !== cve) {
            $scope.selectedCVE = cve;
            fetchRules($scope.selectedCVE.insights_rules);
        }

        $location.search('cve', cve.cve_id);
    };

    $scope.$watch('cves', cves => {
        if (!cves) {
            $scope.selectedCVE = false;
            return;
        }

        let found = false;
        if ($stateParams.cve) {
            found = find(cves, {cve_id: $stateParams.cve});
        }

        if (!found) {
            found = cves[0];
        }

        $scope.selectCVE(found);
    });
}

/**
 * @ngInject
 */
function cveSummary() {
    return {
        templateUrl: 'js/components/vulnerabilities/cveSummary/cveSummary.html',
        restrict: 'E',
        replace: true,
        controller: cveSummaryCtrl,
        scope: {
            cves: '<',
            initialCve: '<'
        }
    };
}

componentsModule.directive('cveSummary', cveSummary);
