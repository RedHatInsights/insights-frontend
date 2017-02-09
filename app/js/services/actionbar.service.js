'use strict';

var servicesModule = require('./');

/**
 * @ngInject
 */
function ActionbarService() {
    var _actions = [];
    return {
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
}

servicesModule.factory('ActionbarService', ActionbarService);
