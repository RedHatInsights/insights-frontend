'use strict';

const statesModule = require('../');
const pickBy = require('lodash/pickBy');
const keys = require('lodash/keys');
const keyBy = require('lodash/keyBy');
const mapValues = require('lodash/mapValues');

/**
 * @ngInject
 */
function WebhookEditCtrl($scope, $state, $stateParams, gettextCatalog, Utils, Webhooks) {
    $scope.eventTypes = [{
        name: 'report:new',
        description: gettextCatalog.getString('New report identified')
    }, {
        name: 'report:resolved',
        description: gettextCatalog.getString('Report resolved')
    }, {
        name: 'system:registered',
        description: gettextCatalog.getString('New system registered')
    }, {
        name: 'system:unregistered',
        description: gettextCatalog.getString('System unregistered')
    }];

    $scope.loader = new Utils.Loader(false);
    $scope.selected = {
        events: {}
    };

    function isNew () {
        return $stateParams.id === 'new';
    }

    // TODO validation!!!
    $scope.save = function () {
        if ($scope.webhook.firehose) {
            $scope.webhook.event_types = [];
        } else {
            $scope.webhook.event_types = keys(pickBy($scope.selected.events));
        }

        const fn = (isNew() ? 'create' : 'update');
        return Webhooks[fn]($scope.webhook)
        .success(() => $state.go('app.config', {tab: 'webhooks'}));

        // TODO catch
    };

    $scope.loader.bind(function () {
        if (isNew()) {
            $scope.webhook = {
                active: true,
                firehose: true
            };
        } else {
            return Webhooks.get($stateParams.id)
            .success(webhook => {
                $scope.webhook = webhook;
                $scope.selected.events =
                    mapValues(keyBy($scope.webhook.event_types || []), () => true);
                $scope.webhook.firehose = true; // TODO remove!!!
            })
            .catch(() => $state.go('app.config', {tab: 'webhooks'}));
        }
    })();
}

statesModule.controller('WebhookEditCtrl', WebhookEditCtrl);
