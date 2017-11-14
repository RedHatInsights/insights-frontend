'use strict';

var componentsModule = require('../');
const includes = require('lodash/includes');

/**
 * @ngInject
 */
function primaryNavCtrl($scope, Utils, $state, InsightsConfig, $timeout, $mdSidenav) {
    $scope.toggleLeft = buildToggler('left');

    $scope.isOpenLeft = function () {
        return $mdSidenav('left').isOpen();
    };

    $scope.isCloseLeft = function () {
        return $mdSidenav('left').isClosed();
    };

    function buildToggler(navID) {
        return function () {
            $mdSidenav(navID).toggle();
        };
    }

    $scope.utils = Utils;
    $scope.state = $state;
    $scope.includes = includes;
    $scope.config = InsightsConfig;

    $scope.states = {
        rules: [
            'app.rules',
            'app.admin-rules',
            'app.admin-rule-tags',
            'app.create-rule',
            'app.show-rule',
            'app.edit-rule'
        ],
        actions: [
            'app.actions',
            'app.actions-rule',
            'app.topic'
        ],
        config: [
            'app.config',
            'app.config-webhook-edit'
        ]
    };
}

function primaryNav() {
    return {
        templateUrl: 'js/components/primary-nav/primary-nav.html',
        restrict: 'E',
        replace: true,
        controller: primaryNavCtrl
    };
}

componentsModule.directive('primaryNav', primaryNav);
