/*global module*/
'use strict';

const pub  = {};
const priv = {
    accountNumber: '6',

    // Use this as the system id for the demo??
    demoSystemId: 'd18df352-7ac6-5754-a211-593f23f02ad3'
};


pub.user = {
    loaded: true,
    account_number: priv.accountNumber,
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
                    account_number: priv.accountNumber,
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
