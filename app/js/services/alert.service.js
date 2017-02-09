'use strict';

var servicesModule = require('./');

/**
 * @ngInject
 */
function AlertService() {
    var _alerts = [];

    return {
        alerts: _alerts,
        clearHttpError: function () {
            clearType(_alerts, 'http');
        },

        setHttpError: function (response) {
            var message = 'There was an error retrieving data.';
            if (response && response.data) {
                if (response.data.message) {
                    message += ('<br>' + response.data.message);
                }

                if (response.data.internal_error &&
                    response.data.internal_error.reference) {

                    message += (
                        '<br><small>Reference: #' +
                            response.data.internal_error.reference +
                            '</small>');
                }
            }

            clearType(_alerts, 'http');
            _alerts.push({
                type: 'http',
                msg: message,
                level: 'danger'
            });
        },

        clear: function () {
            _alerts.length = 0;
        }
    };
}

function clearType(messages, type) {
    var i = 0;
    var len = messages.length;
    for (; i < len; i++) {
        if (messages[i].type === type) {
            messages.splice(i, 1);
        }
    }
}

servicesModule.service('AlertService', AlertService);
