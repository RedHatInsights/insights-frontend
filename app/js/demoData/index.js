/*global module, require*/
'use strict';

const find = require('lodash/find');
const fix = require('./fix');
const systems = require('./systems');

const pub  = {
    vars: {
        accountNumber: '6',
    }
};

pub.isFixed = () => {
  return fix.isFixed();
};

pub.reset = () => {
    return fix.reset();
};

pub.applyFixes = () => {
    return fix.applyFixes();
};

pub.getIncidents = () => {
    return {
        "content_html": "<p>Rule hits that have incident<\/p>\n",
        "summary_html": "<p>Rule hits that are incidents. An incident means that it has already occurred.<\/p>\n",
        "rules": [],
        "ruleBinding": "tagged",
        "hitCount": 246,
        "affectedSystemCount": 245,
        "alwaysShow": false,
        "id": 495,
        "title": "Incidents",
        "summary": "Rule hits that are incidents. An incident means that it has already occurred.",
        "content": "Rule hits that have incident",
        "priority": 31,
        "listed": "never",
        "tag": "incident",
        "category": null,
        "severity": null,
        "hidden": false,
        "slug": "incidents"
    };
};

pub.getSystemMetadata = (systemId) => {
    return {
        "bios_information.bios_revision": "4.2",
        "bios_information.release_date": "02/16/2017",
        "bios_information.vendor": "Xen",
        "bios_information.version": "4.2.amazon",
        "host_system_id": systemId,
        "listening_processes.0.ip_addr": "",
        "listening_processes.0.port": ":1:25",
        "listening_processes.0.process_name": "master",
        "listening_processes.1.ip_addr": "",
        "listening_processes.1.port": "::22",
        "listening_processes.1.process_name": "sshd",
        "release": "Red Hat Enterprise Linux Server release 7.3 (Maipo)",
        "rhel_version": "7.3",
        "system_information.family": "Unknown",
        "system_information.manufacturer": "Xen",
        "system_information.product_name": "HVM domU",
        "system_information.virtual_machine": "1",
        "timezone_information.timezone": "EDT",
        "timezone_information.utcoffset": "-14400",
        "system_information.machine_type": "Virtual"
    };
};

pub.getSystems = () => {
    return systems.getSystems();
};

pub.getDemoSystem = (systemId) => {
    return find(systems.getSystems().resources, {'system_id' : systemId});
};

pub.user = {
    loaded: true,
    account_number: pub.vars.accountNumber,
    org_id: '1979710',
    email: 'burr@redhat.com',
    locale: 'en_US',
    is_active: true,
    is_org_admin: true,
    is_internal: true,
    sso_username: 'demo-burr',
    cachehit: false,
    mechanism: 'KeycloakJwtAuth',
    user_key: 'demo-burr',
    autoOptedIn: true,
    settings: {
        dashboard_mode: 'rhel',
        hide_ignored_rules: '0',
        maintenance_plan_category: 'unscheduled',
        osp_deployment: '18ff8199-a84f-463d-99e4-043bd8edd37e'
    },
    permissions: {},
    current_entitlements: {
        unlimitedRHEL: true,
        whitelist: {
            rhel: true,
            osp: true,
            rhev: true,
            docker: true,
            ocp: true
        },
        totalRHEL: 0,
        skus: [
            {
                skuName: 'SER0232',
                quantity: 3000,
                unlimited: true,
                system_count: 0
            },
            {
                skuName: 'SER0409',
                quantity: 70,
                unlimited: true,
                system_count: 0
            },
            {
                skuName: 'SER0422',
                quantity: 100,
                unlimited: true,
                system_count: 0
            },
            {
                skuName: 'SER0421',
                quantity: 100,
                unlimited: true,
                system_count: 0
            },
            {
                skuName: 'ES01139',
                quantity: 1000,
                unlimited: true,
                system_count: 0
            },
            {
                skuName: 'SER0412',
                quantity: 101,
                unlimited: true,
                system_count: 0
            },
            {
                skuName: 'RH00763',
                quantity: 2,
                unlimited: false,
                system_count: 1
            }
        ],
        activeSystemCount: 323,
        systemLimitReached: false
    },
    has_osp: true,
    is_super: false
};

