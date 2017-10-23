'use strict';

const componentsModule = require('../../');
const some = require('lodash/some');

/**
 * @ngInject
 */
function configWebhooksCtrl($q, $scope, gettextCatalog, sweetAlert, Utils, Webhooks) {

    $scope.loader = new Utils.Loader(false);

    $scope.init = $scope.loader.bind(function () {
        return Webhooks.get().then(function (res) {
            $scope.webhooks = res.data;
        });
    });

    $scope.activeChanged = Webhooks.update;

    $scope.delete = function (webhook) {
        sweetAlert({
            html: gettextCatalog.getString('Webhook configuration will be lost')
        }).then(function () {
            return Webhooks.delete(webhook);
        }).then($scope.init);
    };

    $scope.ping = Webhooks.ping;
    $scope.isPingable = function () {
        return some($scope.webhooks, 'active');
    };

    $scope.init();
}

function configWebhooks() {
    return {
        templateUrl: 'js/components/config/webhooks/webhooks.html',
        restrict: 'E',
        scope: {},
        controller: configWebhooksCtrl
    };
}

componentsModule.directive('configWebhooks', configWebhooks);
