'use strict';

var servicesModule = require('./');

/**
* @ngInject
*/
function PlatformService($rootScope, Account) {
    var platforms;

    function load() {
        platforms = Account.getProducts().then(res => res.data);
    }

    $rootScope.$on('account:change', load);
    load();

    return {
        getPlatforms: function () {
            return platforms;
        }
    };
}

servicesModule.service('PlatformService', PlatformService);
