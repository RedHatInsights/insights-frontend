'use strict';

let constantsModule = require('./');

constantsModule.constant('IncidentFilters', {
    all: {
        title: 'All',
        tag: null
    },
    incidents: {
        title: 'Incident',
        tag: 'Incidents: Incident'

    },
    nonIncidents: {
        title: 'No Incident',
        tag: 'Incidents: No Incident'
    }
});

constantsModule.constant('AnsibleSupportFilters', {
    all: {
        title: 'All',
        tag: null
    },
    supported: {
        title: 'Supported',
        tag: 'Ansible Support: Supported'
    },
    notSupported: {
        title: 'Not Supported',
        tag: 'Ansible Support: Not Supported'
    }
});

constantsModule.constant('RuleStatusFilters', {
    all: {
        title: 'All',
        tag: null
    },
    active: {
        title: 'Active',
        tag: 'Rule Status: Active'
    },
    ignored: {
        title: 'Ignored',
        tag: 'Rule Status: Ignored'
    }
});

constantsModule.constant('LikelihoodFilters', [
    {
        title: 'All',
        tag: null
    }, {
        title: 'Low',
        tag: 'Likelihood: Low'
    }, {
        title: 'Medium',
        tag: 'Likelihood: Medium'
    }, {
        title: 'High',
        tag: 'Likelihood: High'
    }, {
        title: 'Critical',
        tag: 'Likelihood: Critical'
    }
]);

constantsModule.constant('ImpactFilters', [
    {
        title: 'All',
        tag: null
    }, {
        title: 'Low',
        tag: 'Impact: Low'
    }, {
        title: 'Medium',
        tag: 'Impact: Medium'
    }, {
        title: 'High',
        tag: 'Impact: High'
    }, {
        title: 'Critical',
        tag: 'Impact: Critical'
    }
]);
