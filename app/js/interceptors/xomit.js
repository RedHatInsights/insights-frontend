'use strict';

function XomitInterceptor() {
    return {
        request: function (config) {
            // stomp on basic auth requests
            if (config && config.headers) {
                config.headers['X-Omit'] = 'WWW-Authenticate';
            }

            return config;
        }
    };
}

module.exports = XomitInterceptor;
