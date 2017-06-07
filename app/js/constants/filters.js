'use strict';

var constantsModule = require('./');

constantsModule.constant('IncidentFilters', {
    all: {
        title: 'All',
        tag: 'Incidents: All'
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
