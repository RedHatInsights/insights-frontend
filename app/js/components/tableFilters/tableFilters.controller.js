/*global require*/
'use strict';

const componentsModule = require('../');
const priv = {};

/**
 * @ngInject
 */
function TableFiltersCtrl($element,
                               $location,
                               $q,
                               $rootScope,
                               $scope,
                               Events) {

    /**
     * Removes tag from footer and broadcasts the event for reseting the filter
     */
    $scope.removeFilter = function (tagId) {
        delete $scope.tags[tagId];
        $rootScope.$broadcast(Events.filters.removeTag, tagId);
    };

    $scope.hasTags = function () {
        return Object.keys($scope.tags).length > 0;
    };

    /**
     * listens for new tags and adds them to the footer as they come in
     */
    $scope.$on(Events.filters.tag, function (event, tag, filter) {
        $scope.tags[filter] = tag;

        if (tag === null) {
            delete $scope.tags[filter];
        }
    });

    /**
     * exposes an 'open' variable which tracks the state of the table filter so that
     * classes can be applied to the frontend when the filters are open/closed
     */
    priv.toggleTray = function () {
        $scope.open = !$scope.open;
        $scope.$digest();
    };

    $element.bind('show.bs.collapse', priv.toggleTray);
    $element.bind('hidden.bs.collapse', priv.toggleTray);

    function init () {
        $scope.tags = {};
    }

    init();
}

/**
 * @ngInject
 */
function tableFilters() {
    return {
        templateUrl: 'js/components/tableFilters/tableFilters.html',
        restrict: 'E',
        replace: true,
        transclude: true,
        controller: TableFiltersCtrl
    };
}

/**
 * @ngInject
 */
function tableFiltersContent() {
    return {
        templateUrl: 'js/components/tableFilters/tableFiltersContent.html',
        restrict: 'E',
        replace: true,
        transclude: true,
        require: '^tableFilters'
    };
}

componentsModule.directive('tableFilters', tableFilters);
componentsModule.directive('tableFiltersContent', tableFiltersContent);
