/*global require*/
'use strict';

var componentsModule = require('../../../');

/**
 * @ngInject
 */
function newRulesCtrl($scope, Rule, Utils) {
    $scope.loader = new Utils.Loader(false);

    const load = $scope.loader.bind(function () {
        return Rule.getRulesLatest({publish_date: '-15days'}).then((res) => {
            $scope.rules = res.data.resources;
        });
    });

    $scope.$on('account:change', load);
    load();
}

function newRules() {
    return {
        templateUrl: 'js/components/overview/widgets/newRules/newRules.html',
        restrict: 'E',
        replace: true,
        scope: {},
        controller: newRulesCtrl
    };
}

componentsModule.directive('newRules', newRules);
