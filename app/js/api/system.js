/*global require*/

'use strict';

var apiModule = require('./');
const URI = require('urijs');

const getDemoPolicies = (systemId) => {
    return {
        total: 1,
        resources: [
            {
                created_at: '2018-02-02T16:49:38.000Z',
                updated_at: '2018-02-02T16:49:38.000Z',
                account_number: '6',
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
    };
};

const demoSystemTypes = [
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

/**
 * @ngInject
 */
function System(
    $http,
    $q,
    $rootScope,
    InsightsConfig,
    AccountService,
    Group,
    Utils,
    FilterService,
    Products,
    PreferenceService,
    DataUtils,
    DemoData) {

    var root = InsightsConfig.apiRoot;
    var _systemDfd;
    var _systemStatusDfd;

    //XXX: this needs to be refactored/simplified
    function decorateSystemType(systemType) {
        if (systemType.product_code === Products.docker.code) {
            if (systemType.role === Products.docker.roles.host.code) {
                systemType.imageClass = Products.docker.roles.host.icon;
                systemType.displayName = Products.docker.roles.host.fullName;
                systemType.displayNameShort = Products.docker.shortName2 + ' ' +
                    Products.docker.roles.host.shortName;
            } else if (systemType.role === Products.docker.roles.container.code) {
                systemType.imageClass = Products.docker.roles.container.icon;
                systemType.displayName = Products.docker.roles.container.fullName;
                systemType.displayNameShort = Products.docker.roles.container.shortName;
            } else if (systemType.role === Products.docker.roles.image.code) {
                systemType.imageClass = Products.docker.roles.image.icon;
                systemType.displayName = Products.docker.roles.image.fullName;
                systemType.displayNameShort = Products.docker.shortName2 + ' ' +
                    Products.docker.roles.image.shortName;
            }
        } else if (systemType.product_code === Products.ocp.code) {
            if (systemType.role === Products.ocp.roles.cluster.code) {
                systemType.imageClass = Products.ocp.roles.cluster.icon;
                systemType.displayName = Products.ocp.roles.cluster.fullName;
                systemType.displayNameShort = Products.ocp.shortName + ' ' +
                    Products.ocp.roles.cluster.shortName;
            } else if (systemType.role === Products.ocp.roles.master.code) {
                systemType.imageClass = Products.ocp.roles.master.icon;
                systemType.displayName = Products.ocp.roles.master.fullName;
                systemType.displayNameShort = Products.ocp.shortName + ' ' +
                    Products.ocp.roles.master.shortName;
            } else if (systemType.role === Products.ocp.roles.node.code) {
                systemType.imageClass = Products.ocp.roles.node.icon;
                systemType.displayName = Products.ocp.roles.node.fullName;
                systemType.displayNameShort = Products.ocp.shortName + ' ' +
                    Products.ocp.roles.node.shortName;
            }
        } else if (systemType.product_code === Products.osp.code) {
            if (systemType.role === Products.osp.roles.controller.code) {
                systemType.imageClass = Products.osp.roles.controller.icon;
                systemType.displayName = Products.osp.roles.controller.fullName;
                systemType.displayNameShort = Products.osp.shortName + ' ' +
                    Products.osp.roles.controller.shortName;
            } else if (systemType.role === Products.osp.roles.compute.code) {
                systemType.imageClass = Products.osp.roles.compute.icon;
                systemType.displayName = Products.osp.roles.compute.fullName;
                systemType.displayNameShort = Products.osp.shortName + ' ' +
                    Products.osp.roles.compute.shortName;
            } else if (systemType.role === Products.osp.roles.director.code) {
                systemType.imageClass = Products.osp.roles.director.icon;
                systemType.displayName = Products.osp.roles.director.fullName;
                systemType.displayNameShort = Products.osp.shortName + ' ' +
                    Products.osp.roles.director.shortName;
            } else if (systemType.role === Products.osp.roles.cluster.code) {
                systemType.imageClass = Products.osp.roles.cluster.icon;
                systemType.displayName = Products.osp.roles.cluster.fullName;
                systemType.displayNameShort = Products.osp.shortName + ' ' +
                    Products.osp.roles.cluster.shortName;
            }
        } else if (systemType.product_code === Products.rhev.code) {
            if (systemType.role === Products.rhev.roles.manager.code) {
                systemType.imageClass = Products.rhev.roles.manager.icon;
                systemType.displayName = Products.rhev.roles.manager.fullName;
                systemType.displayNameShort = Products.rhev.shortName + ' ' +
                    Products.rhev.roles.manager.shortName;
            } else if (systemType.role === Products.rhev.roles.hypervisor.code) {
                systemType.imageClass = Products.rhev.roles.hypervisor.icon;
                systemType.displayName = Products.rhev.roles.hypervisor.fullName;
                systemType.displayNameShort = Products.rhev.shortName + ' ' +
                    Products.rhev.roles.hypervisor.shortName;
            } else if (systemType.role === Products.rhev.roles.cluster.code) {
                systemType.imageClass = Products.rhev.roles.cluster.icon;
                systemType.displayName = Products.rhev.roles.cluster.fullName;
                systemType.displayNameShort = Products.rhev.shortName + ' ' +
                    Products.rhev.roles.cluster.shortName;
            }
        } else if (systemType.product_code === Products.rhel.code) {
            systemType.imageClass = Products.rhel.icon;
            systemType.displayName = Products.rhel.fullName;
            systemType.displayNameShort = Products.rhel.shortName;
        }

        return systemType;
    }

    function decorateSystemTypes(systemTypes) {
        for (let i = 0; i < systemTypes.length; i++) {
            systemTypes[i] = decorateSystemType(systemTypes[i]);
        }

        return systemTypes;
    }

    $rootScope.$on('reload:data', function () {
        _systemDfd = null;
    });

    return {
        ackStaleSystems: function () {
            var url = root + 'systems/stale/ack';
            url += AccountService.current('?');
            return $http.put(url);
        },

        getSingleSystem: function (systemid) {
            var url = root + 'systems/' + systemid;
            url += AccountService.current('?');
            return $http.get(url);
        },

        getSystemTypes: function () {
            decorateSystemTypes(demoSystemTypes);
            return {
                then: () => {
                    return {
                        data: demoSystemTypes
                    };
                }
            };
        },

        getSystems: function () {
            var url;

            if (_systemDfd) {
                return _systemDfd;
            }

            url = root + 'systems' + AccountService.current();
            _systemDfd = $http.get(url);
            return _systemDfd;
        },

        getSystemLinks: function (parent_system_id, query) {
            var url = root + 'systems/' + encodeURIComponent(parent_system_id) + '/links';
            url += AccountService.current('?');
            url = Utils.addQueryToUrl(url, query);
            return $http.get(url);
        },

        headSystemsLatest: function (query) {
            var url = root + 'systems';
            url += AccountService.current('?');
            url = Utils.addQueryToUrl(url, query);
            return $http.head(url);
        },

        getSystemsLatest: function () {
            return $q.resolve(DemoData.systems);

            // var url = root + 'systems';
            // url += AccountService.current('?');
            // url = Utils.addQueryToUrl(url, query);
            // return $http.get(url);
        },

        getSystemStatus: function (refresh) {
            var url;
            if (!refresh && _systemStatusDfd) {
                return _systemStatusDfd;
            }

            url = root + 'systems/status' + AccountService.current();
            url = PreferenceService.appendProductToUrl(url, 'machine');
            _systemStatusDfd = $http.get(url);
            return _systemStatusDfd;
        },

        getSystemSummary: function (query) {
            var group;
            var url = root + 'systems?summary=true' + AccountService.current('&');
            url = PreferenceService.appendProductToUrl(url, 'machine');
            group = Group.current();
            if (group && group.id) {
                url += ('&group=' + group.id);
            }

            url = Utils.addQueryToUrl(url, query);
            return $http.get(url);
        },

        getSystemReports: function (machine_id) {
            return $http.get(
                root +
                    'systems/' +
                    encodeURIComponent(machine_id) +
                    '/reports' +
                    AccountService.current())
                .success(function (system) {
                    system.reports.forEach(r => DataUtils.readRule(r.rule));
                });
        },

        getSystemMetadata: function (machine_id) {
            return $http.get(
                root +
                    'systems/' +
                    encodeURIComponent(machine_id) +
                    '/metadata' +
                    AccountService.current());
        },

        deleteSystem: function (machine_id) {
            // systems were deleted, the status deferred is now invalid
            _systemStatusDfd = null;
            return $http.delete(
                root +
                    'systems/' +
                    encodeURIComponent(machine_id) +
                    AccountService.current());
        },

        getSystemGroups: function (systemId) {
            const uri = URI(InsightsConfig.apiRoot);
            uri.segment('systems');
            uri.segment(systemId);
            uri.segment('groups');
            uri.addSearch(AccountService.queryParam());

            return $http.get(uri.toString());
        },

        update: function (systemId, data) {
            const url = URI(root);
            url.segment('systems');
            url.segment(systemId);
            url.addSearch(AccountService.queryParam());
            return $http.put(url.toString(), data);
        },

        getSystemPolicies (systemId) {
            return {
                then: () => {
                    return {
                        data: getDemoPolicies(systemId)
                    };
                }
            };

        }
    };
}

apiModule.factory('System', System);
