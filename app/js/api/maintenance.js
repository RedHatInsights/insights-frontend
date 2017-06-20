'use strict';

var apiModule = require('./');
var map = require('lodash/map');
const URI = require('urijs');

/**
 * @ngInject
 */
function Maintenance(
    $http,
    InsightsConfig,
    AccountService,
    $window,
    DataUtils,
    $rootScope) {

    var root = InsightsConfig.apiRoot;
    var api = {};

    function getMaintenancePlans (filter) {
        return $http.get(
            root +
            'maintenance?filter=' +
            filter +
            AccountService.current('&'))
                .success(DataUtils.readArray(DataUtils.readPlan));
    }

    api.getFutureMaintenancePlans = function () {
        return getMaintenancePlans('future');
    };

    api.getPastMaintenancePlans = function () {
        return getMaintenancePlans('past');
    };

    api.getOverdueMaintenancePlans = function () {
        return getMaintenancePlans('overdue');
    };

    api.getMaintenancePlans = function () {
        return $http.get(root + 'maintenance' + AccountService.current())
            .then(function (res) {
                res.data.forEach(DataUtils.readPlan);
                return res.data;
            });
    };

    api.getMaintenancePlan = function (id) {
        return $http.get(root + 'maintenance/' + id + AccountService.current())
            .success(DataUtils.readPlan);
    };

    api.silence = function (plan) {
        return api.updatePlan(plan.maintenance_id, {silenced: true});
    };

    api.createPlan = function (plan) {
        return $http.post(root + 'maintenance' + AccountService.current(), plan);
    };

    api.updatePlan = function (planId, data) {
        return $http.put(root + 'maintenance/' + planId + AccountService.current(), data)
            .then(function () {
                $rootScope.$broadcast('maintenance:planChanged', planId);
            });
    };

    api.deletePlan = function (plan) {
        return $http.delete(
            root +
            'maintenance/' +
            plan.maintenance_id +
            AccountService.current()).then(function () {
                $rootScope.$broadcast('maintenance:planDeleted', plan.maintenance_id);
            });
    };

    api.addAction = function (planId, reportId) {
        return $http.post(
            root +
            'maintenance/' +
            planId +
            '/actions?report=' +
            reportId +
            AccountService.current('&'));
    };

    api.deleteAction = function (planId, actionId) {
        return $http.delete(
            root +
            'maintenance/' +
            planId +
            '/actions/' +
            actionId +
            AccountService.current());
    };

    api.deleteActions = function (planId, actions) {
        var data = {
            delete: map(actions, 'id')
        };
        return $http.put(root + 'maintenance/' + planId + AccountService.current(), data);
    };

    api.exportPlan = function (planId) {
        var url =
            root +
            'maintenance/' +
            planId +
            '?accept=csv' +
            AccountService.current('&');
        $window.location.assign(url);
    };

    api.generatePlaybook = function (planId, data) {
        data = data || {};
        const url = URI(root);
        url.segment('maintenance');
        url.segment(String(planId));
        url.segment('playbook');
        url.addSearch(AccountService.queryParam());
        return $http.post(url.toString(), data);
    };

    api.downloadPlaybook = function (planId) {
        const url = URI(root);
        url.segment('maintenance');
        url.segment(String(planId));
        url.segment('playbook');
        url.addSearch(AccountService.queryParam());
        return $http.get(url.toString());
    };

    api.SUGGESTION = Object.freeze({
        PROPOSED: 'proposed',
        ACCEPTED: 'accepted',
        REJECTED: 'rejected'
    });

    api.getPlayMetadata = function (planId) {
        const url = URI(root);
        url.segment('maintenance');
        url.segment(String(planId));
        url.segment('playbook');
        url.segment('plays');
        url.addSearch(AccountService.queryParam());
        return $http.get(url.toString());
    };

    api.saveResolutionPreference = function (planId, ruleId, systemTypeId, resolution) {
        const url = URI(root);
        url.segment('maintenance');
        url.segment(String(planId));
        url.segment('playbook');
        url.segment('plays');
        url.segment(ruleId);
        url.segment(String(systemTypeId));
        url.addSearch(AccountService.queryParam());
        return $http.put(url.toString(), {
            resolution_type: resolution
        });
    };

    return api;
}

apiModule.factory('Maintenance', Maintenance);
