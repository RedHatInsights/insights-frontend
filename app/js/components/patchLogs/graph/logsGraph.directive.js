'use strict';

const moment = require('moment');
const componentsModule = require('../../');
const Plotly = require('plotly.js/lib/index');
const d3 = Plotly.d3;

let timeArray = [];
for (let i = -30; i < -3; i++) {
    let d = moment().add(i, 'd').format('YYYY-MM-DD');
    timeArray.push(d);
}

timeArray.push(moment().subtract(3, 'd').format('YYYY-MM-DD'));
timeArray.push(moment().subtract(2, 'd').format('YYYY-MM-DD'));
timeArray.push(moment().subtract(1, 'd').format('YYYY-MM-DD'));

console.log('timeArray', timeArray);
console.log('timeArray.length', timeArray.length);

const vulnerability = {
    name: 'Vulnerability',
    type: 'scatter',
    mode: 'lines',
    x: timeArray,
    y: [
        88, 88, 88, 84, 88, 81, 89, 88, 80, 82,
        88, 88, 88, 84, 88, 83, 89, 87, 80, 82,
        88, 88, 88, 84, 88, 80, 89, 86, 84, 82
    ],
    line: {
        color: '#00659c'
    }
};

const compliance = {
    name: 'Compliance',
    type: 'scatter',
    mode: 'lines',
    x: timeArray,
    y: [
        68, 68, 68, 67, 68, 67, 69, 68, 65, 64,
        68, 68, 68, 69, 68, 70, 69, 68, 66, 63,
        68, 68, 68, 66, 68, 69, 69, 68, 64, 68
    ],
    line: {
        color: '#bee1f4'
    }
};

const advisor = {
    name: 'Advisor',
    type: 'scatter',
    mode: 'lines',
    x: timeArray,
    y: [
        73, 73, 73, 74, 74, 74, 75, 78, 77, 76,
        78, 75, 74, 73, 75, 74, 72, 73, 73, 75,
        76, 76, 75, 77, 78, 77, 76, 58, 60, 58
    ],
    line: {
        color: '#39a5dc'
    }
};

const subscription = {
    name: 'Subscription',
    type: 'scatter',
    mode: 'lines',
    x: timeArray,
    y: [
        98, 98, 97, 99, 98, 96, 99, 98, 99, 99,
        98, 98, 98, 97, 99, 98, 99, 98, 99, 97,
        98, 98, 98, 97, 98, 97, 99, 98, 99, 98
    ],
    line: {
        color: '#002235'
    }
};

const data = [vulnerability, compliance, advisor, subscription];

const layout = {
    autosize: true,
    showlegend: false,
    xaxis: {
        autorange: true,
        type: 'date'
    },
    yaxis: {
        autorange: false,
        range: [50, 100]
    },
    margin: {
        l: 30,
        r: 0,
        b: 20,
        t: 10,
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
