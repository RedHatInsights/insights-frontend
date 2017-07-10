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
        var server_type = get(metadata, 'system_information.product_name');
        var virtual_machines = ['VMware Virtual Platform',
                                   'VirtualBox',
                                   'KVM',
                                   'Bochs',
                                   'Virtual Machine'];

        // add system data
        var systemData = [];
        systemData.push({
            label: 'OS',
            value: $filter('productShortName')(get(metadata, 'release'))
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

        systemData.push({
            label: 'Timezone',
            value: formatTimezoneString(metadata)
        });

        if (virtual_machines.indexOf(server_type) !== -1) {
            systemData.push({
                label: 'Server Type',
                value: 'Virtual'
            });

            systemData.push({
                label: 'Server Provider',
                value: get(metadata, 'system_information.product_name')
            });
        } else if (server_type) {
            systemData.push({
                label: 'Server Type',
                value: 'Physical'
            });
        }

        systemData.push({
            label: 'Vendor',
            value: get(metadata, 'system_information.manufacturer')
        });

        systemData.push({
            label: 'Model',
            value: get(metadata, 'system_information.family')
        });

        systemData.push({
            label: 'Version',
            value: get(metadata, 'system_information.version')
        });

        systemData.push({
            label: 'Serial Number',
            value: get(metadata, 'system_information.serial_number')
        });

        systemData.push({
            label: `Satellite ${get(metadata, 'satellite_information.version')}`,
            value: get(metadata, 'satellite_information.hostname')
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

    systemsService.getSystemMetadata = function (metadata) {
        let systemMetadata = [];
        systemMetadata.push(getListeningProcesses(metadata));

        return systemMetadata;
    };

    systemsService.getInitialSystemMetadata = function (system, metadata) {
        let systemData = [];

        // if (system.product_code === Products.rhel.code ||
        //         (system.product_code === Products.osp.code &&
        //             system.role === Products.osp.roles.cluster.code)) {
        //     systemData.push({
        //         label: 'Registration Date',
        //         value: $filter('timeAgo')(get(system, 'created_at'))
        //     });
        // }

        systemData.push({
            label: 'OS',
            value: $filter('productShortName')(get(metadata, 'release'))
        });

        systemData.push({
            label: 'Registration Date',
            value: $filter('timeAgo')(get(system, 'created_at'))
        });

        systemData.push({
            label: 'Last Check-in',
            value: $filter('timeAgo')(get(system, 'last_check_in'))
        });

        systemData.push({
            label: 'temp init data',
            value: 'tempInitD'
        });

        // remove items that are undefined
        arrayRemove(systemData, function (n) {
            return n.value === undefined ||
                n.value === 'undefined undefined' ||
                n.value.indexOf('NaN') > -1;
        });

        return systemData;
    };

    function getListeningProcesses(metadata) {
        let processes = {
            category: 'network',
            labels: [
            {
                name: 'Process Name',
                values: []
            }, {
                name: 'IP Address',
                values: []
            }, {
                name: 'Port',
                values: []
            }]
        };

        let i = 0;
        while (true) {
            let name = get(metadata, `listening_processes.${i}.process_name`);
            let ip = get(metadata, `listening_processes.${i}.ip_addr`);
            let port = get(metadata, `listening_processes.${i}.port`);

            if (name && port) {
                if (port.substring(0, 1) !== ':') {
                    port = ':' + port;
                }

                processes.labels[0].values.push(name);
                processes.labels[1].values.push(ip || 'Unknown');
                processes.labels[2].values.push(port);
            } else {
                break;
            }

            i++;
        }

        return processes;
    }

    function formatTimezoneString(metadata) {
        const tzString = get(metadata, 'timezone_information.timezone');
        let offset = parseInt(get(metadata, 'timezone_information.utcoffset'));
        let offsetStr;

        // Formats the utc offset from seconds to (+/-)HH:MM
        // Example: +04:00, -12:00
        if (offset) {
            const offset_hrs = Math.floor(Math.abs(offset / 3600));
            const offset_min = Math.abs((offset % 3600) / 3600) * 60;

            if (offset < 0) {
                offsetStr = '-';
            } else if (offset >= 0) {
                offsetStr = '+';
            }

            if (offset_hrs < 10 && offset_min < 10) {
                offsetStr += `0${offset_hrs}:0${offset_min}`;
            } else if (offset_hrs > 10 && offset_min > 10) {
                offsetStr += `${offset_hrs}:${offset_min}`;
            } else if (offset_hrs < 10 && offset_min > 10) {
                offsetStr += `0${offset_hrs}:${offset_min}`;
            } else if (offset_hrs > 10 && offset_min < 10) {
                offsetStr += `${offset_hrs}:0${offset_min}`;
            }

            // Puts the timezone name behind the offset
            // Example: +0400 (EDT)
            if (tzString) {
                offsetStr += ` (${tzString})`;
            }

            return offsetStr;
        } else if (tzString) {
            return `${tzString}`;
        }
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
