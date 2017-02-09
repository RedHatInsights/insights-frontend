'use strict';
/*global alert*/

const statesModule = require('../');

/**
 * @ngInject
 */
function InvitesCtrl($scope, EvaluationInvite, User) {

    const evaluations = [
        {type: 'sales100', systems: 100},
        {type: 'sales250', systems: 250},
        {type: 'sales500', systems: 500},
        {type: 'sales750', systems: 750},
        {type: 'sales1000', systems: 1000}
    ];

    $scope.data = {};
    $scope.evals = evaluations;
    $scope.data.newInvite = evaluations[0];

    $scope.loading = true;
    User.asyncCurrent(function (user) {
        $scope.forbidden = !user.is_internal;
        $scope.loading = false;
    });

    $scope.reset = reset;

    $scope.createNewInvite = function () {
        $scope.successfulInvite = null;
        if (!$scope.data.account) {
            alert('Account Number cannot be blank');
            return;
        }

        const invite = {
            account_number: $scope.data.account,
            email: $scope.data.email,
            type: $scope.data.newInvite.type
        };
        $scope.loading = true;
        EvaluationInvite.create(invite).then(function () {
            $scope.successfulInvite = invite;
            $scope.data.account = null;
            $scope.data.email = null;
        }).catch(function (err) {
            $scope.failedInvite = invite;
            $scope.error = err;
        }).finally(function () {
            $scope.loading = false;
        });
    };

    function reset() {
        $scope.failedInvite = null;
        $scope.successfulInvite = null;
    }
}

statesModule.controller('InvitesCtrl', InvitesCtrl);
