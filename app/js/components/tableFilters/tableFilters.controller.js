/*global require*/
'use strict';

const componentsModule = require('../');
const omitBy = require('lodash/omitBy');
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
     * Checks if the Events.filters has the property. if it doesn't,
     * then that means the tag is the key and the filter can have
     * multiple tags.
     */
    $scope.hasMultipleTags = function (key) {
        return !Events.filters.hasOwnProperty(key);
    };

    /**
     * Removes tag from footer and broadcasts the event for reseting the filter
     *
     * @param  {String} key   This will be the filter name if the filter can
     *                        only have one tag. If not it will be the tag.
     * @param  {String} value This will tag if the filter can only have one
     *                        tag. If not it is the name of the filter
     */
    $scope.removeFilter = function (key, value) {
        delete $scope.tags[key];

        if ($scope.hasMultipleTags(key)) {
            $rootScope.$broadcast(Events.filters.removeMultipleTags, value, key);
        } else {
            $rootScope.$broadcast(Events.filters.removeTag, key);
        }
    };

    $scope.hasTags = function () {
        return Object.keys($scope.tags).length > 0;
    };

    /**
     * listens for new tags and adds them to the footer as they come in.
     * Used when a filter can have one or more tags.
     */
    $scope.$on(Events.filters.multipleTags, function (event, tags, filter) {
        if (tags.length === 0 || tags === null) {
            omitBy($scope.tags, function (value, key) {
                if (value === filter) {
                    delete $scope.tags[key];
                }
            });
        } else {
            Object.keys($scope.tags).forEach(function (key) {
                if (tags.indexOf(key) === -1 && $scope.tags[key] === filter) {
                    delete $scope.tags[key];
                }
            });

            tags.forEach(function (tag) {
                $scope.tags[tag] = filter;
            });
        }
    });

    /**
     * listens for new tags and adds them to the footer as they come in.
     * Used when a filter can only have one tag.
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
