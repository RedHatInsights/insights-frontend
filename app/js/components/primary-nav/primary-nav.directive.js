/*global require*/
'use strict';

var componentsModule = require('../');
const includes = require('lodash/includes');

/**
* @ngInject
*/

// function primaryNavCtrl($scope, Utils, $state, InsightsConfig, $timeout, $mdSidenav) {
function primaryNavCtrl($scope, Utils, $state, InsightsConfig, User, InsightsJwt) {
    const policyAccounts = {540155: true};

    $scope.canSeePolicies = false;
    $scope.isHidden = false;
    $scope.utils = Utils;
    $scope.state = $state;
    $scope.includes = includes;
    $scope.config = InsightsConfig;
    $scope.doLogout = InsightsJwt.standardLogout;

    $scope.toggleNav = function () {
        $scope.isHidden = !$scope.isHidden;
    };

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
        ],
        policies: [
            'app.view-policy',
            'app.list-policies'
        ]
    };

    function checkPolicies () {
        User.asyncCurrent((user) => {
            let accountNumber = window.sessionStorage.getItem(InsightsConfig.acctKey) ||
                user.account_number;

            $scope.canSeePolicies = policyAccounts[accountNumber];
        });
    }

    $scope.$on('account:change', checkPolicies);

    checkPolicies();
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
