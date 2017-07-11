/*global require*/
'use strict';

const componentsModule = require('../');
const Plotly = require('plotly.js/lib/index-basic');
const d3 = Plotly.d3;
const priv = {};

priv.initTraces = function initTraces($scope) {
    const legendElements = window.jQuery('#metrics g.traces');
    $scope.traces = [];
    $scope.digest.data.forEach(function (data, index) {
        const traceObject = {
            index: index,
            legendElement: window.jQuery(legendElements[index]),
            name: data.name,
            enabled: true
        };

        $scope.traces.push(traceObject);
        traceObject.legendElement.click(function () {
            traceObject.enabled = !traceObject.enabled;
            $scope.$apply();
        });
    });
};

/**
 * @ngInject
 */
function digestGraphController($scope) {
    const jQuery = window.jQuery;

    const graphNode = d3.select('[digest-key=' + $scope.digestKey + '] .digest-graph')
        .append('div')
        .style({
            width: '100%',
            height: '400px'
        }).node();

    Plotly.newPlot(
        graphNode, $scope.digest.data, $scope.digest.layout, $scope.digest.options);

    window.addEventListener('resize', function () {
        Plotly.Plots.resize(graphNode);
    });

    jQuery('a[data-toggle="tab"]').on('shown.bs.tab', function () {
        Plotly.Plots.resize(graphNode);
    });

    $scope.toggleTrace = function toggleTrace(trace) {
        trace.enable = !trace.enabled;
        const val = trace.enabled ? true : 'legendonly';
        Plotly.restyle(graphNode, 'visible', [val], [trace.index]);
    };

    // THIS MUST BE AFTER THE GRAPH IS BUILT
    priv.initTraces($scope, graphNode);
}

function digestGraph() {
    return {
        templateUrl: 'js/components/digest/digestGraph.html',
        restrict: 'E',
        controller: digestGraphController,
        replace: false,
        scope: {
            dropDown: '@',
            digest: '=',
            digestKey: '@',
            width: '@',
            chartType: '@'
        }
    };
}

componentsModule.directive('digestGraph', digestGraph);
