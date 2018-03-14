/*global require, angular*/
'use strict';

var componentsModule = require('../');

/**
 * @ngInject
 */
function ListItemCtrl($scope, Utils, Events, $q) {
    var priv = {};
    var vars = {};

    priv.toggleContent = function () {
        $scope.collapsed = !$scope.collapsed;
    };

    // collapsed by default unless overriden with init-collapsed
    $scope.collapsed = !angular.isDefined($scope.initCollapsed) ||
        Boolean($scope.initCollapsed);

    // do this as soon as all the accessibles are defined (aka define vars, run dis)
    Utils.generateAccessors($scope, vars);

    $scope.toggleContent = function () {
        if ($scope.expandable) {
            $q.when($scope.onToggle({
                ctx: {
                    collapsing: !$scope.collapsed
                }
            })).then(priv.toggleContent);
        }
    };

    $scope.$on(Events.cards.expandAll, function () {
        if ($scope.collapsed) {
            $scope.toggleContent();
        }
    });

    $scope.$on(Events.cards.collapseAll, function () {
        if (!$scope.collapsed) {
            $scope.toggleContent();
        }
    });

    this.api = $scope;
}

/**
 * @ngInject
 */
function ListItemHeaderLink(scope, element, attrs, listItem) {
    scope.listItem = listItem.api;
}

/**
 * @ngInject
 */
function ListItemHeaderExpandableLink(scope, element, attrs, listItem) {
    scope.listItem = listItem.api;
}

/**
 * @ngInject
 */
function ListItemContentLink(scope, element, attrs, listItem) {
    scope.listItem = listItem.api;
}

/**
 * @ngInject
 */
function listGroup() {
    return {
        templateUrl: 'js/components/list/list-group.html',
        restrict: 'E',
        replace: true,
        transclude: true
    };
}

/**
 * @ngInject
 */
function listItem() {
    return {
        templateUrl: 'js/components/list/list-item.html',
        restrict: 'E',
        replace: true,
        transclude: true,
        controller: ListItemCtrl,
        scope: {
            expandable: '@',
            initCollapsed: '=',

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
        }
    };
}

/**
* @ngInject
*/
function listItemHeader() {
    return {
        templateUrl: 'js/components/list/list-item-header.html',
        restrict: 'E',
        replace: true,
        transclude: true,
        link: ListItemHeaderLink,
        require: '^listItem'
    };
}

/**
 * @ngInject
 */
function listItemHeaderExpandable() {
    return {
        templateUrl: 'js/components/list/list-item-header-expandable.html',
        restrict: 'E',
        replace: true,
        transclude: true,
        link: ListItemHeaderExpandableLink,
        require: '^listItem'
    };
}

/**
 * @ngInject
 */
function listItemContent() {
    return {
        templateUrl: 'js/components/list/list-item-content.html',
        restrict: 'E',
        replace: true,
        transclude: true,
        link: ListItemContentLink,
        require: '^listItem'
    };
}

componentsModule.directive('listGroup', listGroup);
componentsModule.directive('listItem', listItem);
componentsModule.directive('listItemHeader', listItemHeader);
componentsModule.directive('listItemHeaderExpandable', listItemHeaderExpandable);
componentsModule.directive('listItemContent', listItemContent);