pub.getPolicies = (systemId) => {
    return {
        data: {
            total: 1,
            resources: [
                {
                    created_at: '2018-02-02T16:49:38.000Z',
                    updated_at: '2018-02-02T16:49:38.000Z',
                    account_number: pub.vars.accountNumber,
                    system_id: systemId,
                    policy_id: 'fips-mode-check',
                    policy_name: 'fips-mode-check',
                    raw_output: '',
                    checks_pass: 0,
                    checks_fail: 1,
                    checks_error: 0,
                    check_results: [
                        {
                            name: 'fips mode must be enabled',
                            result: 'fail'
                        }
                    ]
                }
            ],
            policies_pass: 0,
            policies_fail: 1,
            policies_error: 0
        }};
};

pub.getSystemTypes = () => {
    return [
        {
            id: 1001,
            role: 'host',
            product_code: 'apache',
            imageClass: 'fa-globe',
            displayName: 'Web Server',
            displayNameShort: 'Web Server'
        },
        {
            id: 1002,
            role: 'host',
            product_code: 'database',
            imageClass: 'fa-database',
            displayName: 'Database Server',
            displayNameShort: 'Database'
        },
        {
            id: 1003,
            role: 'host',
            product_code: 'app',
            imageClass: 'fa-cubes',
            displayName: 'Application',
            displayNameShort: 'Application Server'
        },
        {
            id: 1004,
            role: 'host',
            product_code: 'network',
            imageClass: 'pficon-network',
            displayName: 'Network',
            displayNameShort: 'Network'
        },
        {
            id: 325,
            role: 'cluster',
            product_code: 'ocp',
            imageClass: 'fa-cubes',
            displayName: 'Red Hat OpenShift Compute Platform',
            displayNameShort: 'OCP Deployment'
        },
        {
            id: 69,
            role: 'cluster',
            product_code: 'osp',
            imageClass: 'fa-cubes',
            displayName: 'Red Hat OpenStack Platform Deployment',
            displayNameShort: 'OSP Deployment'
        },
        {
            id: 315,
            role: 'cluster',
            product_code: 'rhev',
            imageClass: 'fa-object-group',
            displayName: 'Red Hat Virtualization Deployment',
            displayNameShort: 'RHV Deployment'
        },
        {
            id: 49,
            role: 'compute',
            product_code: 'osp',
            imageClass: 'fa-cogs',
            displayName: 'Red Hat OpenStack Platform Compute Node',
            displayNameShort: 'OSP Compute'
        },
        {
            id: 19,
            role: 'container',
            product_code: 'docker',
            imageClass: 'fa-cube',
            displayName: 'Red Hat Container',
            displayNameShort: 'Container'
        },
        {
            id: 39,
            role: 'controller',
            product_code: 'osp',
            imageClass: 'fa-wrench',
            displayName: 'Red Hat OpenStack Platform Controller Node',
            displayNameShort: 'OSP Controller'
        },
        {
            id: 59,
            role: 'director',
            product_code: 'osp',
            imageClass: 'fa-home',
            displayName: 'Red Hat OpenStack Platform Director',
            displayNameShort: 'OSP Director'
        },
        {
            id: 79,
            role: 'host',
            product_code: 'aep'
        },
        {
            id: 9,
            role: 'host',
            product_code: 'docker',
            imageClass: 'fa-ship',
            displayName: 'Red Hat Container Host',
            displayNameShort: 'Container Host'
        },
        {
            id: 105,
            role: 'host',
            product_code: 'rhel',
            imageClass: 'fa-linux',
            displayName: 'Red Hat Enterprise Linux',
            displayNameShort: 'RHEL Server'
        },
        {
            id: 99,
            role: 'hypervisor',
            product_code: 'rhev',
            imageClass: 'fa-server',
            displayName: 'Red Hat Virtualization Hypervisor',
            displayNameShort: 'RHV Hypervisor'
        },
        {
            id: 29,
            role: 'image',
            product_code: 'docker',
            imageClass: 'fa-archive',
            displayName: 'Red Hat Container Image',
            displayNameShort: 'Container Image'
        },
        {
            id: 89,
            role: 'manager',
            product_code: 'rhev',
            imageClass: 'fa-building',
            displayName: 'Red Hat Virtualization Manager',
            displayNameShort: 'RHV Manager'
        },
        {
            id: 335,
            role: 'master',
            product_code: 'ocp',
            imageClass: 'fa-home',
            displayName: 'Red Hat OpenShift Compute Platform Master',
            displayNameShort: 'OCP Master'
        },
        {
            id: 345,
            role: 'node',
            product_code: 'ocp',
            imageClass: 'fa-cogs',
            displayName: 'Red Hat OpenShift Compute Platform Node',
            displayNameShort: 'OCP Node'
        }
    ];
};

module.exports = pub;
