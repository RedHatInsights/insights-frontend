'use strict';

var servicesModule = require('./');
var get = require('lodash/get');
var arrayRemove = require('lodash/remove');
var find = require('lodash/find');
const assign = require('lodash/assign');

function SystemsService($filter,
                        $rootScope,
                        $q,
                        gettextCatalog,
                        sweetAlert,
                        Group,
                        Products,
                        System) {
    var systemsService = {};
    var _newestSystems = null;
    var _UNREGISTER_TEXT_SINGLE =
        '<h5>This will unregister the selected system from Red Hat Insights.' +
        '</h5><p>To undo this action <code>redhat-access-insights --register</code> ' +
        'must be run from the unregistered system.</p>';
    var _UNREGISTER_TEXT_MULTI =
        '<h5>This will unregister the {{count}} selected systems from ' +
        'Red Hat Insights.</h5><p>To undo this action ' +
        '<code>redhat-access-insights --register</code> ' +
        'must be run from each unregistered system.</p>';

    let systemTypes = [];

    // system type indication is ubiquitous - let's eagerly load this
    const systemTypesDfd = System.getSystemTypes().then((response) => {
        systemTypes = response.data;
        return response.data;
    });

    // unsafe because there is no guarantee system types have been loaded
    systemsService.getSystemTypeUnsafe = function (system_type_id) {
        return find(systemTypes, {id: parseInt(system_type_id)});
    };

    systemsService.getSystemTypesAsync = function () {
        return systemTypesDfd;
    };

    systemsService.getSystemTypeAsync = function (system_type_id) {
        return systemsService.getSystemTypesAsync().then(function () {
            return systemsService.getSystemTypeUnsafe(system_type_id);
        });
    };

    function unregisterSystems(systems) {
        var count = systems.length;
        var promises = [];
        var systemDelete;
        var html = gettextCatalog.getPlural(
            count,
            _UNREGISTER_TEXT_SINGLE,
            _UNREGISTER_TEXT_MULTI,
            { count: count });

        return sweetAlert({ html }).then(function () {
            for (let i = 0; i < count; i++) {
                systemDelete = System.deleteSystem(systems[i].system_id);
                promises.push(systemDelete);
            }

            return $q.all(promises).then(function () {
                $rootScope.$broadcast('systems:unregistered');
            });
        });
    }

    systemsService.unregisterSelectedSystems = function (systems) {
        return unregisterSystems(systems);
    };

    systemsService.getSystemFacts = function (system, metadata) {

        // add system data
        var systemData = [];
        systemData.push({
            label: 'OS',
            value: $filter('productShortName')(get(metadata, 'release'))
        });
        systemData.push({
            label: 'Hardware Platform',
            value: getHardwarePlatform(metadata)
        });

        if (system.product_code === Products.docker.code) {
            if (system.role === Products.docker.roles.container.code) {
                systemData.push({
                    label: 'Container ID',
                    value: get(metadata, 'docker_container_id')
                });

                systemData.push({
                    label: 'Built On Image',
                    value: get(metadata, 'docker_image_id')
                });
            } else if (system.role === Products.docker.roles.image.code) {
                systemData.push({
                    label: 'Image ID',
                    value: get(metadata, 'docker_image_id')
                });
            }
        }

        systemData.push({
            label: 'BIOS Version',
            value: get(metadata, 'bios_information.vendor') +
                ' ' + get(metadata, 'bios_information.version')
        });
        systemData.push({
            label: 'BIOS Release Date',
            value: get(metadata, 'bios_information.release_date')
        });

        if (system.product_code === Products.rhel.code ||
                (system.product_code === Products.osp.code &&
                    system.role === Products.osp.roles.cluster.code)) {
            systemData.push({
                label: 'Registration Date',
                value: $filter('timeAgo')(get(system, 'created_at'))
            });
        }

        systemData.push({
            label: 'Last Check-in',
            value: $filter('timeAgo')(get(system, 'last_check_in'))
        });

        // remove items that are undefined
        arrayRemove(systemData, function (n) {
            return n.value === undefined ||
                n.value === 'undefined undefined' ||
                n.value.indexOf('NaN') > -1;
        });

        // split array into two columns for displaying rows evenly in view
        return [systemData.slice(0, Math.ceil(systemData.length / 2)),
            systemData.slice(Math.ceil(systemData.length / 2), systemData.length)];
    };

    function getHardwarePlatform (metadata) {
        var systemInfoProperties = ['system_information.product_name',
                                'system_information.version',
                                'system_information.family',
                                'system_information.manufacturer'];
        var i = 0;
        var value = get(metadata, systemInfoProperties[systemInfoProperties.length - 1]);

        // intentionally skips over last element
        // since the value is set to it by default
        // if none of the other elements have whitespace
        for (i = 0; i < systemInfoProperties.length - 1; i++) {

            // we don't care about first character whitespace
            if (get(metadata, systemInfoProperties[i]) &&
                get(metadata, systemInfoProperties[i]).substring(1).indexOf(' ') >= 0) {

                value = get(metadata, systemInfoProperties[i]);
                break;
            }
        }

        return value;
    }

    systemsService.populateNewestSystems = function (product) {
        let parameters = {
            page_size: 5,
            page: 0,
            sort_by: 'created_at',
            sort_dir: 'DESC'
        };

        if (product && product !== 'all') {
            parameters.product_code = product;
        }

        assign(parameters, Group.queryParam());

        return System.getSystemsLatest(parameters).success(function (response) {
            _newestSystems = response.resources;
        });
    };

    systemsService.getNewestSystems = function () {
        return _newestSystems;
    };

    return systemsService;
}

servicesModule.factory('SystemsService', SystemsService);
