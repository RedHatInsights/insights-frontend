'use strict';

var componentsModule = require('../');

/**
 * @ngInject
 */
function actionbarCtrl($scope, $rootScope, ActionbarService) {
    $scope.myActions = ActionbarService.actions;
    $rootScope.$on('$stateChangeStart', function () {
        ActionbarService.clear();
    });
}

function actionbar() {
    return {
        templateUrl: 'js/components/actionbar/actionbar.html',
        restrict: 'E',
        replace: false,
        controller: actionbarCtrl
    };
}

componentsModule.directive('actionbar', actionbar);
