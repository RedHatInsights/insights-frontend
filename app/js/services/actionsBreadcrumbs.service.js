'use strict';

var servicesModule = require('./');

/**
 * @ngInject
 */
function ActionsBreadcrumbs() {
    var _crumbs = [];

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
            var crumbs = [{
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

servicesModule.factory('ActionsBreadcrumbs', ActionsBreadcrumbs);
