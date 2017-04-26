'use strict';

var componentsModule = require('../../');

/**
 * @ngInject
 */
function actionsBackCtrl($scope, $state, $stateParams) {

    $scope.goBack = function () {
        if ($state.current.name === 'app.actions-rule') {
            $state.go('app.topic', {id: $stateParams.category});
        } else if ($state.current.name === 'app.topic') {
            $state.go('app.actions');
        }
    };

    $scope.$on('telemetry:esc', function ($event) {
        if ($event.defaultPrevented) {
            return;
        }

        $scope.goBack();
    });
}

function actionsBack() {
    return {
        restrict: 'EC',
        scope: {},
        controller: actionsBackCtrl
    };
}

componentsModule.directive('actionsBack', actionsBack);
