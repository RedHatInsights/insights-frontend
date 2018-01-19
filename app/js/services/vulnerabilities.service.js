/*global require*/
'use strict';

var servicesModule = require('./');

/**
 * @ngInject
 */
function VulnerabilitiesService($rootScope) {
    const service = {};
    const views = Object.freeze({
        packages: 'Packages',
        rhsas: 'RHSAs'
    });

    // Default view for the vulnerabilites page
    // and vulnerabilities tab in system modal
    const DEFAULT_VIEW = views.packages;

    // The selected view
    let currentView = DEFAULT_VIEW;

    service.setCurrentView = function (view) {
        currentView = view;
        $rootScope.$broadcast('reload:data');
    };

    service.getCurrentView = function () {
        return currentView;
    };

    service.getViews = function () {
        return views;
    };

    return service;
}

servicesModule.service('VulnerabilitiesService', VulnerabilitiesService);
