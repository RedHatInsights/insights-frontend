'use strict';

var servicesModule = require('./');
var get = require('lodash/get');
var arrayRemove = require('lodash/remove');
var find = require('lodash/find');
const forOwn = require('lodash/forOwn');
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

    systemsService.getSystemMetadata = function (system, metadata) {
        let systemMetadata = [];
        systemMetadata.push(getSystemMetadata(system, metadata));
        systemMetadata.push(getNetworkMetadata(metadata));

        return systemMetadata;
    };

    systemsService.getInitialSystemMetadata = function (system, metadata) {
        let systemData = [];

        if (system.product_code === Products.rhel.code ||
                (system.product_code === Products.osp.code &&
                    system.role === Products.osp.roles.cluster.code)) {
            systemData.push({
                label: 'Registration Date',
                value: $filter('timeAgo')(get(system, 'created_at'))
            });
        }

        systemData.push({
            label: 'Operating System',
            value: $filter('productShortName')(get(metadata, 'release'))
        });

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

        return systemData;
    };

    function getSystemMetadata(system, metadata) {
        let system_data = {
            category: 'system',
            noData: false,
            data: []
        };

        system_data.data.push({
            label: 'BIOS',
            values: [{
                label: 'Vendor',
                value: get(metadata, 'bios_information.vendor')
            }, {
                label: 'Release date',
                value: get(metadata, 'bios_information.release_date')
            }, {
                label: 'Version',
                value: get(metadata, 'bios_information.version')
            }]
        });

        let type = get(metadata, 'system_information.machine_type');
        system_data.type = type || 'Unknown';

        let system_info = {
            label: 'System',
            values: [{
                label: 'Manufacturer',
                value: get(metadata, 'system_information.manufacturer')
            }, {
                label: 'Release',
                value: get(metadata, 'release')
            }, {
                label: 'Version',
                value: get(metadata, 'system_information.version')
            }, {
                label: 'Product Name / Platform',
                value: get(metadata, 'system_information.product_name')
            }, {
                label: 'Serial Number',
                value: get(metadata, 'system_information.serial_number')
            }, {
                label: 'Model',
                value: get(metadata, 'system_information.family')
            }, {
                label: `Satellite ${get(metadata, 'satellite_information.version')}:`,
                value: get(metadata, 'satellite_information.hostname')
            }, {
                label: 'Server Type',
                value: type
            }, {
                label: 'Timezone',
                value: formatTimezoneString(metadata)
            }]
        };

        if (system.product_code === Products.docker.code) {
            if (system.role === Products.docker.roles.container.code) {
                system_info.values.push({
                    label: 'Container ID:',
                    value: get(metadata, 'docker_container_id')
                });

                system_info.values.push({
                    label: 'Built On Image:',
                    value: get(metadata, 'docker_image_id')
                });
            } else if (system.role === Products.docker.roles.image.code) {
                system_info.values.push({
                    label: 'Image ID:',
                    value: get(metadata, 'docker_image_id')
                });
            }
        }

        system_data.data.push(system_info);

        // Removes all the null or undefined values
        arrayRemove(system_data.data, function (data) {
            arrayRemove(data.values, function (val) {
                return val.value === undefined ||
                    val.value === null ||
                    val.value === 'undefined undefined' ||
                    val.value === 'Not Specified' ||
                    val.value === 'Unknown';
            });

            return data.values.length === 0;
        });

        if (system_data.data.length === 0) {
            system_data.noData = true;
        }

        return system_data;
    }

    function getNetworkMetadata(metadata) {
        let system_data = {
            category: 'network',
            noData: false,
            data: []
        };

        // Gets all the listening process information
        forOwn(metadata, function (value, key) {
            if (key.indexOf('listening_process') >= 0) {
                //splits the key into 3 parts
                //['listening_process', <current_process_number>, port]
                const data = key.split('.');

                if (!system_data.data[data[1]]) {
                    system_data.data[data[1]] = {
                        name: '',
                        ip_addr: '',
                        port: ''
                    };
                }

                if (data.indexOf('process_name') >= 0) {
                    system_data.data[data[1]].name = value;
                } else if (data.indexOf('ip_addr') >= 0) {
                    if (!value || value === '::' || value === '0.0.0.0') {
                        system_data.data[data[1]].ip_addr = 'All';
                    } else if (value === '::1' || value === '127.0.0.1') {
                        system_data.data[data[1]].ip_addr = 'localhost';
                    } else {
                        system_data.data[data[1]].ip_addr = value;
                    }
                } else if (data.indexOf('port') >= 0) {
                    system_data.data[data[1]].port = value;
                }
            }
        });

        if (system_data.data.length === 0) {
            system_data.noData = true;
        }

        return system_data;
    }

    function formatTimezoneString(metadata) {
        const tzString = get(metadata, 'timezone_information.timezone');
        let offset = parseInt(get(metadata, 'timezone_information.utcoffset'));
        let offsetStr;

        // Formats the utc offset from seconds to (+/-)HH:MM
        // Example: +04:00, -12:00
        if (offset) {
            const offset_hrs = Math.floor(Math.abs(offset / 3600));
            const offset_min = Math.floor(Math.abs((offset % 3600) / 3600) * 60);

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
