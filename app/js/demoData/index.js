/*global module, require*/
'use strict';

const reports = require('./reports');

const pub  = {
    vars: {
        accountNumber: '6',

        // Use this as the system id for the demo??
        demoSystemId: 'd18df352-7ac6-5754-a211-593f23f02ad3',
        demoSystemName: 'apache0.us-east.insights.redhat.com'
    }
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

pub.getDemoSystem = (systemId) => {
    return {
        toString: pub.vars.demoSystemName,
        isCheckingIn: false,
        system_id: systemId,
        display_name: null,
        remote_branch: null,
        remote_leaf: null,
        account_number: '6',
        hostname: pub.vars.demoSystemName,
        last_check_in: '2018-03-20T13:17:48.000Z',
        created_at: '2016-09-30T19:19:40.000Z',
        updated_at: '2018-03-20T13:17:48.000Z',
        unregistered_at: null,
        system_type_id: 105,
        role: 'host',
        product_code: 'rhel',
        report_count: 11,
        reports: reports.getReports(),
        acks: [],
        parent_id: null,
        stale_ack: false,
        type: 'machine',
        product: 'rhel'

    };
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

pub.systemTypes = [
    {
        id: 325,
        role: 'cluster',
        product_code: 'ocp'
    },
    {
        id: 69,
        role: 'cluster',
        product_code: 'osp'
    },
    {
        id: 315,
        role: 'cluster',
        product_code: 'rhev'
    },
    {
        id: 49,
        role: 'compute',
        product_code: 'osp'
    },
    {
        id: 19,
        role: 'container',
        product_code: 'docker'
    },
    {
        id: 39,
        role: 'controller',
        product_code: 'osp'
    },
    {
        id: 59,
        role: 'director',
        product_code: 'osp'
    },
    {
        id: 79,
        role: 'host',
        product_code: 'aep'
    },
    {
        id: 9,
        role: 'host',
        product_code: 'docker'
    },
    {
        id: 105,
        role: 'host',
        product_code: 'rhel'
    },
    {
        id: 99,
        role: 'hypervisor',
        product_code: 'rhev'
    },
    {
        id: 29,
        role: 'image',
        product_code: 'docker'
    },
    {
        id: 89,
        role: 'manager',
        product_code: 'rhev'
    },
    {
        id: 335,
        role: 'master',
        product_code: 'ocp'
    },
    {
        id: 345,
        role: 'node',
        product_code: 'ocp'
    }
];

module.exports = pub;
