/*global require*/
'use strict';

const componentsModule = require('../');
const Plotly = require('plotly.js/lib/index-basic');
const d3 = Plotly.d3;
const priv = {};
const jQuery = window.jQuery;

priv.initTraces = function initTraces($scope) {
    const legendElements = jQuery('#metrics g.traces');
    $scope.traces = [];
    $scope.digest.data.forEach(function (data, index) {
        const traceObject = {
            index: index,
            legendElement: jQuery(legendElements[index]),
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

    $scope.$watch('traces', (newTraces, oldTraces) => {
        let newTrace;
        newTraces.forEach((trace, index) => {
            if (trace.index === oldTraces[index].index &&
                trace.enabled !== oldTraces[index].enabled) {
                newTrace = trace;
            }
        });

        if (newTrace) {
            newTrace.enable = !newTrace.enabled;
            const val = newTrace.enabled ? true : 'legendonly';
            Plotly.restyle(graphNode, 'visible', [val], [newTrace.index]);
        }
    }, true);

    // THIS MUST BE AFTER THE GRAPH IS BUILT
    priv.initTraces($scope, graphNode);
}

function digestGraph() {
    return {
        templateUrl: 'js/components/digest/digestGraph.html',
        restrict: 'E',
        controller: digestGraphController,
        replace: true,
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
