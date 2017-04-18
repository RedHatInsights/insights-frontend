'use strict';

const componentsModule = require('../');
const sortBy = require('lodash/collection/sortBy');
const takeRight = require('lodash/array/takeRight');

/**
 * @ngInject
 */
function whatShouldIFixCtrl($scope, Rule, Severities) {

    function padZeroes (num) {

        // use this hack like in digests til we have _.orderBy
        var padded = '0000000000' + num;
        padded = padded.substr(('' + num).length);
        return padded;
    }

    Rule.getRulesLatest()
    .then(function (res) {
        var rules = res.data.resources;
        $scope.rules = sortBy(rules, function (r) {
            return [r.rec_likelihood,
                    Severities.indexOf(r.severity),
                    padZeroes(r.report_count),
                    r.ansible];
        });

        $scope.rules = takeRight($scope.rules, 5);
        $scope.rules.reverse();
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
