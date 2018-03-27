'use strict';

const componentsModule = require('../../');
const Plotly = require('plotly.js/lib/index');
const d3 = Plotly.d3;

let latencyPoints = [];

for (let i = 0; i < 17; i++) {
    latencyPoints.push(30);
}

for (let i = 0; i < 12; i++) {
    latencyPoints.push(25);
    latencyPoints.push(35);
}

for (let i = 0; i < 6; i++) {
    latencyPoints.push(20);
    latencyPoints.push(40);
}

for (let i = 0; i < 3; i++) {
    latencyPoints.push(15);
    latencyPoints.push(45);
}

for (let i = 0; i < 2; i++) {
    latencyPoints.push(10);
    latencyPoints.push(50);
}

for (let i = 0; i < 1; i++) {
    latencyPoints.push(60);
}

for (let i = 0; i < 1; i++) {
    latencyPoints.push(80);
}

const latencyTrace = {
    x: latencyPoints,
    name: 'Latency',
    type: 'histogram',
    autobinx: false,
    xbins: {
        start: 1,
        end: 100,
        size: 5
    },
    marker: {
        color: 'rgba(39, 188, 255, 0.4)',
        line: {
            color: 'rgba(39, 188, 255, 0.4)',
            width: 1
        }
    }
};

const data = [latencyTrace];

const layout = {
    autosize: true,
    title: 'Network Latency',
    xaxis: {
        title: 'Latency (ms)',
        range: [0, 100]
    },
    yaxis: {
        title: '% of Total Systems'
    },
    margin: {
        l: 50,
        r: 30,
        b: 50,
        t: 60,
        pad: 4
    },
    shapes: [
        {
            type: 'line',
            x0: 45,
            y0: -1,
            x1: 45,
            y1: 21,
            line: {
                color: 'rgb(255, 200, 80, 1)',
                width: 2
            }
        }]
};

/**
 * @ngInject
 */
function latencyGraphCtrl($scope, $element) {
    const node = d3.select($element[0])
        .append('div')
        .style({
            width: '100%',
            height: '250px'
        })
        .node();

    Plotly.newPlot(node, data, layout, {displayModeBar: false});
}

function latencyGraph() {
    return {
        templateUrl: 'js/components/systemOverviewGraphs/latencyGraph/latencyGraph.html',
        restrict: 'E',
        replace: true,
        controller: latencyGraphCtrl,
        scope: {
            data: '='
        }
    };
}

componentsModule.directive('latencyGraph',  ['$window', '$timeout', latencyGraph]);
