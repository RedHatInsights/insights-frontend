'use strict';

var constantsModule = require('./');

constantsModule.constant('Severities', [
    {
        label: 'All',
        value: 'All',
        icon: 'all'
    }, {
        label: 'Low',
        value: 'INFO',
        icon:  'low'
    }, {
        label: 'Medium',
        value: 'WARN',
        icon: 'med'
    }, {
        label: 'High',
        value: 'ERROR',
        icon: 'high'
    }, {
        label: 'Critical',
        value: 'CRITICAL',
        icon: 'critical'
    }
]);
