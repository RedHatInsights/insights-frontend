'use strict';

const statesModule = require('../../');

/**
 * @ngInject
 */
function ListPoliciesCtrl($filter, $location, $scope, gettextCatalog, Policy, Utils) {

    $scope.failedChecksTooltip = gettextCatalog.getString(
        'This policy has checks that are not passing');

    $scope.pager = new Utils.Pager();
    $scope.searchText = $location.search().searchText;
    $scope.policies = [];

    $scope.sorter = new Utils.Sorter({
        predicate: 'policy_name',
        reverse: false},
        order);

    /*
     * Queries GET:/policies and populates table data
     *
     * @TODO Currently we are loading all policies in one call
     * Once the API supports it we will want to pull data one page at a time
     *
     * @param paginate gets all policies if set to false
     */
    function getData () {
        $scope.loading = true;
        let params = [];
        params.search_term = $scope.searchText;

        Policy.getAll(params).then((policies) => {
            $scope.allPolicies = policies.data;
            order();
            $scope.loading = false;
        });
    }

    /*
     * Called when user changes pages
     *
     * @TODO Currently we are paginating locally
     * Once the API supports it we should switch this to hit the api per page
     */
    $scope.paginate = function () {
        $scope.pager.update();
        setPolicies();
    };

    function setPolicies() {
        let page = $scope.pager.currentPage - 1;
        let pageSize = $scope.pager.perPage;
        let offset = page * pageSize;
        let arrayEnd = offset + pageSize < $scope.allPolicies.total ?
                offset + pageSize : $scope.allPolicies.total;

        $scope.policies = $scope.allPolicies.resources.slice(offset, arrayEnd);
    }

    /*
     * searches all policies for given search term(s)
     */
    $scope.search = function (model) {
        $location.search('searchText', model);
        $scope.searchText = model;
        getData();
    };

    function reloadTable () {
        $scope.pager.currentPage = 1;
        setPolicies();
    }

    function order () {
        $scope.allPolicies.resources = $filter('orderBy')(
            $scope.allPolicies.resources,
            [($scope.sorter.reverse ?
                '-' + $scope.sorter.predicate :
                $scope.sorter.predicate)]);

        reloadTable();
    }

    getData();

}

statesModule.controller('ListPoliciesCtrl', ListPoliciesCtrl);
