
'use strict';
var constantsModule = require('./');

const SYSTEMS = {
    'kinlaw-rhel-vm': {
        system_id: 'f7473238-1953-415f-8de6-a8da92975a64',
        system_type_id: 105,
        toString: 'kinlaw-rhel-vm',
        account_number: '540155',
        report_count: 2,
        last_check_in: '2018-01-17T13:16:31.000Z'
    },
    'kinlaw-rhel-vm4': {
        system_id: '66a6d090-e1dc-4036-b29f-c0b8cfde433d',
        system_type_id: 105,
        toString: 'kinlaw-rhel-vm4',
        account_number: '540155',
        report_count: 6,
        last_check_in: '2018-01-17T13:16:31.000Z'
    }
};

const CVES = {
    'CVE-2017-6462': {
        id: 'CVE-2017-6462',
        impact: 'Moderate',
        public_date: '2017-02-01',
        iava: '2017-A-0084',
        cwe: 'CWE-20',
        description: 'A vulnerability was found in NTP, in the parsing of ' +
             'packets from the /dev/datum device. A malicious device could send ' +
             'crafted messages, causing ntpd to crash.<br/>Find out more about ' +
             'CVE-2017-6462 from the MITRE CVE dictionary dictionary and NIST NVD.',
        systems: [SYSTEMS['kinlaw-rhel-vm'], SYSTEMS['kinlaw-rhel-vm4']]
    },
    'CVE-2017-6463': {
        id: 'CVE-2017-6463',
        impact: 'Moderate',
        public_date: '2017-02-01',
        iava: '2017-A-0084',
        cwe: 'CWE-20',
        description: 'A vulnerability was discovered in the NTP server\'s ' +
             'parsing of configuration directives. A remote, authenticated ' +
             'attacker could cause ntpd to crash by sending a crafted message.' +
             '<br/>Find out more about CVE-2017-6463 from the MITRE CVE dictionary' +
             ' and NIST NVD.',
        systems: []
    }
};

constantsModule.constant('VMAAS_CVES', [CVES['CVE-2017-6462'],CVES['CVE-2017-6463']]);

constantsModule.constant('VMAAS_PACKAGES_NOCVE', [{
    id: 0,
    name: 'ntp',
    release_date: '2017-01-01',
    critical_count: 0,
    important_count: 0,
    moderate_count: 2,
    low_count: 0,
    version: '4.0',
    rhsas: [{
        id: 'RHSA-2017:3071',
        type: 'Security Advisory',
        synopsis: 'ntp security update',
        severity: 'moderate',
        systems_affected: 2,
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
        systems: [SYSTEMS['kinlaw-rhel-vm'], SYSTEMS['kinlaw-rhel-vm4']]
    }]
}]);

constantsModule.constant('VMAAS_PACKAGES', [{
    id: 0,
    name: 'ntp',
    release_date: '2017-01-01',
    critical_count: 0,
    important_count: 0,
    moderate_count: 2,
    low_count: 0,
    version: '4.0',
    rhsas: [{
        id: 'RHSA-2017:3071',
        type: 'Security Advisory',
        synopsis: 'ntp security update',
        severity: 'moderate',
        systems_affected: 2,
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
        cves: [CVES['CVE-2017-6462'], CVES['CVE-2017-6463']]
    }]
}]);

constantsModule.constant('VMAAS_SYSTEMS', [{
    'kinlaw-rhel-vm': {
        packages: [{
            id: 0,
            name: 'ntp',
            release_date: '2017-01-01',
            version: '4.0',
            critical_count: 0,
            important_count: 0,
            moderate_count: 1,
            low_count: 0,
            rhsas: [{
                id: 'RHSA-2017:3071',
                type: 'Security Advisory',
                synopsis: 'ntp security update',
                severity: 'moderate',
                summary: 'An update for ntp is now available for Red Hat Enterprise ' +
                         'Linux 6.<br/>Red Hat Product Security has rated this update ' +
                         'as having a security impact of Moderate. A Common ' +
                         'Vulnerability Scoring System (CVSS) base score, which gives ' +
                         'a detailed severity rating, is available for each ' +
                         'vulnerability from the CVE link(s) in the References section.',
                description: 'An update for ntp is now available for Red Hat ' +
                         'Enterprise Linux 6.<br/>Red Hat Product Security has rated ' +
                         'this update as Scoring having a security impact of ' +
                         'Moderate. A Common Vulnerability System (CVSS) base score, ' +
                         'which gives a detailed severity rating, is available for ' +
                         'each vulnerability from the CVE link(s) in the References ' +
                         'section.',
                solution: 'https://access.redhat.com/articles/11258',
                hit_count: 1,
                cves: [CVES['CVE-2017-6462'], CVES['CVE-2017-6463']]
            }]
        }]
    }
}]);
