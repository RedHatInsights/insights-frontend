'use strict';

var componentsModule = require('../../');

/**
 * @ngInject
 */
function configMessagingCtrl($scope, Messaging) {
    Messaging.getCampaigns().success(function (campaigns) {
        $scope.campaigns = campaigns;
    });

    $scope.save = function ($form) {
        Messaging.saveCampaigns($scope.campaigns).then(function () {
            $form.$setPristine();
        });
    };
}

function configMessaging() {
    return {
        templateUrl: 'js/components/config/messaging/messaging.html',
        restrict: 'EA',
        scope: {},
        controller: configMessagingCtrl
    };
}

componentsModule.directive('configMessaging', configMessaging);
