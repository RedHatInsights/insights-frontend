'use strict';
var constantsModule = require('./');

constantsModule.constant('VMAAS_PACKAGES', [{
    id: 0,
    name: 'ntp',
    release_date: '2017-01-01',
    critical_count: 0,
    important_count: 0,
    moderate_count: 1,
    low_count: 0,
    rhsas: [{
        id: 'RHSA-2017:3071',
        type: 'Security Advisory',
        synopsis: 'ntp security update',
        severity: 'moderate',
        summary: 'An update for ntp is now available for Red Hat Enterprise Linux ' +
                 '6.<br/>Red Hat Product Security has rated this update as having ' +
                 'a security impact of Moderate. A Common Vulnerability Scoring ' +
                 'System (CVSS) base score, which gives a detailed severity ' +
                 'rating, is available for each vulnerability from the CVE ' +
                 'link(s) in the References section.',
        description: 'An update for ntp is now available for Red Hat Enterprise ' +
                 'Linux 6.<br/>Red Hat Product Security has rated this update as ' +
                 'Scoring having a security impact of Moderate. A Common ' +
                 'Vulnerability System (CVSS) base score, which gives a detailed ' +
                 'severity rating, is available for each vulnerability from the ' +
                 'CVE link(s) in the References section.',
        solution: 'https://access.redhat.com/articles/11258',
        cves: [{
            id: 'CVE-2017-6462',
            systems: [{
                system_id: 'kinlaw-rhel-vm',
                system_type_id: 105,
                toString: 'kinlaw-rhel-vm',
                account_number: '540155',
                report_count: 2,
                last_check_in: '2018-01-08T17:51:18:000Z'
            }]
        }]
    }]
}]);
