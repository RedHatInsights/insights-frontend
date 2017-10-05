'use strict';

var componentsModule = require('../../../');
var reduce = require('lodash/collection/reduce');

/**
 * @ngInject
 */
function GoalsLiteDirectiveCtrl(
    $scope,
    HttpHeaders,
    InsightsConfig,
    $q,
    Report,
    Stats) {

    var priv = {};

    $scope.gettingStartedLink = InsightsConfig.gettingStartedLink;

    priv.getSevCount = function (sev, data) {
        return reduce(data, function (sum, obj) {
            if (obj.severity === sev) { return sum + 1; }

            return 0;
        }, 0);
    };

    priv.getActionsData = function () {
        let promises = [];

        $scope.actionsLoading = true;

        const ruleStats = Stats.getRules().then(function (stats) {
            $scope.securityErrors = stats.data.security;
            $scope.stabilityErrors = stats.data.stability;
        });

        const systemStats = Stats.getSystems().then(function (stats) {
            $scope.systemCount = stats.data.total;
        });

        promises.push(ruleStats);
        promises.push(systemStats);

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
