'use strict';

const componentsModule = require('../../');
const Plotly = require('plotly.js/lib/index');
const d3 = Plotly.d3;

let storageMtuPoints = [];
for (let i = 0; i < 40; i++) {
    storageMtuPoints.push(1500);
}

for (let i = 0; i < 3; i++) {
    storageMtuPoints.push(2500);
}

for (let i = 0; i < 7; i++) {
    storageMtuPoints.push(4500);
}

for (let i = 0; i < 40; i++) {
    storageMtuPoints.push(9000);
}

const storageMtuTrace = {
    x: storageMtuPoints,
    name: 'Storage MTU',
    type: 'histogram',
    autobinx: false,
    xbins: {
        start: 1,
        end: 12000,
        size: 400
    },
    marker: {
        color: 'rgba(39, 188, 255, 0.4)',
        line: {
            color: 'rgba(39, 188, 255, 0.4)',
            width: 1
        }
    }
};

const storageMtuData = [storageMtuTrace];

const mtuLayout = {
    autosize: false,
    width: 300,
    height: 240,
    title: 'Network Storage MTU',
    xaxis: {
        title: 'MTU Size',
        range: [0, 12000]
    },
    yaxis: {
        title: 'Percentage'
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
            x0: 9000,
            y0: -3,
            x1: 9000,
            y1: 45,
            line: {
                color: 'rgb(0, 150, 0, 1)',
                width: 2
            }
        }]
};

/**
 * @ngInject
 */
function storageMtuGraphCtrl($scope, $element) {
    const storageMtuNode = d3.select($element[0]).append('div').node();

    Plotly.newPlot(storageMtuNode, storageMtuData, mtuLayout, {displayModeBar: false});
}

function storageMtuGraph() {
    return {
        templateUrl:
            'js/components/systemOverviewGraphs/storageMtuGraph/storageMtuGraph.html',
        restrict: 'E',
        replace: true,
        controller: storageMtuGraphCtrl,
        scope: {
            data: '='
        }
    };
}

componentsModule.directive('storageMtuGraph', storageMtuGraph);
