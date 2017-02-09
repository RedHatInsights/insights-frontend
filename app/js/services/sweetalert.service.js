'use strict';

var servicesModule = require('./');
var swal = require('sweetalert');

/**
 * @ngInject
 */
function SweetAlert($rootScope, $q) {
    return {
        swal: function (arg1, arg2, arg3) {
            const defer = $q.defer();
            $rootScope.$evalAsync(function () {
                if (typeof (arg2) === 'function') {
                    swal(arg1, function (isConfirm) {
                        $rootScope.$evalAsync(function () {
                            arg2(isConfirm);
                            defer.resolve(isConfirm);
                        });
                    }, arg3);
                } else if (typeof arg1 === 'object' && !angular.isDefined(arg2)) {
                    swal(arg1, function (val) {
                        defer.resolve(val);
                    });
                } else {
                    swal(arg1, arg2, arg3);
                }
            });

            return defer.promise;
        },

        success: function (title, message) {
            $rootScope.$evalAsync(function () {
                swal(title, message, 'success');
            });
        },

        error: function (title, message) {
            $rootScope.$evalAsync(function () {
                swal(title, message, 'error');
            });
        },

        warning: function (title, message) {
            $rootScope.$evalAsync(function () {
                swal(title, message, 'warning');
            });
        },

        info: function (title, message) {
            $rootScope.$evalAsync(function () {
                swal(title, message, 'info');
            });
        },

        DEFAULT_WARNING_OPTS: Object.freeze({
            title: 'Are you sure?',
            type: 'warning',
            confirmButtonColor: '#DD6B55',
            confirmButtonText: 'Yes',
            html: true,
            showCancelButton: true
        })
    };
}

servicesModule.factory('SweetAlert', SweetAlert);
