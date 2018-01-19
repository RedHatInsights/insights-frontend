/*global require*/
'use strict';

var statesModule = require('../');

/**
 * @ngInject
 *
 * Currently uses mock data
 */
function VulnerabilitiesCtrl($filter,
                             $location,
                             $scope,
                             InventoryService,
                             Utils,
                             Vulnerability,
                             VulnerabilitiesService,
                             SystemModalTabs) {

    $scope.pager = new Utils.Pager();
    $scope.searchText = $location.search().searchText;
    $scope.vulnerabilities = [];
    $scope.getCurrentView = VulnerabilitiesService.getCurrentView;
    $scope.views = VulnerabilitiesService.getViews();

    $scope.sorter = new Utils.Sorter({
        predicate: 'name',
        reverse: false},
        order);

    /*
     * Queries GET:/vulnerabilities and populates table data
     */
    function getData () {
        $scope.loading = true;
        $scope.allVulnerabilities = null;
        $scope.rhsas = null;
        let params = [];
        params.search_term = $scope.searchText;

        if ($scope.getCurrentView() === $scope.views.packages) {
            Vulnerability.getAll(params).then((vulnerabilities) => {
                $scope.allVulnerabilities = vulnerabilities;
                order();
                $scope.loading = false;
            });
        } else if ($scope.getCurrentView() === $scope.views.rhsas) {
            Vulnerability.getRHSAs().then((rhsas) => {
                $scope.rhsas = rhsas;
                $scope.loading = false;
            });
        }
    }

    function setVulnerabilities() {
        let page = $scope.pager.currentPage - 1;
        let pageSize = $scope.pager.perPage;
        let offset = page * pageSize;
        let arrayEnd = offset + pageSize < $scope.allVulnerabilities.total ?
                offset + pageSize : $scope.allVulnerabilities.total;

        $scope.vulnerabilities = $scope.allVulnerabilities.slice(offset, arrayEnd);
    }

    function reloadTable () {
        $scope.pager.currentPage = 1;
        setVulnerabilities();
    }

    function order () {
        $scope.allVulnerabilities.resources = $filter('orderBy')(
            $scope.allVulnerabilities.resources,
            [($scope.sorter.reverse ?
                '-' + $scope.sorter.predicate :
                $scope.sorter.predicate)]);

        reloadTable();
    }

    $scope.showSystem = function (system_id) {
        InventoryService.showSystemModal({system_id: system_id}, true,
                                         SystemModalTabs.vulnerabilities);
    };

    getData();

    $scope.$on('reload:data', getData);
}

statesModule.controller('VulnerabilitiesCtrl', VulnerabilitiesCtrl);
