/*global require*/
'use strict';

const componentsModule = require('../');
const Plotly = require('plotly.js/lib/index-basic');
const d3 = Plotly.d3;

/**
 * @ngInject
 */
function digestGraphController($scope) {
    var jQuery = window.jQuery;

    // puke chart to page
    // var bindto = document.querySelector('[digest-key=' + $scope.digestKey + ']');
    // Plotly.newPlot(
    //     bindto, $scope.digest.data, $scope.digest.layout, $scope.digest.options);

    var gd3 = d3.select('[digest-key=' + $scope.digestKey + ']')
        .append('div')
        .style({
            width: '100%',
            height: '400px'
        });

    var gd = gd3.node();

    Plotly.newPlot(
        gd, $scope.digest.data, $scope.digest.layout, $scope.digest.options);

    window.addEventListener('resize', function () {
        Plotly.Plots.resize(gd);
    });

    jQuery('a[data-toggle="tab"]').on('shown.bs.tab', function () {
        Plotly.Plots.resize(gd);
    });
}

function digestGraph() {
    return {
        templateUrl: 'js/components/digest/digestGraph.html',
        restrict: 'E',
        controller: digestGraphController,
        replace: true,
        scope: {
            digest: '=',
            digestKey: '@',
            width: '@',
            chartType: '@'
        }
    };
}

componentsModule.directive('digestGraph', digestGraph);
