// jshint ignore: start
// jscs:disable
'use strict';

let constantsModule = require('./');

constantsModule.constant('DemoData', {
    systems: {
        "resources": [
            {
                "toString": "openshift0.us-east.insights.redhat.com",
                "isCheckingIn": true,
                "system_id": "d18df352-7ac6-5754-a211-593f23f02ad3",
                "display_name": null,
                "remote_branch": null,
                "remote_leaf": null,
                "account_number": "6",
                "hostname": "openshift0.us-east.insights.redhat.com",
                "last_check_in": "2018-03-15T04:01:01.000Z",
                "created_at": "2016-09-30T19:19:40.000Z",
                "updated_at": "2018-03-15T04:01:01.000Z",
                "unregistered_at": null,
                "system_type_id": 325,
                "role": "cluster",
                "product_code": "ocp",
                "product_name": "OpenShift",
                "system_status": "error",
                "infra_status": "warning",
                "reliability": "warning",
                "improvement": "ok",
                "report_count": 11,
                "policies": {
                    "total": 0,
                    "resources": [],
                    "policies_pass": 0,
                    "policies_fail": 0,
                    "policies_error": 0
                },
                "metadata": {},
                "reports": {},
                "groups": []
            },
            {
                "toString": "apache0.us-west.insights.redhat.com",
                "isCheckingIn": true,
                "system_id": "c7ee0976-c397-5157-859b-325c2447dfe0",
                "display_name": null,
                "remote_branch": null,
                "remote_leaf": null,
                "account_number": "6",
                "hostname": "apache0.us-west.insights.redhat.com",
                "last_check_in": "2018-03-15T04:01:02.000Z",
                "created_at": "2016-09-30T19:19:40.000Z",
                "updated_at": "2018-03-15T04:01:02.000Z",
                "unregistered_at": null,
                "system_type_id": 1001,
                "role": "cluster",
                "product_code": "apache",
                "product_name": "Apache",
                "system_status": "ok",
                "infra_status": "ok",
                "reliability": "ok",
                "improvement": "ok",
                "report_count": 11,
                "policies": {
                    "total": 0,
                    "resources": [],
                    "policies_pass": 0,
                    "policies_fail": 0,
                    "policies_error": 0
                },
                "metadata": {},
                "reports": {},
                "groups": []
            },
            {
                "toString": "sqlserver1.us-east.insights.redhat.com",
                "isCheckingIn": true,
                "system_id": "f98c596f-6cd2-54f5-ba74-c4a64cd8679e",
                "display_name": null,
                "remote_branch": null,
                "remote_leaf": null,
                "account_number": "6",
                "hostname": "sqlserver1.us-east.insights.redhat.com",
                "last_check_in": "2018-03-15T04:01:01.000Z",
                "created_at": "2016-09-30T19:19:41.000Z",
                "updated_at": "2018-03-15T04:01:01.000Z",
                "unregistered_at": null,
                "system_type_id": 1002,
                "role": "cluster",
                "product_code": "database",
                "product_name": "SQL Server",
                "system_status": "ok",
                "infra_status": "ok",
                "reliability": "ok",
                "improvement": "ok",
                "report_count": 11,
                "policies": {
                    "total": 0,
                    "resources": [],
                    "policies_pass": 0,
                    "policies_fail": 0,
                    "policies_error": 0
                },
                "metadata": {},
                "reports": {},
                "groups": []
            },
            {
                "toString": "hadooop1.us-west.insights.redhat.com",
                "isCheckingIn": true,
                "system_id": "a1058c72-ab5b-50eb-a7b7-5142578e798d",
                "display_name": null,
                "remote_branch": null,
                "remote_leaf": null,
                "account_number": "6",
                "hostname": "hadoop1.us-west.insights.redhat.com",
                "last_check_in": "2018-03-15T04:01:01.000Z",
                "created_at": "2016-09-30T19:19:41.000Z",
                "updated_at": "2018-03-15T04:01:01.000Z",
                "unregistered_at": null,
                "system_type_id": 1003,
                "role": "host",
                "product_code": "app",
                "product_name": "Hadoop",
                "system_status": "ok",
                "infra_status": "ok",
                "reliability": "ok",
                "improvement": "ok",
                "report_count": 11,
                "policies": {
                    "total": 0,
                    "resources": [],
                    "policies_pass": 0,
                    "policies_fail": 0,
                    "policies_error": 0
                },
                "metadata": {},
                "reports": {},
                "groups": []
            },
            {
                "toString": "openstack10.us-east.insights.redhat.com",
                "isCheckingIn": true,
                "system_id": "5c223ce0-c591-58ef-abbc-91ff4ccdd7a5",
                "display_name": null,
                "remote_branch": null,
                "remote_leaf": null,
                "account_number": "6",
                "hostname": "openstack10.us-east.insights.redhat.com",
                "last_check_in": "2018-03-15T04:01:01.000Z",
                "created_at": "2016-09-30T19:19:42.000Z",
                "updated_at": "2018-03-15T04:01:01.000Z",
                "unregistered_at": null,
                "system_type_id": 49,
                "role": "compute",
                "product_code": "osp",
                "product_name": "OpenStack",
                "system_status": "ok",
                "infra_status": "ok",
                "reliability": "ok",
                "improvement": "ok",
                "report_count": 11,
                "policies": {
                    "total": 0,
                    "resources": [],
                    "policies_pass": 0,
                    "policies_fail": 0,
                    "policies_error": 0
                },
                "metadata": {},
                "reports": {},
                "groups": []
            },
            {
                "toString": "jboss1.us-west.insights.redhat.com",
                "isCheckingIn": true,
                "system_id": "edbc5584-5f2e-5551-89e8-3882dcda0e0a",
                "display_name": null,
                "remote_branch": null,
                "remote_leaf": null,
                "account_number": "6",
                "hostname": "jboss1.us-west.insights.redhat.com",
                "last_check_in": "2018-03-15T04:01:01.000Z",
                "created_at": "2016-09-30T19:19:43.000Z",
                "updated_at": "2018-03-15T04:01:01.000Z",
                "unregistered_at": null,
                "system_type_id": 1003,
                "role": "host",
                "product_code": "app",
                "product_name": "JBoss",
                "system_status": "ok",
                "infra_status": "ok",
                "reliability": "ok",
                "improvement": "ok",
                "report_count": 11,
                "policies": {
                    "total": 0,
                    "resources": [],
                    "policies_pass": 0,
                    "policies_fail": 0,
                    "policies_error": 0
                },
                "metadata": {},
                "reports": {},
                "groups": []
            },
            {
                "toString": "rhev1.us-east.insights.redhat.com",
                "isCheckingIn": true,
                "system_id": "5240b5e3-ac29-5c3b-b2e9-035f2b1bd6b5",
                "display_name": null,
                "remote_branch": null,
                "remote_leaf": null,
                "account_number": "6",
                "hostname": "rhev1.us-east.insights.redhat.com",
                "last_check_in": "2018-03-15T04:01:01.000Z",
                "created_at": "2016-09-30T19:19:43.000Z",
                "updated_at": "2018-03-15T04:01:01.000Z",
                "unregistered_at": null,
                "system_type_id": 99,
                "role": "hypervisor",
                "product_code": "rhev",
                "product_name": "RHEV",
                "system_status": "ok",
                "infra_status": "ok",
                "reliability": "ok",
                "improvement": "ok",
                "report_count": 11,
                "policies": {
                    "total": 0,
                    "resources": [],
                    "policies_pass": 0,
                    "policies_fail": 0,
                    "policies_error": 0
                },
                "metadata": {},
                "reports": {},
                "groups": []
            },
            {
                "toString": "openshift11.us-west.insights.redhat.com",
                "isCheckingIn": true,
                "system_id": "6668ffea-b94a-53df-a9bd-59a1cf37aac3",
                "display_name": null,
                "remote_branch": null,
                "remote_leaf": null,
                "account_number": "6",
                "hostname": "openshift11.us-west.insights.redhat.com",
                "last_check_in": "2018-03-15T04:01:01.000Z",
                "created_at": "2016-09-30T19:19:43.000Z",
                "updated_at": "2018-03-15T04:01:01.000Z",
                "unregistered_at": null,
                "system_type_id": 325,
                "role": "cluster",
                "product_code": "ocp",
                "product_name": "OpenShift",
                "system_status": "ok",
                "infra_status": "ok",
                "reliability": "ok",
                "improvement": "ok",
                "report_count": 11,
                "policies": {
                    "total": 0,
                    "resources": [],
                    "policies_pass": 0,
                    "policies_fail": 0,
                    "policies_error": 0
                },
                "metadata": {},
                "reports": {},
                "groups": []
            },
            {
                "toString": "openshift12.us-east.insights.redhat.com",
                "isCheckingIn": true,
                "system_id": "2d328752-830a-54a1-b352-5e6f3ed46602",
                "display_name": null,
                "remote_branch": null,
                "remote_leaf": null,
                "account_number": "6",
                "hostname": "openshift12.us-east.insights.redhat.com",
                "last_check_in": "2018-03-15T04:01:01.000Z",
                "created_at": "2016-09-30T19:19:44.000Z",
                "updated_at": "2018-03-15T04:01:01.000Z",
                "unregistered_at": null,
                "system_type_id": 325,
                "role": "cluster",
                "product_code": "ocp",
                "product_name": "OpenShift",
                "system_status": "ok",
                "infra_status": "ok",
                "reliability": "ok",
                "improvement": "ok",
                "report_count": 11,
                "policies": {
                    "total": 0,
                    "resources": [],
                    "policies_pass": 0,
                    "policies_fail": 0,
                    "policies_error": 0
                },
                "metadata": {},
                "reports": {},
                "groups": []
            },
            {
                "toString": "openshift13.us-west.insights.redhat.com",
                "isCheckingIn": true,
                "system_id": "88a88789-7f9f-521b-9050-64b00a42c045",
                "display_name": null,
                "remote_branch": null,
                "remote_leaf": null,
                "account_number": "6",
                "hostname": "openshift13.us-west.insights.redhat.com",
                "last_check_in": "2018-03-15T04:01:01.000Z",
                "created_at": "2016-09-30T19:19:44.000Z",
                "updated_at": "2018-03-15T04:01:01.000Z",
                "unregistered_at": null,
                "system_type_id": 325,
                "role": "cluster",
                "product_code": "ocp",
                "product_name": "OpenShift",
                "system_status": "ok",
                "infra_status": "ok",
                "reliability": "ok",
                "improvement": "ok",
                "report_count": 11,
                "policies": {
                    "total": 0,
                    "resources": [],
                    "policies_pass": 0,
                    "policies_fail": 0,
                    "policies_error": 0
                },
                "metadata": {},
                "reports": {},
                "groups": []
            },
            {
                "toString": "openshift14.us-east.insights.redhat.com",
                "isCheckingIn": true,
                "system_id": "703d7ac1-452c-53a2-b248-cb0453a5a6d5",
                "display_name": null,
                "remote_branch": null,
                "remote_leaf": null,
                "account_number": "6",
                "hostname": "openshift14.us-east.insights.redhat.com",
                "last_check_in": "2018-03-15T04:01:01.000Z",
                "created_at": "2016-09-30T19:19:44.000Z",
                "updated_at": "2018-03-15T04:01:01.000Z",
                "unregistered_at": null,
                "system_type_id": 325,
                "role": "cluster",
                "product_code": "ocp",
                "product_name": "OpenShift",
                "system_status": "ok",
                "infra_status": "ok",
                "reliability": "ok",
                "improvement": "ok",
                "report_count": 11,
                "policies": {
                    "total": 0,
                    "resources": [],
                    "policies_pass": 0,
                    "policies_fail": 0,
                    "policies_error": 0
                },
                "metadata": {},
                "reports": {},
                "groups": []
            },
            {
                "toString": "openshift15.us-west.insights.redhat.com",
                "isCheckingIn": true,
                "system_id": "48e481e8-c1b7-54e1-abf8-40fc0a714f08",
                "display_name": null,
                "remote_branch": null,
                "remote_leaf": null,
                "account_number": "6",
                "hostname": "openshift15.us-west.insights.redhat.com",
                "last_check_in": "2018-03-15T04:01:01.000Z",
                "created_at": "2016-09-30T19:19:45.000Z",
                "updated_at": "2018-03-15T04:01:01.000Z",
                "unregistered_at": null,
                "system_type_id": 325,
                "role": "cluster",
                "product_code": "ocp",
                "product_name": "OpenShift",
                "system_status": "ok",
                "infra_status": "ok",
                "reliability": "ok",
                "improvement": "ok",
                "report_count": 11,
                "policies": {
                    "total": 0,
                    "resources": [],
                    "policies_pass": 0,
                    "policies_fail": 0,
                    "policies_error": 0
                },
                "metadata": {},
                "reports": {},
                "groups": []
            }
        ],
        "total": 272
    },
    systemTypes: [
        {
            id: 1001,
            role: "host",
            product_code: "apache",
            imageClass: "fa-globe",
            displayName: "Web Server",
            displayNameShort: "Web Server"
        },
        {
            id: 1002,
            role: "host",
            product_code: "database",
            imageClass: "fa-database",
            displayName: "Database Server",
            displayNameShort: "Database"
        },
        {
            id: 1003,
            role: "host",
            product_code: "app",
            imageClass: "fa-cubes",
            displayName: "Application",
            displayNameShort: "Application Server"
        },
        {
            id: 1004,
            role: "host",
            product_code: "network",
            imageClass: "pficon-network",
            displayName: "Network",
            displayNameShort: "Network"
        },
        {
            id: 325,
            role: "cluster",
            product_code: "ocp",
            imageClass: "fa-cubes",
            displayName: "Red Hat Openshift Compute Platform",
            displayNameShort: "OCP Deployment"
        },
        {
            id: 69,
            role: "cluster",
            product_code: "osp",
            imageClass: "fa-cubes",
            displayName: "Red Hat OpenStack Platform Deployment",
            displayNameShort: "OSP Deployment"
        },
        {
            id: 315,
            role: "cluster",
            product_code: "rhev",
            imageClass: "fa-object-group",
            displayName: "Red Hat Virtualization Deployment",
            displayNameShort: "RHV Deployment"
        },
        {
            id: 49,
            role: "compute",
            product_code: "osp",
            imageClass: "fa-cogs",
            displayName: "Red Hat OpenStack Platform Compute Node",
            displayNameShort: "OSP Compute"
        },
        {
            id: 19,
            role: "container",
            product_code: "docker",
            imageClass: "fa-cube",
            displayName: "Red Hat Container",
            displayNameShort: "Container"
        },
        {
            id: 39,
            role: "controller",
            product_code: "osp",
            imageClass: "fa-wrench",
            displayName: "Red Hat OpenStack Platform Controller Node",
            displayNameShort: "OSP Controller"
        },
        {
            id: 59,
            role: "director",
            product_code: "osp",
            imageClass: "fa-home",
            displayName: "Red Hat OpenStack Platform Director",
            displayNameShort: "OSP Director"
        },
        {
            id: 79,
            role: "host",
            product_code: "aep"
        },
        {
            id: 9,
            role: "host",
            product_code: "docker",
            imageClass: "fa-ship",
            displayName: "Red Hat Container Host",
            displayNameShort: "Container Host"
        },
        {
            id: 105,
            role: "host",
            product_code: "rhel",
            imageClass: "fa-linux",
            displayName: "Red Hat Enterprise Linux",
            displayNameShort: "RHEL Server"
        },
        {
            id: 99,
            role: "hypervisor",
            product_code: "rhev",
            imageClass: "fa-server",
            displayName: "Red Hat Virtualization Hypervisor",
            displayNameShort: "RHV Hypervisor"
        },
        {
            id: 29,
            role: "image",
            product_code: "docker",
            imageClass: "fa-archive",
            displayName: "Red Hat Container Image",
            displayNameShort: "Container Image"
        },
        {
            id: 89,
            role: "manager",
            product_code: "rhev",
            imageClass: "fa-building",
            displayName: "Red Hat Virtualization Manager",
            displayNameShort: "RHV Manager"
        },
        {
            id: 335,
            role: "master",
            product_code: "ocp",
            imageClass: "fa-home",
            displayName: "Red Hat Openshift Compute Platform Master",
            displayNameShort: "OCP Master"
        },
        {
            id: 345,
            role: "node",
            product_code: "ocp",
            imageClass: "fa-cogs",
            displayName: "Red Hat Openshift Compute Platform Node",
            displayNameShort: "OCP Node"
        }
    ]
});

// jscs:enable
// jshint ignore: end

