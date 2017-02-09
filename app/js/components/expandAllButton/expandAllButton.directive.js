'use strict';

var componentsModule = require('../');

function expandAllButtonCtrl($scope, Events) {
    // indicates the action on next click
    // true for expand, false for collapse
    $scope.expand = true;

    $scope.onClick = function () {
        const event = ($scope.expand ? Events.cards.expandAll : Events.cards.collapseAll);
        $scope.$broadcast(event);
        $scope.expand = !$scope.expand;
    };
}

/**
 * When clicked sends Events.cards.expandAll or Events.cards.collapseAll event to children
 * scopes. The button can be in two states: 'expand all', 'collapse all'.
 *
 * @ngInject
 */
function expandAllButton() {
    return {
        templateUrl: 'js/components/expandAllButton/expandAllButton.html',
        restrict: 'E',
        replace: true,
        controller: expandAllButtonCtrl
    };
}

componentsModule.directive('expandAllButton', expandAllButton);
