'use strict';

var servicesModule = require('./');
var get = require('lodash/object/get');
var arrayRemove = require('lodash/array/remove');
var find = require('lodash/collection/find');

function SystemsService($filter,
                        $rootScope,
                        $q,
                        gettextCatalog,
                        Products,
                        SweetAlert,
                        System) {
    var systemsService = {};
    var _systemTypes = [];
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

    /**
     * Populates _systemTypes if _systemTypes is empty.
     * This method also provides a way to force populate for refreshing the list.
     *
     * @returns {Promise}
     */
    systemsService.populateSystemTypes = function (doForcePopulate) {
        if (_systemTypes.length > 0 && !doForcePopulate) {
            // system types are already populated. Return a resolved promise
            return Promise.resolve();
        }
        else {
            return System.getSystemTypes()
            .then((response) => {
                _systemTypes = response.data;
            });
        }
    };

    systemsService.getSystemTypes = function () {
        return _systemTypes;
    };

    systemsService.getSystemType = function (system_type_id) {
        var type = find(systemsService.getSystemTypes(), {id: parseInt(system_type_id)});
        return type;
    };

    systemsService.getSystemTypeIcon = function (system_type_id) {
        var type = systemsService.getSystemType(system_type_id);
        var response = '';
        if (type) {
            response = type.imageClass;
        }

        return response;
    };

    systemsService.getSystemTypeDisplayNameShort = function (system_type_id) {
        var type = systemsService.getSystemType(system_type_id);
        var response = '';
        if (type) {
            response = type.displayNameShort;
        }

        return response;
    };

    systemsService.getSystemTypeDisplayName = function (system_type_id) {
        var type = systemsService.getSystemType(system_type_id);
        var response = '';
        if (type) {
            response = type.displayName;
        }

        return response;
    };

    function unregisterSystems(systems) {
        var count = systems.length;
        var masterP = $q.defer();
        var promises = [];
        var systemDelete;
        var message = gettextCatalog.getPlural(
            count,
            _UNREGISTER_TEXT_SINGLE,
            _UNREGISTER_TEXT_MULTI,
            { count: count });

        SweetAlert.swal({
            title: 'Are you sure?',
            text: message,
            type: 'warning',
            confirmButtonColor: '#DD6B55',
            confirmButtonText: 'Yes',
            html: true,
            showCancelButton: true
        }, function (isConfirm) {
            if (isConfirm) {
                for (let i = 0; i < count; i++) {
                    systemDelete = System.deleteSystem(systems[i].system_id);
                    promises.push(systemDelete);
                }

                $q.all(promises).then(function () {
                    $rootScope.$broadcast('systems:unregistered');
                    masterP.resolve();
                });
            }
        });

        return masterP.promise;
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
