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

    function toggleContent () {
        $scope.collapsed = !$scope.collapsed;
    }

    // collapsed by default unless overriden with init-collapsed
    $scope.collapsed = !angular.isDefined($scope.initCollapsed) ||
        Boolean($scope.initCollapsed);

    $scope.toggleContent = function () {
        if ($scope.expandable) {
            $q.when($scope.onToggle({
                ctx: {
                    collapsing: $scope.collapsed
                }
            })).then(toggleContent);
        }
    };

    $scope.removeFilter = function (tagId) {
        delete $location.search()[tagId];
        delete $scope.tags[tagId];
        $rootScope.$broadcast(tagId);
    };

    $scope.resetFilters = function () {
        Group.setCurrent({});
        $scope.$emit('group:change', {});
        $rootScope.$broadcast(Events.filters.reset);
        $scope.tags = {};
    };

    $scope.hasTags = function () {
        return Object.keys($scope.tags).length > 0;
    };

    $scope.$on(Events.filters.incident, function () {
        if ($location.search()[Events.filters.incident]) {
            $scope.tags[Events.filters.incident] =
                IncidentFilters[
                    $location.search()[Events.filters.incident]].tag;
        } else {
            delete $scope.tags[Events.filters.incident];
        }
    });

    $scope.$on(Events.filters.totalRisk, function () {
        if ($location.search()[Events.filters.totalRisk]) {
            $scope.tags[Events.filters.totalRisk] =
                Severities.find((severity) => {
                    return severity.value ===
                        $location.search()[Events.filters.totalRisk];
                }).tag;
        } else {
            delete $scope.tags[Events.filters.totalRisk];
        }
    });

    this.api = $scope;
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
            expandable: '@',
            initCollapsed: '=',
            tags: '=',
            searchPlaceholder: '@',
            search: '=',

            // called when the card is being collapsed / expanded
            // the actual transition happens after this callback returns
            // if the callback returns a promise then the transition happens once the
            // promise completes (if the promise is rejected then the transition is
            // ignored)
            onToggle: '&'
        },
        /*
         * Workaround for https://github.com/angular/angular.js/issues/5695
         * If both directive declaration and template's root element declare ng-class
         * then angular merges its contents which results in invalid JSON
         * Instead of declaring ng-class we handle 'expanded' and
         * 'content-block-expandable' classes programatically here.
         */
        link: function (scope, element) {
            function bindCssClass($scope, element, expression, cls) {
                $scope.$watch(expression, function (val) {
                    if (val) {
                        element.addClass(cls);
                    } else {
                        element.removeClass(cls);
                    }
                });
            }

            bindCssClass(scope, element, '!collapsed', 'expanded');
            bindCssClass(scope, element, 'expandable', 'content-block-expandable');
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
