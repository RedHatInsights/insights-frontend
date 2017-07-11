'use strict';

var componentsModule = require('../');
const includes = require('lodash/includes');

/**
 * @ngInject
 */
function sideNavCtrl($scope, Utils, $state, InsightsConfig) {
    $scope.isHidden = false;
    $scope.toggleNav = function () {
        $scope.isHidden = !$scope.isHidden;
    };

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
        ]
    };
}

function sideNav() {
    return {
        templateUrl: 'js/components/sideNav/sideNav.html',
        restrict: 'E',
        replace: false,
        controller: sideNavCtrl
    };
}

componentsModule.directive('sideNav', sideNav);
