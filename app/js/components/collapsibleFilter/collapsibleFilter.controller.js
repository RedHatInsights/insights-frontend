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
                               Events) {

    $scope.removeFilter = function (tagId) {
        delete $scope.tags[tagId];
        $rootScope.$broadcast(Events.filters.removeTag, tagId);
    };

    $scope.hasTags = function () {
        return Object.keys($scope.tags).length > 0;
    };

    $scope.$on(Events.filters.tag, function (event, tag, filter) {
        $scope.tags[filter] = tag;

        if (tag === null) {
            delete $scope.tags[filter];
        }
    });

    function init () {
        $scope.tags = {};
    }

    this.api = $scope;
    init();
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
        replace: true,
        transclude: true,
        controller: CollapsibleFilterCtrl,
        scope: {
            searchPlaceholder: '@',
            search: '=',
            throttle: '=?',
            model: '=?',
            hideListSwitch: '=?'
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
        replace: true,
        transclude: true,
        link: CollapsibleFilterContentLink,
        require: '^collapsibleFilter'
    };
}

componentsModule.directive('collapsibleFilter', collapsibleFilter);
componentsModule.directive('collapsibleFilterContent', collapsibleFilterContent);
