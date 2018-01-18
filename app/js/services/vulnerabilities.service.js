/*global require*/
'use strict';

var servicesModule = require('./');

/**
 * @ngInject
 */
function VulnerabilitiesService(Utils) {
    const service = {};
    const views = Object.freeze({
        packages: 'packages',
        rhsas: 'RHSAs',
        cves: 'CVEs'
    });
    const DEFAULT_VIEW = views.packages;

    // used only for variables that need basic getter/setter
    const vars = {
        currentView: DEFAULT_VIEW,
        views: views
    };

    Utils.generateAccessors(service, vars);

    return service;
}

servicesModule.service('VulnerabilitiesService', VulnerabilitiesService);
