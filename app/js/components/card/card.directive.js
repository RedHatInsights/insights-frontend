/*global require, angular*/
'use strict';

var componentsModule = require('../');

/**
 * @ngInject
 */
function CardCtrl($scope, Utils, Events, $q) {
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

    $scope.$on(Events.cards.toggleCard, $scope.toggleContent);

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
function CardHeaderLink(scope, element, attrs, card) {
    scope.card = card.api;
}

/**
 * @ngInject
 */
function CardHeaderExpandableLink(scope, element, attrs, card) {
    scope.card = card.api;
}

/**
 * @ngInject
 */
function CardContentLink(scope, element, attrs, card) {
    scope.card = card.api;
}

/**
 * @ngInject
 */
function CardFooterLink(scope, element, attrs, card) {
    scope.card = card.api;
}

/**
 * @ngInject
 */
function card() {
    return {
        templateUrl: 'js/components/card/card.html',
        restrict: 'E',
        replace: true,
        transclude: true,
        controller: CardCtrl,
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
function cardHeader() {
    return {
        templateUrl: 'js/components/card/cardHeader.html',
        restrict: 'E',
        replace: true,
        transclude: true,
        link: CardHeaderLink,
        require: '^card'
    };
}

/**
 * @ngInject
 */
function cardHeaderExpandable() {
    return {
        templateUrl: 'js/components/card/cardHeaderExpandable.html',
        restrict: 'E',
        replace: true,
        transclude: true,
        link: CardHeaderExpandableLink,
        require: '^card'
    };
}

/**
 * @ngInject
 */
function cardContent() {
    return {
        templateUrl: 'js/components/card/cardContent.html',
        restrict: 'E',
        replace: true,
        transclude: true,
        link: CardContentLink,
        require: '^card'
    };
}

/**
 * @ngInject
 */
function cardFooter() {
    return {
        templateUrl: 'js/components/card/cardFooter.html',
        restrict: 'E',
        replace: true,
        transclude: true,
        link: CardFooterLink,
        require: '^card'
    };
}

componentsModule.directive('card', card);
componentsModule.directive('cardHeader',  cardHeader);
componentsModule.directive('cardHeaderExpandable',  cardHeaderExpandable);
componentsModule.directive('cardContent', cardContent);
componentsModule.directive('cardFooter',  cardFooter);
