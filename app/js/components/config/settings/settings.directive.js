'use strict';

var componentsModule = require('../../');

/**
 * @ngInject
 */
function configSettingsCtrl($scope, AccountSettings) {

    $scope.loading = true;
    AccountSettings.get().success(function (settings) {
        $scope.settings = settings;
    }).finally(function () {
        $scope.loading = false;
    });

    $scope.save = function () {
        $scope.loading = true;
        AccountSettings.update($scope.settings).catch(function () {
            //TODO: handle the error
            window.alert('Only an org admin is allowed to change this setting');
        }).finally(function () {
            $scope.loading = false;
        });
    };
}

function configSettings() {
    return {
        templateUrl: 'js/components/config/settings/settings.html',
        restrict: 'EA',
        scope: {},
        controller: configSettingsCtrl
    };
}

componentsModule.directive('configSettings', configSettings);
