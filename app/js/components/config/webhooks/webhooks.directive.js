'use strict';

const componentsModule = require('../../');
const assign = require('lodash/assign');
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

    function alert (title, fn, options = {}) {
        const opts = {
            title: title,
            input: 'text',
            type: undefined,
            confirmButtonText: gettextCatalog.getString('Save'),
            inputValidator: function (url) {
                return fn(url).catch(function (e) {
                    if (e.status === 400 && e.data.error &&
                        e.data.error.key === 'INVALID_WEBHOOK_URL') {
                        return $q.reject(gettextCatalog.getString('Invalid URL format'));
                    }

                    return $q.reject(gettextCatalog.getString('Server error'));
                });
            }
        };

        assign(opts, options);
        return sweetAlert(opts);
    }

    $scope.add = function () {
        return alert(
            gettextCatalog.getString('New webhook'),
            url => Webhooks.create({url, active: false}),
            { inputPlaceholder: gettextCatalog.getString('Webhook URL') })
        .then($scope.init);
    };

    $scope.edit = function (webhook) {
        // TODO remove
        return alert(
            gettextCatalog.getString('Edit webhook'),
            url => Webhooks.update({id: webhook.id, url}),
            { inputValue: webhook.url })
        .then((url) => webhook.url = url);
    };

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
