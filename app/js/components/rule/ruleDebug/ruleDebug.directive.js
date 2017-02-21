'use strict';

var componentsModule = require('../../');
var get = require('lodash/object/get');

/**
 * @ngInject
 */
function RuleDebugCtrl(
    $scope,
    Rule,
    Report,
    $state,
    System,
    $q,
    SystemsService,
    $filter,
    RuleAdminService,
    AccountService,
    Utils) {

    const filter = $filter('filter');
    $scope.account = AccountService;
    $scope.reportLoader = new Utils.Loader(false);

    $scope.invalidJSON = false;
    $scope.noReports = false;
    $scope.selected = {};
    $scope.debug = {};
    $scope.reports = [];

    $scope.buildPreview = function (debug) {
        return Rule.preview($scope.rule, debug).then(function (res) {
            $scope.previewError = false;
            const system = res.data;
            $scope.system = system;
            let report = system.reports[0];
            if (!report.system_id) {
                $scope.noReports = true;
            }

            if (debug && debug.pydata) { // unselect a system if one is selected
                delete $scope.selected.report;
            }

            $scope.$parent.$parent.report = report; // $parent because ng-if and card
        }).catch(function (res) {
            $scope.previewError = res.data;
        }).finally(function () {
            $scope.loading.isLoading = false;
        });
    };

    $scope.validatePydata = function (pydata) {
        $scope.invalidJSON = false;
        if (!pydata) {
            return;
        }

        try {
            JSON.parse(pydata);
        } catch (e) {
            $scope.invalidJSON = true;
            $scope.jsonError = e.message;
        }
    };

    // rule preview - report filtering
    const filters = ['id', 'uuid', 'system.toString', 'account_number'].map(prop => {
        return function (report, query) {
            return String(get(report, prop)).includes(query);
        };
    });

    $scope.getReports = function (query) {
        return filter($scope.reports, function (report) {
            return filters.some(f => f(report, query));
        }).slice(0, 50);
    };

    $scope.reportGroupFn = function (report) {
        return report.account_number;
    };

    $scope.buildPreview();

    // TODO: this should not be needed here!
    if (!SystemsService.getSystemTypes().length) {
        System.getSystemTypes().then(function (res) {
            $scope.systemTypes = res.data;
            SystemsService.setSystemTypes(res.data);
        });
    }

    // TODO: workaround for https://trello.com/c/Ps2lXYGr/21
    function readSystem (r) {
        r.system.toString = Utils.getSystemDisplayName(r.system);
    }

    function loadPerAccountReports () {
        Report.getReportsLatest({
            rule: $scope.rule.rule_id,
            expand: 'system'
        }).then(function (response) {
            if (response && response.data) {
                $scope.reports = response.data.resources;
                $scope.reports.forEach(readSystem);
            }
        });
    }

    $scope.allReportsLoaded = false;

    $scope.loadAllReports = $scope.reportLoader.bind(function () {
        const rule_id = $scope.rule.rule_id;
        return RuleAdminService.globalCache.get(rule_id).then(function (reports) {
            $scope.reports = reports;
            $scope.reports.forEach(readSystem);
            $scope.allReportsLoaded = true;
        });
    });

    if (RuleAdminService.globalCache.contains($scope.rule.rule_id)) {
        $scope.loadAllReports();
    } else {
        loadPerAccountReports();
    }
}

function ruleDebug() {
    return {
        controller: RuleDebugCtrl,
        templateUrl: 'js/components/rule/ruleDebug/ruleDebug.html',
        restrict: 'E'
    };
}

componentsModule.directive('ruleDebug', ruleDebug);
