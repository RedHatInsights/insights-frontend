'use strict';

var componentsModule = require('../../../');
var reduce = require('lodash/reduce');

/**
 * @ngInject
 */
function GoalsLiteDirectiveCtrl(
    $scope,
    System,
    Evaluation,
    HttpHeaders,
    $q,
    Report) {

    var priv = {};

    // Gauge requires a function
    $scope.getMaxFreeSystems = function () { return $scope.maxFreeSystems; };

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

        $scope.loadingSystemLimit = true;
        const systemPromise =  System.getSystems(false).then(function (result) {
            return result.data.total;
        });

        const evalPromise = Evaluation.getEvaluationStatus().then(function (status) {
            return systemPromise.then(function (systemTotal) {
                const currentEval = status.current;
                $scope.systemCount = systemTotal;
                $scope.maxFreeSystems = currentEval ? currentEval.systems : 0;
                $scope.systemLimitReached = systemTotal >= $scope.maxFreeSystems;

                if (currentEval) {
                    const activationDate = new Date(Date.parse(currentEval.created_at));

                    activationDate.setDate(activationDate.getDate() +
                        currentEval.duration);

                    $scope.expiration = activationDate.toDateString();
                }

            });
        }).catch(function () {
            $scope.errored = true;
        }).finally(function () {
            $scope.loadingSystemLimit = false;
        });

        $scope.getSystemCount = function () { return systemPromise; };

        promises.push(evalPromise);
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
