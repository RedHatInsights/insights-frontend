'use strict';

const componentsModule = require('../../');
const find = require('lodash/find');

/**
 * @ngInject
 */
function daysKnownSelectCtrl($rootScope,
                             $scope,
                             $location,
                             gettextCatalog,
                             Events,
                             DaysKnownFilters,
                             FilterService) {

    $scope.options = DaysKnownFilters;

    // default option is showing all rhsas
    // index for $scope.options
    const DEFAULT_OPTION = 'All';

    function parseUrlParam () {
        const paramValue = $location.search()[Events.filters.daysKnown];
        if (paramValue) {
            const found = find($scope.options, {title: paramValue});
            if (found) {
                return found;
            }
        }

        return find($scope.options, {title: DEFAULT_OPTION});
    }

    /**
     * Initializes days known filter by checking for the url for
     * the previous filter or defaults to showing all rhsas/pacakges/cves.
     */
    (function init() {
        $scope.selected = parseUrlParam();
        $rootScope.$broadcast(Events.filters.tag,
                              $scope.selected.tag,
                              Events.filters.daysKnown);
        $rootScope.$broadcast(Events.filters.daysKnown, $scope.selected);
    })();

    $scope.select = function (option) {
        const newOption = find($scope.options, {title: option});

        // don't do anything if user selects selected option
        if ($scope.selected.title === newOption.title) {
            return;
        } else {
            $scope.selected = newOption;

            // no need to set url if selected option is default filter
            if (newOption.title !== DEFAULT_OPTION) {
                $location.search(Events.filters.daysKnown, newOption.title);
            } else {
                $location.search(Events.filters.daysKnown, null);
            }

            FilterService.doFilter();
            $rootScope.$broadcast(Events.filters.tag,
                                  $scope.selected.tag,
                                  Events.filters.daysKnown);
            $rootScope.$broadcast(Events.filters.daysKnown, $scope.selected);
        }
    };

    $scope.$on(Events.filters.reset, function () {
        $scope.select(DEFAULT_OPTION);
    });

    $scope.$on(Events.filters.removeTag, function (event, filter) {
        if (filter === Events.filters.daysKnown) {
            $scope.select(DEFAULT_OPTION);
        }
    });
}

function daysKnownSelect() {
    return {
        templateUrl:
          'js/components/filterComponents/daysKnownSelect/daysKnownSelect.html',
        restrict: 'E',
        controller: daysKnownSelectCtrl,
        scope: {}
    };
}

componentsModule.directive('daysKnownSelect', daysKnownSelect);
