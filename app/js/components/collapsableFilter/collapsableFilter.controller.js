/*global require*/
'use strict';

var componentsModule = require('../');

/**
 * @ngInject
 */
function CollapsableFilterCtrl($location,
                               $q,
                               $rootScope,
                               $scope,
                               Events,
                               Group,
                               IncidentFilters,
                               Severities) {

    $scope.removeFilter = function (tagId) {
        $location.search(tagId, null);
        delete $scope.tags[tagId];
        $rootScope.$broadcast(tagId);
    };

    $scope.hasTags = function () {
        return Object.keys($scope.tags).length > 0;
    };

    $scope.$on(Events.filters.incident, function () {
        addIncidentTag();
    });

    $scope.$on(Events.filters.totalRisk, function () {
        addTotalRiskTag();
    });

    function addTotalRiskTag () {
        if ($location.search()[Events.filters.totalRisk] &&
            $location.search()[Events.filters.totalRisk] !== 'All') {
            $scope.tags[Events.filters.totalRisk] =
                Severities.find((severity) => {
                    return severity.value ===
                        $location.search()[Events.filters.totalRisk];
                }).tag;
        } else {
            delete $scope.tags[Events.filters.totalRisk];
        }
    }

    function addIncidentTag () {
        if ($location.search()[Events.filters.incident] &&
            $location.search()[Events.filters.incident] !== 'all') {
            $scope.tags[Events.filters.incident] =
                IncidentFilters[
                    $location.search()[Events.filters.incident]].tag;
        } else {
            delete $scope.tags[Events.filters.incident];
        }
    }

    function initTags () {
        $scope.tags = {};
        addTotalRiskTag();
        addIncidentTag();
    }

    this.api = $scope;
    initTags();
}

/**
 * @ngInject
 */
function CollapsableFilterContentLink(scope, element, attrs, collapsableFilter) {
    scope.collapsableFilter = collapsableFilter.api;
}

/**
 * @ngInject
 */
function collapsableFilter() {
    return {
        templateUrl: 'js/components/collapsableFilter/collapsableFilter.html',
        restrict: 'E',
        replace: true,
        transclude: true,
        controller: CollapsableFilterCtrl,
        scope: {
            searchPlaceholder: '@',
            search: '='
        }
    };
}

/**
 * @ngInject
 */
function collapsableFilterContent() {
    return {
        templateUrl: 'js/components/collapsableFilter/collapsableFilterContent.html',
        restrict: 'E',
        replace: true,
        transclude: true,
        link: CollapsableFilterContentLink,
        require: '^collapsableFilter'
    };
}

componentsModule.directive('collapsableFilter', collapsableFilter);
componentsModule.directive('collapsableFilterContent', collapsableFilterContent);
