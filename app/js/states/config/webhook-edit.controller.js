'use strict';

const statesModule = require('../');
const pickBy = require('lodash/pickBy');
const keyBy = require('lodash/keyBy');
const map = require('lodash/map');
const mapValues = require('lodash/mapValues');
const get = require('lodash/get');
const isEmpty = require('lodash/isEmpty');
const find = require('lodash/find');
const moment = require('moment-timezone');
const sortBy = require('lodash/sortBy');

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
    Group,
    Severities,
    Utils,
    Webhooks) {

    const nullGroup = {
        id: null,
        display_name: gettextCatalog.getString('All Systems (no filtering)')
    };

    $scope.groups = Group.groups;
    $scope.group = {
        selected: nullGroup
    };

    $scope.$watchCollection('groups', importGroup);

    function importGroup () {
        $scope.group.groups = [nullGroup, ...(sortBy(Group.groups, 'display_name'))];

        if ($scope.webhook && $scope.webhook.group_id) {
            const group = find(Group.groups, {id: $scope.webhook.group_id});
            if (group) {
                $scope.group.selected = group;
            }
        }
    }

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
    }, {
        name: 'policy:new',
        description: gettextCatalog.getString('New policy')
    }, {
        name: 'policy:removed',
        description: gettextCatalog.getString('Policy removed')
    }, {
        name: 'policy:result:new',
        description: gettextCatalog.getString('New policy result')
    }, {
        name: 'policy:result:removed',
        description: gettextCatalog.getString('Policy result removed')
    }];

    $scope.loader = new Utils.Loader(false);
    $scope.selected = {
        events: {},
        severityFilters: {},
        certificateExpanded: false
    };
    $scope.errors = {};
    $scope.certificateExpanded = false;

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

        if ($scope.webhook.certificate && $scope.webhook.certificate.trim().length) {
            $scope.webhook.certificate = $scope.webhook.certificate.trim();
        } else {
            $scope.webhook.certificate = null;
        }

        $scope.webhook.group_id = $scope.group.selected.id;

        const fn = (isNew() ? 'create' : 'update');
        return Webhooks[fn]($scope.webhook)
        .success(() => $state.go('app.config', {tab: 'webhooks'}))
        .catch(e => {
            if (get(e, 'status') === 400) {
                const errorKey = get(e, 'data.error.key');

                switch (errorKey) {
                    case 'INVALID_WEBHOOK_URL':
                        $scope.errors.url = true;
                    break;
                    case 'INVALID_WEBHOOK_CERT':
                        $scope.errors.certificate = true;
                    break;
                }
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
            return Webhooks.get($stateParams.id, false)
            .success(webhook => {
                $scope.webhook = webhook;
                importEventTypes(webhook);
                importGroup();
            })
            .catch(() => $state.go('app.config', {tab: 'webhooks'}));
        }
    })();

    $scope.certDateClass = function (date) {
        return (moment().diff(date) < 0) ? 'green' : 'red';
    };

    $scope.$on('telemetry:esc', function ($event) {
        if ($event.defaultPrevented) {
            return;
        }

        $state.go('app.config', {tab: 'webhooks'});
    });
}

statesModule.controller('WebhookEditCtrl', WebhookEditCtrl);
