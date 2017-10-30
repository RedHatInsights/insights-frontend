'use strict';

var componentsModule = require('../');
const includes = require('lodash/includes');

/**
 * @ngInject
 */
function primaryNavCtrl($scope, Utils, $state, InsightsConfig) {
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
        replace: false,
        controller: primaryNavCtrl
    };
}

componentsModule.directive('primaryNav', primaryNav);
