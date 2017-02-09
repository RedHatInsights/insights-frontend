'use strict';

var statesModule = require('../');
const URI = require('urijs');

/**
 * @ngInject
 */
function EvaluationCtrl($scope, $location, $stateParams, Evaluation) {

    $scope.loading = true;
    $scope.successfulActivation = false;
    $scope.cancel = cancel;
    $scope.getExpiration = getExpiration;
    $scope.getNonLegacyEval = getNonLegacyEval;
    $scope.getLegacyEval = getLegacyEval;
    $scope.activateLegacy = activateLegacy;
    $scope.activateNonLegacy = activateNonLegacy;

    init();

    function init() {
        Evaluation.getEvaluationStatus().then(function (status) {
            const originalDestination = $stateParams.originalPath;

            if (originalDestination) { //If we were coerced onto this state
                if (status.purchased || status.current) {

                    const uri = URI(originalDestination);
                    uri.segment(uri.segment().slice(1));
                    $location.url(uri.pathname() + uri.search());
                    return;
                }
            }

            $scope.loading = false;
            $scope.status = status;

        }).catch(function (err) {
            if (err.status === 401) {
                //The auth interceptor will handle the redirect
                return;
            }

            $scope.loading = false;
            $scope.error = 'Could not load evaluation status.';
        });
    }

    function activateNonLegacy() {
        activate(getNonLegacyEval().type);
    }

    function activateLegacy() {
        activate(getLegacyEval().type);
    }

    function activate(type) {
        $scope.loading = true;
        Evaluation.activate(type).then(function () {
            return Evaluation.getEvaluationStatus().then(function (status) {
                $scope.loading = false;
                $scope.successfulActivation = true;
                $scope.status = status;
            });
        }).catch(function () {
            $scope.loading = false;
            $scope.error = 'Could not activate Insights.';
        });
    }

    function cancel() {
        window.location = ('https://access.redhat.com/');
    }

    function getNonLegacyEval() {
        var salesEval = $scope.status.available.find(function (evaluation) {
            return evaluation.type.startsWith('sales');
        });

        if (salesEval) {
            return salesEval;
        }

        return $scope.status.available.find(function (evaluation) {
            return evaluation.type === 'self';
        });
    }

    function getLegacyEval() {
        return $scope.status.available.find(function (evaluation) {
            return evaluation.type === 'legacy';
        });
    }

    function getExpiration() {

        var activatedEvaluation = $scope.status.current;
        const activationDate = new Date(Date.parse(activatedEvaluation.created_at));

        activationDate.setDate(activationDate.getDate() + activatedEvaluation.duration);

        return activationDate.toDateString();
    }
}

statesModule.controller('EvaluationCtrl', EvaluationCtrl);
