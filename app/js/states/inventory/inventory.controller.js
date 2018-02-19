/*global require*/
'use strict';

const statesModule = require('../');

/**
 * @ngInject
 */
function InventoryCtrl(
        $filter,
        $location,
        $modal,
        $rootScope,
        $scope,
        $state,
        System,
        InventoryService,
        MultiButtonService,
        SystemsService,
        InsightsConfig,
        ReloadService,
        Account,
        FilterService,
        QuickFilters,
        PreferenceService) {

    const DEFAULT_PREDICATE = 'toString';

    $scope.defaultPredicate = $location.search().sort_field || DEFAULT_PREDICATE;

    function updateParams(params) {
        params = FilterService.updateParams(params);

        return params;
    }

    FilterService.setShowFilters(false);

    FilterService.parseBrowserQueryParams();
    System.getProductSpecificData();

    let params = $state.params;

    if (InsightsConfig.authenticate && !PreferenceService.get('loaded')) {
        $rootScope.$on('user:loaded', function () {
            $state.transitionTo('app.inventory', updateParams(params), { notify: false });
        });
    } else {
        $state.transitionTo('app.inventory', updateParams(params), { notify: false });
    }

    function buildRequestQueryParams (paginate, sorter, pager) {
        const query = FilterService.buildRequestQueryParams();

        // offline / systems not checking in
        if (FilterService.getOffline() !== FilterService.getOnline()) {
            query.offline = FilterService.getOffline().toString();
        }

        //search term
        if (FilterService.getSearchTerm()) {
            query.search_term = FilterService.getSearchTerm();
        }

        //sort field/direction
        query.sort_by = sorter.predicate;
        FilterService.setQueryParam('sort_field', sorter.predicate);
        FilterService.setQueryParam('sort_dir', sorter.getSortDirection());

        // special case where we are sorting by timestamp but visually
        // showing timeago
        if (sorter.predicate === 'last_check_in') {
            query.sort_dir = sorter.getSortDirection() === 'ASC' ? 'DESC' : 'ASC';
        } else {
            query.sort_dir = sorter.getSortDirection();
        }

        //pagination
        if (paginate) {
            query.page_size = pager.perPage;

            // programmatic page starts at 0 while ui page starts at 1
            query.page = (pager.currentPage - 1);
        }

        return query;
    }

    $scope.getData = function (paginate, sorter, pager) {
        function getSystemsResponseHandler(response) {
            InventoryService.setTotal(response.data.total);
            SystemsService.systems = response.data.resources;

            return response;
        }

        let query = buildRequestQueryParams(paginate, sorter, pager);

        let promise = null;
        if (FilterService.getParentNode() !== null) {
            query.includeSelf = true;
            promise = System.getSystemLinks(FilterService.getParentNode(), query);
        } else {
            promise = System.getSystemsLatest(query);
        }

        return promise.then(getSystemsResponseHandler);
    };

    $scope.getAllSystems = function (sorter, pager) {
        // For when ALL are selected, not just all visible
        // condensed version of 'getData()'
        let query = buildRequestQueryParams(false, sorter, pager);
        let promise = null;

        if (FilterService.getParentNode() !== null) {
            query.includeSelf = true;
            promise = System.getSystemLinks(FilterService.getParentNode(), query);
        } else {
            promise = System.getSystemsLatest(query);
        }

        return promise;
    };
}

statesModule.controller('InventoryCtrl', InventoryCtrl);
