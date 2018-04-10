'use strict';

const componentsModule = require('../../');
const c3 = require('c3');

function generateC3PieChart(c3class) {
    let pieData = {
        type: 'pie',
        colors: {
            Present: '#ededed',
            'Not Present': '#0088ce'
        },
        columns: [
            ['Present', 93],
            ['Not Present', 7]
        ]
    };

    let pieChartBottomConfig = {
        bindto: '.' + c3class,
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
    $scope.c3class = 'recommendation-graph-' + $scope.recommendation.id;
    $timeout(() => generateC3PieChart($scope.c3class));
}

function recommendationGraph() {
    return {
        templateUrl:
            'js/components/systemMetadata/recommendations/recommendationGraph.html',
        restrict: 'E',
        replace: true,
        controller: recommendationGraphCtrl,
        scope: {
            recommendation: '='
        }
    };
}

componentsModule.directive('recommendationGraph', ['$window', recommendationGraph]);
