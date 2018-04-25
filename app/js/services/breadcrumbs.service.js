'use strict';

var servicesModule = require('./');

/**
 * @ngInject
 */
function BreadcrumbsService($state) {
    let _crumbs = [];
    const states = {
        actions: [
            'app.actions',
            'app.actions-rule',
            'app.topic'
        ],
        vulnerabilities: [
            'app.vulnerabilities',
            'app.vulnerabilities-erratum',
            'app.vulnerabilities-package',
            'app.vulnerabilities-cve',
            'app.vulnerabilities-package-erratum',
            'app.vulnerabilities-package-cve'
        ]
    };

    function set(crumbs) {
        _crumbs = angular.copy(crumbs);
        return _crumbs;
    }

    function setCrumb(crumb, index) {
        if (_crumbs.length < index) {
            throw new Error(
                'Cannot set crumb with index ' +
                index +
                ' to array of length ' +
                _crumbs.length);
        }

        _crumbs[index] = crumb;
    }

    function add(crumb) {
        _crumbs.push(crumb);
    }

    return {
        init: function ($stateParams) {
            const state = $state.current.name;
            let crumbs;

            if (states.actions.indexOf(state) > -1) {
                crumbs = [{
                    label: 'Actions',
                    state: 'app.actions',
                    params: {
                        category: null
                    }
                }];

                if ($stateParams.category) {
                    crumbs.push({
                        label: $stateParams.category,
                        state: 'app.topic',
                        params: {
                            id: $stateParams.category
                        }
                    });
                }
            } else if (states.vulnerabilities.indexOf(state) > -1) {
                crumbs = [{
                    label: 'Vulnerabilities',
                    state: 'app.vulnerabilities',
                    params: {
                        root_view: $stateParams.root_view
                    }
                }];

                if (($stateParams.rhsa_id || $stateParams.cve_id) &&
                    $stateParams.package_id) {
                    crumbs.push({
                        label: $stateParams.package_id,
                        state: 'app.vulnerabilities-package',
                        params: {
                            package_id: $stateParams.package_id
                        }
                    });
                }
            }

            set(crumbs);
        },

        crumbs: _crumbs,
        clear: function () {
            set([]);
        },

        get: function () {
            return _crumbs;
        },

        set: set,
        setCrumb: setCrumb,
        add: add
    };
}

servicesModule.factory('BreadcrumbsService', BreadcrumbsService);
