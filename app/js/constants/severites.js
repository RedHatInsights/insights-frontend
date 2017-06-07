'use strict';

var constantsModule = require('./');

constantsModule.constant('Severities', [
    {
        label: 'All',
        value: 'All',
        icon: 'all',
        tag: 'Total Risk: All'
    }, {
        label: 'Low',
        value: 'INFO',
        icon: 'low',
        tag: 'Total Risk: Low'
    }, {
        label: 'Medium',
        value: 'WARN',
        icon: 'med',
        tag: 'Total Risk: Medium'
    }, {
        label: 'High',
        value: 'ERROR',
        icon: 'high',
        tag: 'Total Risk: High'
    }, {
        label: 'Critical',
        value: 'CRITICAL',
        icon: 'critical',
        tag: 'Total Risk: Critical'
    }
]);
