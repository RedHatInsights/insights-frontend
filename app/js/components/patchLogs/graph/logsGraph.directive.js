'use strict';

const moment = require('moment');
const componentsModule = require('../../');
const Plotly = require('plotly.js/lib/index');
const d3 = Plotly.d3;

let timeArray = [];
const valueArray = [
    30, 38, 44, 35, 22, 25, 27, 38, 24, 32,
    30, 32, 28, 25, 24, 27, 24, 20, 20, 21,
    24, 25, 28, 28, 32, 35, 38, 38, 42, 48,
    50, 44, 40, 38, 36, 34, 32, 28, 25, 25,
    30, 38, 44, 35, 28, 25, 27, 38, 24, 32,
    30, 32, 25, 18, 14, 18, 11,  5,  3,  2,
     5,  8, 12, 15, 22, 25, 27, 26, 24, 32,
    30, 32, 28, 25, 24, 27, 24, 20, 20, 21,
    24, 25, 28, 28, 32, 35, 38, 38, 42, 43,
    42, 42, 44, 40, 36, 34, 32, 28, 25, 25,
    30, 38, 44, 35, 28, 25, 27, 38, 24, 32,
    30, 40, 44, 48, 50, 44, 48, 45, 52, 57,
    61, 22
];

for (let i = -120; i < -1; i++) {
    let d = moment().add(i * 3, 'd').format('YYYY-MM-DD');
    timeArray.push(d);
}

timeArray.push(moment().subtract(3, 'd').format('YYYY-MM-DD'));
timeArray.push(moment().subtract(2, 'd').format('YYYY-MM-DD'));
timeArray.push(moment().subtract(1, 'd').format('YYYY-MM-DD'));

console.log(timeArray);
console.log(timeArray.length);

const systemsUpdated = {
    name: 'System',
    type: 'scatter',
    fill: 'tozeroy',
    mode: 'lines',
    x: timeArray,
    y: valueArray,
    line: {
        color: 'rgba(21, 133, 203, 0.7)'
    },
    fillcolor: 'rgba(21, 133, 203, 0.1)'
};

const data = [systemsUpdated];

const layout = {
    autosize: true,
    showlegend: false,
    xaxis: {
        autorange: true,
        type: 'date'
    },
    yaxis: {
        autorange: false,
        range: [0, 60],
        type: 'linear'
    },
    margin: {
        l: 20,
        r: 0,
        b: 20,
        t: 0,
        pad: 4
    }
};

/**
 * @ngInject
 */
function logsGraphCtrl($scope, $element) {
    const node = d3.select($element[0])
        .append('div')
        .style({
            width: '100%',
            height: '200px'
        })
        .node();

    Plotly.newPlot(node, data, layout, {displayModeBar: false});

    // hack, - this graph isn't initializing to the right size.
    Plotly.Plots.resize(node);

    window.addEventListener('resize', function () {
        let e = window.getComputedStyle(node).display;
        if (e && e !== 'none') {
            Plotly.Plots.resize(node);
        }
    });
}

function logsGraph() {
    return {
        templateUrl:
            'js/components/patchLogs/graph/logsGraph.html',
        restrict: 'E',
        replace: true,
        controller: logsGraphCtrl,
        scope: {
            data: '='
        }
    };
}

componentsModule.directive('logsGraph', logsGraph);
