'use strict';

const componentsModule = require('../../');

/**
 * @ngInject
 */
function rhsaSeveritySelectCtrl($rootScope,
                                $scope,
                                $location,
                                gettextCatalog,
                                Events,
                                RhsaSeverityFilters,
                                FilterService) {
    $scope.options = RhsaSeverityFilters;

    // default option is showing all rhsas
    // index for $scope.options
    const DEFAULT_OPTION = 0;
    const URL_QUERY_NAME = 'rhsaSeverity';

    /**
     * Initializes rhsa filter by checking for the url for
     * the previous filter or defaults to showing all rhsas/pacakges/cves.
     */
    (function init() {
        if (!$scope.selected) {
            let option = $location.search()[URL_QUERY_NAME] ?
            $location.search()[URL_QUERY_NAME] : DEFAULT_OPTION;

            $scope.selected = $scope.options[option];
            $rootScope.$broadcast(Events.filters.tag,
                                  $scope.selected.tag,
                                  Events.filters.rhsaSeveritySelect);
        }
    })();

    $scope.select = function (option) {
        // don't do anything if user selects selected option
        if ($scope.selected.title === $scope.options[option].title) {
            return;
        } else {
            $scope.selected = $scope.options[option];

            // no need to set url if default filter
            if (option !== DEFAULT_OPTION) {
                FilterService.setQueryParam(URL_QUERY_NAME, option);
            } else {
                FilterService.setQueryParam(URL_QUERY_NAME, null);
            }

            FilterService.doFilter();
            $rootScope.$broadcast(Events.filters.tag,
                                  $scope.selected.tag,
                                  Events.filters.rhsaSeveritySelect);
            $rootScope.$broadcast(Events.filters.rhsaSeveritySelect, $scope.selected);
        }
    };

    $scope.$on(Events.filters.reset, function () {
        $scope.select(DEFAULT_OPTION);
    });

    $scope.$on(Events.filters.removeTag, function (event, filter) {
        if (filter === Events.filters.rhsaSeveritySelect) {
            $scope.select(DEFAULT_OPTION);
        }
    });
}

function rhsaSeveritySelect() {
    return {
        templateUrl:
          'js/components/filterComponents/rhsaSeveritySelect/rhsaSeveritySelect.html',
        restrict: 'E',
        controller: rhsaSeveritySelectCtrl,
        scope: {}
    };
}

componentsModule.directive('rhsaSeveritySelect', rhsaSeveritySelect);
