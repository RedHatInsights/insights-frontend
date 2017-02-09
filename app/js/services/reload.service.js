'use strict';

var servicesModule = require('./');
var headerName = 'x-insights-autoreload';

/**
 * @ngInject
 */
function ReloadService($http) {
    var pub = {};

    pub.begin = function () {
        $http.defaults.headers.common[headerName] = true;
    };

    pub.end = function () {
        delete $http.defaults.headers.common[headerName];
    };

    pub.wrap = function (cb) {
        pub.begin();
        cb(function () {
            pub.end();
        });
    };

    return pub;
}

servicesModule.service('ReloadService', ReloadService);
