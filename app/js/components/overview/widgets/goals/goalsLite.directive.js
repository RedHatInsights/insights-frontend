'use strict';

var componentsModule = require('../../../');
var reduce = require('lodash/collection/reduce');

/**
 * @ngInject
 */
function GoalsLiteDirectiveCtrl(
    $scope,
    HttpHeaders,
    $q,
    Report) {

    var priv = {};

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
    };

    $scope.$on('account:change', function () {
        priv.getActionsData();
    });

    priv.getActionsData();
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
