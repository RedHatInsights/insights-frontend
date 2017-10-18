'use strict';

var componentsModule = require('../');
var c3 = require('c3');

/**
 * @ngInject
 */
function mitigationTrendController() {
    // puke chart to page
    c3.generate({
        bindto: '.mitigation-chart',
        size: {
            width: 400,
            height: 300
        },
        data: {
            columns: [
                ['Security', 30, 200, 100, 400, 150, 250],
                ['Availability', 50, 20, 10, 40, 15, 25],
                ['Stability', 130, 150, 200, 300, 200, 100],
                ['Performance', 230, 190, 300, 500, 300, 400]
            ],
            type: 'spline'
        }
    });
}

function mitigationTrend() {
    return {
        templateUrl: 'js/components/mitigationTrend/mitigationTrend.html',
        restrict: 'E',
        controller: mitigationTrendController,
        replace: false
    };
}

componentsModule.directive('mitigationTrend', mitigationTrend);
