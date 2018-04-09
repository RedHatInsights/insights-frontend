'use strict';

const componentsModule = require('../../');
const c3 = require('c3');

function generateC3PieChart() {
    let pieData = {
        type: 'pie',
        colors: {
            'Path MTU Discovery': '#bee1f4',
            Other: '#0088ce'
        },
        columns: [
            ['Path MTU Discovery', 93],
            ['Other', 7]
        ]
    };

    let pieChartBottomConfig = {
        bindto: '.recommendation-graph',
        data: pieData,
        legend: {
            show: true,
            position: 'bottom'
        },
        size: {
            width: 350,
            height: 350
        }
    };

    c3.generate(pieChartBottomConfig);
}

/**
 * @ngInject
 */
function recommendationGraphCtrl($scope, $element, $timeout) {
    $timeout(generateC3PieChart());
}

function recommendationGraph() {
    return {
        templateUrl:
            'js/components/systemMetadata/recommendations/recommendationGraph.html',
        restrict: 'E',
        replace: true,
        controller: recommendationGraphCtrl,
        scope: {
            data: '='
        }
    };
}

componentsModule.directive('recommendationGraph', ['$window', recommendationGraph]);
