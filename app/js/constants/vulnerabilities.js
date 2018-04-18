'use strict';

const constantsModule = require('./');

constantsModule.constant('VulnerabilitiesViews', {
    package: 'Packages',
    errata: 'Errata',
    cve: 'CVEs'
});

constantsModule.constant('CVEImpactLevels', ['Low', 'Medium', 'High', 'Critical']);
