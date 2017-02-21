'use strict';

var servicesModule = require('./');

/**
 * @ngInject
 */
function AccountService($rootScope, User, InsightsConfig) {
    var user = User.current;
    var account = user.account_number;
    var storage_account = window.sessionStorage.getItem(InsightsConfig.acctKey);

    if (storage_account) {
        account = storage_account;
    }

    $rootScope.$on('account:change', function (evt, acct) {
        // Double equal on purpose
        if (account != acct) { // jshint ignore:line
            account = acct;
            $rootScope.$broadcast('reload:data');
        }
    });

    return {
        current: function (separator) {
            var accountStr;
            if (account) {
                accountStr = ((separator) ? separator : '?');
                accountStr += ('account_number=' + account);
                return accountStr;
            }

            return '';
        },

        number: function () {
            return account;
        },

        queryParam: function () {
            return {
                account_number: account
            };
        }
    };
}

servicesModule.service('AccountService', AccountService);
