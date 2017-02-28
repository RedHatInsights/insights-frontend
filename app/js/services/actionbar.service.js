'use strict';

var servicesModule = require('./');

/**
 * @ngInject
 */
function ActionbarService(gettextCatalog) {
    var _actions = [];

    const result = {
        actions: _actions,
        add: function (action) {
            _actions.push(action);
        },

        set: function (actions) {
            _actions.length = 0;
            Array.prototype.push.apply(_actions, actions);
        },

        clear: function () {
            _actions.length = 0;
        }
    };

    result.addExportAction = function (callback) {
        result.add({
            icon: 'fa-download',
            title: gettextCatalog.getString('Export CSV'),
            fn: callback
        });
    };

    return result;
}

servicesModule.factory('ActionbarService', ActionbarService);
