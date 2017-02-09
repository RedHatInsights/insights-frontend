'use strict';

var componentsModule = require('../../../');
var reduce = require('lodash/collection/reduce');

/**
 * @ngInject
 */
function GoalsLiteDirectiveCtrl(
    $modal,
    $scope,
    User,
    System,
    HttpHeaders,
    $q,
    OverviewService,
    MaxFreeSystems,
    Report) {

    var systemModal = null;
    var priv = {};

    // Gauge requires a function
    $scope.getMaxFreeSystems = function () { return MaxFreeSystems; };

    $scope.maxFreeSystems = MaxFreeSystems;

    $scope.getSystemCount = function () {
        let dfrd = $q.defer();
        $scope.loadingSystemCount = true;
        System.getSystems(false).success(function (result) {
            dfrd.resolve((result.total <= MaxFreeSystems) ?
                         result.total : MaxFreeSystems);
        }).error(function () {
            $scope.errored = true;
        }).finally(function () {
            $scope.loadingSystemCount = false;
        });

        return dfrd.promise;
    };

    $scope.loadingSystemLimit = true;

    // opens modal for
    $scope.registerSystem = function () {
        priv.openModal({
            templateUrl: 'js/components/system/addSystemModal/' +
                ($scope.systemLimitReached ?
                    'upgradeSubscription.html' :
                    'addSystemModal.html'),
            windowClass: 'system-modal ng-animate-enabled',
            backdropClass: 'system-backdrop ng-animate-enabled',
            controller: 'AddSystemModalCtrl'
        });
    };

    priv.openModal = function (opts) {
        if (systemModal) {
            return; // Only one modal at a time please
        }

        systemModal = $modal.open(opts);
        systemModal.result.finally(function () {
            systemModal = null;
        });
    };

    priv.getSevCount = function (sev, data) {
        return reduce(data, function (sum, obj) {
            if (obj.severity === sev) { return sum + 1; }

            return 0;
        }, 0);
    };

    priv.getActionsData = function () {
        $scope.actionsLoading = true;

        const promises = [];
        const securityErrorPromise = Report.headReports({
            category: 'Security',
            severity: 'ERROR'
        }).then(function securityErrorPromiseHandler(response) {
            $scope.securityErrors = response.headers(HttpHeaders.resourceCount);
        });

        promises.push(securityErrorPromise);

        const stabilityErrorPromise = Report.headReports({
            category: 'Stability',
            severity: 'ERROR'
        }).then(function stabilityErrorPromiseHandler(response) {
            $scope.stabilityErrors = response.headers(HttpHeaders.resourceCount);
        });

        promises.push(stabilityErrorPromise);

        $q.all(promises).finally(function promisesFinally() {
            $scope.actionsLoading = false;
        });

        User.asyncCurrent(function (user) {
            System.getSystems(false).success(function (result) {
                $scope.systemCount = result.total;
                $scope.systemLimitReached = (result.total >= MaxFreeSystems) ?
                    true :
                    !user.is_internal;
                $scope.loadingSystemLimit = false;
            });
        });
    };

    $scope.$on('account:change', function () {
        priv.getActionsData();
    });

    priv.getActionsData();
    $scope.getSystemCount();
}

function goalsLite() {
    return {
        templateUrl: 'js/components/overview/widgets/goals/goalsLite.html',
        restrict: 'E',
        controller: GoalsLiteDirectiveCtrl,
        replace: true
    };
}

componentsModule.directive('goalsLite', goalsLite);
