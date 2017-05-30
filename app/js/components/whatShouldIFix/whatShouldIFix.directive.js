'use strict';

const componentsModule = require('../');
const orderBy = require('lodash/orderBy');
const map = require('lodash/map');

/**
 * @ngInject
 */
function whatShouldIFixCtrl($scope, Rule, Severities) {
    Rule.getRulesLatest()
    .then(function (res) {
        var rules = res.data.resources;

        // need numerical values for severities for sorting below
        rules = map(rules, function (r) {
            r.severityIdx = Severities.indexOf(r.severity);
            return r;
        });

        $scope.rules = orderBy(
            rules,
            ['rec_likelihood', 'severityIdx', 'report_count', 'ansible'],
            ['desc', 'desc', 'desc', 'desc']
        ).slice(0, 5);
    });
}

function whatShouldIFix() {
    return {
        templateUrl: 'js/components/whatShouldIFix/whatShouldIFix.html',
        restrict: 'E',
        replace: true,
        controller: whatShouldIFixCtrl
    };
}

componentsModule.directive('whatShouldIFix', whatShouldIFix);
