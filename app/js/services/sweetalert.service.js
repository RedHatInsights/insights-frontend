'use strict';

const servicesModule = require('./');
const swal = require('sweetalert2');

/**
 * @ngInject
 */
function sweetAlert($rootScope, $q, gettextCatalog) {

    const DEFAULTS = {
        title: gettextCatalog.getString('Are you sure?'),
        type: 'warning',
        confirmButtonColor: '#08C0FC',
        confirmButtonText: gettextCatalog.getString('Yes'),
        showCancelButton: true,
        cancelButtonText: gettextCatalog.getString('Cancel')
    };

    return function (options) {
        const opts = angular.extend({}, DEFAULTS, options);
        const defer = $q.defer();
        swal(opts).then(defer.resolve).catch(defer.reject);
        return defer.promise;
    };
}

servicesModule.factory('sweetAlert', sweetAlert);
