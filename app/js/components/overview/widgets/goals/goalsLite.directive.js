'use strict';

var componentsModule = require('../../../');
var reduce = require('lodash/reduce');

/**
 * @ngInject
 */
function GoalsLiteDirectiveCtrl(
    $q,
    $scope,
    System,
    Evaluation,
    HttpHeaders,
    Report,
    Stats) {

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
        $scope.loading = true;

        const promises = [];
        const statsRulesPromise = Stats.getRules()
            .then(function (stats) {
                $scope.securityErrors = stats.data.security;
                $scope.stabilityErrors = stats.data.stability;
            });

        promises.push(statsRulesPromise);

        const statsSystemsPromise = Stats.getSystems()
            .then(function (stats) {
                return stats.data.total;
            });

        const evalPromise = Evaluation.getEvaluationStatus().then(function (status) {
            return statsSystemsPromise.then(function (systemTotal) {
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
        });

        promises.push(evalPromise);

        $q.all(promises).finally(function promisesFinally() {
            $scope.loading = false;
        });

        $scope.getSystemCount = function () { return statsSystemsPromise; };

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
        replace: false
    };
}

componentsModule.directive('goalsLite', goalsLite);
