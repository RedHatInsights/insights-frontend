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

    $scope.pager = new Utils.Pager(10);
    $scope.loader = new Utils.Loader();

    $scope.goToRule = function () {
        const params = $location.search();
        params.selectedRule = $scope.selectedRule.rule_id;
        params.activeTab = SystemModalTabs.rules;
        params.selectedPackage = $scope.selectedRHSA.package.id;
        params.selectedRHSA = $scope.selectedRHSA.erratum_id;
        $location.search(params);
    };

    const getData = $scope.loader.bind(() => {
        return System.getVulnerabilities($scope.systemId, {
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
    });

    getData();
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
