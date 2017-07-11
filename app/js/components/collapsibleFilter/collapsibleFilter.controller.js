/*global require*/
'use strict';

var componentsModule = require('../');

/**
 * @ngInject
 */
function CollapsibleFilterCtrl($location,
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
function CollapsibleFilterContentLink(scope, element, attrs, collapsibleFilter) {
    scope.collapsibleFilter = collapsibleFilter.api;
}

/**
 * @ngInject
 */
function collapsibleFilter() {
    return {
        templateUrl: 'js/components/collapsibleFilter/collapsibleFilter.html',
        restrict: 'E',
        replace: false,
        transclude: true,
        controller: CollapsibleFilterCtrl,
        scope: {
            searchPlaceholder: '@',
            search: '='
        }
    };
}

/**
 * @ngInject
 */
function collapsibleFilterContent() {
    return {
        templateUrl: 'js/components/collapsibleFilter/collapsibleFilterContent.html',
        restrict: 'E',
        replace: false,
        transclude: true,
        link: CollapsibleFilterContentLink,
        require: '^collapsibleFilter'
    };
}

componentsModule.directive('collapsibleFilter', collapsibleFilter);
componentsModule.directive('collapsibleFilterContent', collapsibleFilterContent);
