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
                             DaysKnownFilters) {
    $scope.options = DaysKnownFilters;

    // default option is showing all rhsas
    // index for $scope.options
    const DEFAULT_OPTION = 0;

    /**
     * Initializes days known filter by checking for the url for
     * the previous filter or defaults to showing all rhsas/pacakges/cves.
     */
    (function init() {
        let option = $location.search()[Events.filters.daysKnownSelect] ?
            $location.search()[Events.filters.daysKnownSelect] :
            DEFAULT_OPTION;

        setOption(option);
    })();

    /**
     * Sets the selected option and broadcasts the selected option's
     * tag.
     *
     * @param {Integer} option
     *                    The index of the option to be selected.
     */
    function setOption(option) {
        $scope.selected = $scope.options[option];
        $rootScope.$broadcast(Events.filters.tag,
                              $scope.selected.tag,
                              Events.filters.daysKnownSelect);
    }

    $scope.select = function (option) {
        // don't do anything if user selects selected option
        if ($scope.selected.title === $scope.options[option].title) {
            return;
        } else {
            setOption(option);
        }
    };

    $scope.$on(Events.filters.reset, function () {
        $scope.select(DEFAULT_OPTION);
    });

    $scope.$on(Events.filters.removeTag, function (event, filter) {
        if (filter === Events.filters.likelihood) {
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
