'use strict';

const statesModule = require('../');
const pickBy = require('lodash/pickBy');
const keyBy = require('lodash/keyBy');
const map = require('lodash/map');
const mapValues = require('lodash/mapValues');
const get = require('lodash/get');
const isEmpty = require('lodash/isEmpty');
const find = require('lodash/find');

const REPORT_NEW = 'report:new';
const REPORT_RESOLVED = 'report:resolved';

/**
 * @ngInject
 */
function WebhookEditCtrl(
    $scope,
    $state,
    $stateParams,
    gettextCatalog,
    Severities,
    Utils,
    Webhooks) {

    $scope.severities = Severities.filter(item => item.value !== 'All').reverse();
    $scope.eventTypes = [{
        name: REPORT_NEW,
        description: gettextCatalog.getString('New report identified')
    }, {
        name: REPORT_RESOLVED,
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
        events: {},
        severityFilters: {}
    };
    $scope.errors = {};

    function isNew () {
        return $stateParams.id === 'new';
    }

    // these are not general-purpose util functions but rather controller-specific
    // utils used repeatedly in this form
    function arrayToObject (array, iteratee) {
        return mapValues(keyBy(array, iteratee), () => true);
    }

    function objectToArray (object, fn) {
        return map(pickBy(object), fn);
    }

    function exportEventTypes () {
        if ($scope.webhook.firehose) {
            return [];
        }

        return objectToArray($scope.selected.events, (value, name) => {
            let filters = null;

            if ((name === REPORT_NEW || name === REPORT_RESOLVED) &&
                !isEmpty($scope.selected.severityFilters)) {
                const severity = objectToArray($scope.selected.severityFilters,
                    (value, severity) => severity);

                if (severity.length) {
                    filters = { severity };
                }
            }

            return { name, filters };
        });
    }

    function importEventTypes (webhook) {
        $scope.selected.events = arrayToObject(webhook.event_types || [], 'name');

        const reportNew = find(webhook.event_types,
            type => type.name === REPORT_NEW || type.name === REPORT_RESOLVED);

        if (reportNew && reportNew.filters && reportNew.filters.severity) {
            $scope.selected.severityFilters = arrayToObject(reportNew.filters.severity);
        } else {
            $scope.selected.severityFilters = arrayToObject($scope.severities, 'value');
        }
    }

    $scope.save = function () {
        $scope.webhook.event_types = exportEventTypes();
        const fn = (isNew() ? 'create' : 'update');
        return Webhooks[fn]($scope.webhook)
        .success(() => $state.go('app.config', {tab: 'webhooks'}))
        .catch(e => {
            if (get(e, 'status') === 400 &&
                get(e, 'data.error.key') === 'INVALID_WEBHOOK_URL') {
                $scope.errors.url = true;
            }
        });
    };

    $scope.loader.bind(function () {
        if (isNew()) {
            $scope.webhook = {
                active: true,
                firehose: true
            };

            $scope.selected.severityFilters = arrayToObject($scope.severities, 'value');
            $scope.selected.events = arrayToObject($scope.eventTypes, 'name');
        } else {
            return Webhooks.get($stateParams.id)
            .success(webhook => {
                $scope.webhook = webhook;
                importEventTypes(webhook);

                if (webhook.firehose === undefined) {
                    $scope.webhook.firehose = true; // TODO remove!!!
                }
            })
            .catch(() => $state.go('app.config', {tab: 'webhooks'}));
        }
    })();
}

statesModule.controller('WebhookEditCtrl', WebhookEditCtrl);
