'use strict';

var componentsModule = require('../');

function systemOverviewGraphs() {
    return {
        scope: {
        },
        templateUrl: 'js/components/systemOverviewGraphs/systemOverviewGraphs.html',
        restrict: 'E',
        replace: true
    };
}

componentsModule.directive('systemOverviewGraphs', systemOverviewGraphs);
