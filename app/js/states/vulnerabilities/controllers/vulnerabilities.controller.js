/*global require*/
'use strict';

const statesModule = require('../../');
const moment = require('moment');
const isEmpty = require('lodash/isEmpty');

const SORTABLE_FIELDS = {
    Packages: ['name', 'system_count', 'erratum_count'],
    Errata: ['severity', 'erratum_id', 'system_count', 'package_count', 'cve_count',
        'issued'],
    CVEs: ['score', 'cve_id', 'impact', 'public_date']
};

/**
 * @ngInject
 */
function VulnerabilitiesCtrl($location,
                             $scope,
                             Utils,
                             Events,
                             Vulnerability,
                             VulnerabilitiesViews) {

    $scope.views = VulnerabilitiesViews;
    $scope.pager = new Utils.Pager();

    $scope.data = {
        vulnerabilities: [],
        total: 0
    };

    $scope.selectedView = $location.search().root_view || $scope.views.cve;
    $location.search('root_view', $scope.selectedView);

    $scope.sorter = new Utils.Sorter({
        predicate: $location.search().sort_by || 'id',
        reverse: $location.search().reverse || false
    }, order);

    $scope.sorter.getSortDir = () => $scope.sorter.reverse ? 'DESC' : 'ASC';

    const params = {
        search_term: $location.search().searchText,
        page_size: $scope.pager.perPage
    };

    /*
     * Queries GET:/vulnerabilities and populates table data
     */
    function getData (resetPager = true) {
        if (resetPager) {
            $scope.pager.currentPage = 1;
        }

        $scope.pager.update();
        params.page = $scope.pager.currentPage - 1;

        if (SORTABLE_FIELDS[$scope.selectedView].includes($scope.sorter.predicate)) {
            params.sort_by = $scope.sorter.predicate;
        } else {
            // default to the first param if we get invalid value
            params.sort_by = $scope.sorter.predicate =
                SORTABLE_FIELDS[$scope.selectedView][0];
            $scope.sorter.reverse = $scope.selectedView !== 'Packages';
        }

        params.sort_dir = $scope.sorter.getSortDir();

        let resource = false;
        switch ($scope.selectedView) {
            case $scope.views.package: resource = 'getPackages'; break;
            case $scope.views.errata: resource = 'getRHSAs'; break;
            default: resource = 'getCVEs';
        }

        $scope.loading = true;
        return Vulnerability[resource](params)
        .then(res => {
            $scope.data.total = res.data.total;
            $scope.data.vulnerabilities = res.data.resources;
        })
        .then(() => {
            if ($scope.selectedView === $scope.views.cve) {
                $scope.data.vulnerabilities.forEach(cve => cve.days_known =
                    Math.max(0, moment().diff(cve.public_date, 'days')));
            }
        })
        .finally(() => $scope.loading = false);
    }

    $scope.getData = getData;

    function order () {
        $location.search('sort_by', $scope.sorter.predicate);
        $location.search('reverse', $scope.sorter.reverse);
        getData();
    }

    $scope.changeView = function (view) {
        if (view !== $scope.selectedView) {
            $location.search('root_view', view);
            $scope.selectedView = view;
            $scope.changingView = true;
            $scope.$broadcast(Events.filters.reset);
            $scope.changingView = false;
            getData();
        }
    };

    $scope.search = function (model) {
        if (params.search_term !== model) {
            params.search_term = model;
            getData();
        }
    };

    getData();

    $scope.$on('reload:data', getData);
    $scope.$on('group:change', getData);
    $scope.$on(Events.filters.daysKnown, (event, selection) => {
        if (params.public_date !== selection.filter) {
            params.public_date = selection.filter;

            if (!$scope.changingView) {
                return getData();
            }
        }
    });

    $scope.$on(Events.filters.rhsaSeverity, function (event, filter) {
        filter = (isEmpty(filter)) ? undefined : filter.toLowerCase();

        if (filter === params.severity) {
            return;
        }

        params.severity = filter;

        if (!$scope.changingView) {
            getData();
        }
    });
}

statesModule.controller('VulnerabilitiesCtrl', VulnerabilitiesCtrl);
