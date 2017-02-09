'use strict';

var componentsModule = require('../../');

/**
 * @ngInject
 */
function actionsMultiButtonCtrl($scope, FilterService) {
    $scope.actionsButtons = [{
        label: 'With Actions',
        stateKey: 'inventoryWithActions',
        icon: 'yes-action',
        toggleCallback: FilterService.doFilter
    }, {
        label: 'Without Actions',
        stateKey: 'inventoryWithoutActions',
        icon: 'no-action',
        toggleCallback: FilterService.doFilter
    }];
}

function actionsMultiButton() {
    return {
        templateUrl:
            'js/components/filterComponents/actionsMultiButton/actionsMultiButton.html',
        restrict: 'E',
        replace: true,
        controller: actionsMultiButtonCtrl
    };
}

componentsModule.directive('actionsMultiButton', actionsMultiButton);
