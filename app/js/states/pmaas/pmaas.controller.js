'use strict';

var statesModule = require('../');
var c3 = require('c3');

// var d3 = require('d3');

const donutVals     = {
    size: {
        width: 240,
        height: 240
    },
    donut: { width: 12 },
    color: {
        pattern: ['#0088CE', '#d1d1d1', 'red']
    },
    data: {
        type: 'donut'
    },
    legend: {
        show: false
    }
};

function donutSettings(obj) {
    return Object.assign({}, donutVals, obj);
}

/**
 * @ngInject
 */
function PmaasCtrl() {
    c3.generate(donutSettings(
    {
        bindto: '.chart-vulnerability',
        data: {
            columns: [
                ['data1', 10],
                ['data2', 10]
            ],
            type: 'donut',
            labels: false
        }
    }));

    c3.generate(donutSettings(
    {
        bindto: '.chart-compliance',
        data: {
            columns: [
                ['data1', 20],
                ['data2', 10]
            ],
            type: 'donut',
            labels: false
        }
    }));

    c3.generate(donutSettings(
    {
        bindto: '.chart-advisor',
        data: {
            columns: [
                ['data1', 10],
                ['data2', 100]
            ],
            type: 'donut',
            labels: false
        }
    }));

    c3.generate(donutSettings(
    {
        bindto: '.chart-subscription',

        data: {
            columns: [
                ['data1', 30],
                ['data2', 20],
                ['data3', 220]
            ],
            type: 'donut',
            labels: false
        }
    }));
}

statesModule.controller('PmaasCtrl', PmaasCtrl);
