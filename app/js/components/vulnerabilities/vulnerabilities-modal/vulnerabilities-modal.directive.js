'use strict';

const componentsModule = require('../../');
const orderBy = require('lodash/orderBy');

/**
 * @ngInject
 */
function vulnerabilitiesModalCtrl($scope,
                                  $filter,
                                  $location,
                                  $stateParams,
                                  Rule,
                                  Utils,
                                  System,
                                  SystemModalTabs) {

    $scope.sorter = new Utils.Sorter(
        {
            predicate: $location.search().sort_by || 'id',
            reverse: $location.search().reverse || false
        },
        order);

    function order () {
        $location.search('sort_by', $scope.sorter.predicate);
        $location.search('reverse', $scope.sorter.reverse);

        // TODO: use this once api is available
        // getData();

        $scope.allVulnerabilities = $filter('orderBy')(
            $scope.allVulnerabilities,
            [($scope.sorter.reverse ?
                '-' + $scope.sorter.predicate :
                $scope.sorter.predicate)]);
    }

    $scope.getRuleHits = function (rhsa) {
        return rhsa.rule_hits === 1 ? '1 Hit' : `${rhsa.rule_hits} Hits`;
    };

    $scope.goToRule = function () {
        const params = $location.search();
        params.selectedRule = $scope.selectedRule.rule_id;
        params.activeTab = SystemModalTabs.rules;
        params.selectedPackage = $scope.selectedRHSA.package.id;
        params.selectedRHSA = $scope.selectedRHSA.erratum_id;
        $location.search(params);
    };

    getData();
    function getData() {
        System.getVulnerabilities($scope.systemId, {
            sort_by: 'severity',
            sort_dir: 'DESC',
            page_size: 1000 // TODO: paginate modal?
        }).then(res => {

            // reorder so that the selected erratum is the first
            // lodash should preserve the order of the other items
            $scope.rhsas = orderBy(res.data.resources, [
                erratum => erratum.erratum_id === $stateParams.rhsa_id
            ], ['desc']);
        });
    }

    $scope.$on('reload:data', getData);
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
