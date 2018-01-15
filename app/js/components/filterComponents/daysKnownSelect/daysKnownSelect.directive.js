'use strict';

const componentsModule = require('../../');

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
    const DEFAULT_OPTION = 0;

    /**
     * Initializes days known filter by checking for the url for
     * the previous filter or defaults to showing all rhsas/pacakges/cves.
     */
    (function init() {
        let option = $location.search()[Events.filters.daysKnown] ?
                     $location.search()[Events.filters.daysKnown] :
                     FilterService.getDaysKnown();

        $scope.selected = $scope.options[option];
        $rootScope.$broadcast(Events.filters.tag,
                              $scope.selected.tag,
                              Events.filters.daysKnown);
    })();

    $scope.select = function (option) {
        // don't do anything if user selects selected option
        if ($scope.selected.title === $scope.options[option].title) {
            return;
        } else {
            $scope.selected = $scope.options[option];

            // no need to set url if selected option is default filter
            if (option !== DEFAULT_OPTION) {
                FilterService.setDaysKnown(option);
            } else {
                FilterService.setDaysKnown(DEFAULT_OPTION);
                FilterService.deleteQueryParam(Events.filters.daysKnown);
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
