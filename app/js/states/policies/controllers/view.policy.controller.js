'use strict';

const statesModule = require('../../');

/**
 * @ngInject
 */
function ViewPolicyCtrl($filter,
                        $location,
                        $state,
                        $stateParams,
                        $scope,
                        gettextCatalog,
                        InventoryService,
                        Policy,
                        Utils) {

    const PASSED = gettextCatalog.getString('passed');
    const FAILED = gettextCatalog.getString('failed');
    const ERRORED = gettextCatalog.getString('errored');
    const UNKNOWN = gettextCatalog.getString('unknown');

    $scope.loading = true;
    $scope.pager = new Utils.Pager();
    $scope.policyId = $stateParams.id;
    $scope.policyName = $scope.policyId;
    $scope.searchText = $location.search().searchText;

    $scope.sorter = new Utils.Sorter(
        {
            predicate: $location.search().sortBy || 'system.toString',
            reverse: $location.search().reverse || false
        },
        order);

    $scope.showSystem = function (system_id) {
        InventoryService.showSystemModal({system_id: system_id}, true, 'policy');
    };

    function order() {
        $location.search('sortBy', $scope.sorter.predicate);
        $location.search('reverse', $scope.sorter.reverse);
        getData();
    }

    /*
     * hits the server to get the data
     */
    function getData () {
        let machine_id = $location.search().machine;
        let params = [];

        params.page = ($scope.pager.currentPage - 1);
        params.page_size = $scope.pager.perPage;
        params.search_term = $scope.searchText;
        params.sort_by = $scope.sorter.predicate;
        params.sort_dir = $scope.sorter.reverse ? 'DESC' : 'ASC';

        $scope.loading = true;

        Policy.getPolicyResults($scope.policyId, params).then((policy) => {
            $scope.policy = policy.data;

            if (policy.data.resources.length > 0) {
                $scope.policyName = policy.data.resources[0].policy_name;

                // determine resource status
                $scope.policy.resources.forEach((currentValue, index) => {
                    $scope.policy.resources[index].status =
                        resourceSummary(currentValue);
                });
            }

            $scope.loading = false;
        })
        .catch(() => {
            $scope.policy = null;
            $scope.loading = false;
        });

        if (machine_id) {
            $scope.showSystem(machine_id);
        }
    }

    /*
     * Called when user changes pages
     */
    $scope.paginate = function () {
        $scope.pager.update();
        $location.search('page', $scope.pager.currentPage);
        $location.search('pageSize', $scope.pager.perPage);
        getData();
    };

    /*
     * renames the policy name
     */
    $scope.rename = function (newValue) {
        return Policy.update($scope.policyId, {
            policy_name: newValue
        }).then(function () {
            getData();
        });
    };

    /*
     * determines status of the current resource
     */
    function resourceSummary (resource) {
        if (resource.checks_fail === 0 &&
            resource.checks_error === 0 &&
            resource.checks_pass > 0) {
            return PASSED;
        } else if (resource.checks_fail > 0) {
            return FAILED;
        } else if (resource.checks_error > 0) {
            return ERRORED;
        } else {
            return UNKNOWN;
        }
    }

    /**
     * searches systems in policy
     */
    $scope.search = function (model) {
        $location.search('searchText', model);
        $scope.searchText = model;
        getData();
    };

    $scope.$on('reload:data', function () {
        getData();
    });

    $scope.$on('telemetry:esc', function ($event) {
        if ($event.defaultPrevented) {
            return;
        }

        if ($state.current.name === 'app.view-policy') {
            $state.go('app.list-policies');
        }
    });

    getData();
}

statesModule.controller('ViewPolicyCtrl', ViewPolicyCtrl);
