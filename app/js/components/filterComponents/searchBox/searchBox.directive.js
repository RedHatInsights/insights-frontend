'use strict';

var componentsModule = require('../../');
var throttle = require('lodash/throttle');

const defaultThrottle = 500;

/**
 * Reusable search box component. Supports input throttling.
 *
 * Extension points:
 * - placeholder: defaults to 'Search…' - can be overriden with 'placeholder' attribute
 * - throttle: delay between invocations of on-search callback. Throttling is disabled
 *   when value is set to 0. See https://lodash.com/docs/3.10.1#throttle for details.
 * - on-search: callback to invoke. It is invoked for every change in the search input
 *   field (throttling applied) and for each enter keypress. An enter keypress cancels
 *   a throttled event (if any) and causes on-search to be called right away.
 *
 * @ngInject
 */
function searchBoxCtrl($scope, $location, gettextCatalog, Events) {

    $scope.placeholder = $scope.placeholder || gettextCatalog.getString('Search…');
    $scope.model = $location.search().search_term || null;

    function doOnSearch () {
        if ($scope.onSearch) {
            $scope.onSearch({model: $scope.model || ''});
        }
    }

    function parseThrottleDelay () {
        if ($scope.throttle) {
            const delay = parseInt($scope.throttle);
            if (isNaN(delay)) {
                throw new Error('Unknown throttle value ' + $scope.throttle);
            }

            return delay;
        }

        return defaultThrottle;
    }

    // as _.throttle may call this outside of digestion cycle, we need to use
    // $scope.$apply if needed
    function safeApply (fn) {
        return function () {
            const phase = $scope.$root.$$phase;
            if (phase === '$apply' || phase === '$digest') {
                fn();
            } else {
                $scope.$apply(fn);
            }
        };
    }

    $scope.searching = function () {
        if ($scope.model && $scope.model.length > 0) {
            return true;
        }
    };

    $scope.resetSearch = function () {
        $scope.$broadcast(Events.filters.reset);
    };

    $scope.keyPressed = function ($event) {
        if ($event.keyCode === 13) {
            if ($scope.change.cancel) {
                $scope.change.cancel(); // cancel throttled callbacks
            }

            doOnSearch(); // input submitted - trigger on-search
        }
    };

    const throttleDelay = parseThrottleDelay();
    if (throttleDelay === 0) {
        $scope.change = doOnSearch;
    } else {
        $scope.change = throttle(safeApply(doOnSearch), throttleDelay, {
            leading: false,
            trailing: true
        });
    }

    function resetSearchBar() {
        $scope.model = '';
        doOnSearch();
    }

    $scope.$on('group:change', resetSearchBar);

    $scope.$on(Events.filters.reset, resetSearchBar);
}

function searchBox() {
    return {
        templateUrl: 'js/components/filterComponents/searchBox/searchBox.html',
        restrict: 'E',
        replace: true,
        controller: searchBoxCtrl,
        scope: {
            placeholder: '@',
            model: '=?ngModel',
            onSearch: '&?',
            throttle: '@',
            isFullLength: '='
        }
    };
}

componentsModule.directive('searchBox', searchBox);
