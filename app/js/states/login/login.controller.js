/*global window*/
'use strict';

var statesModule = require('../');

/**
 * @ngInject
 */
function LoginCtrl($state) {
    if (window.LOGGED_IN) {
        return $state.go('app.initial');
    }

    window.location = ('https://www.redhat.com/wapps/sso/login.html?redirect=' +
                       window.encodeURIComponent(window.location.toString()));
}

statesModule.controller('LoginCtrl', LoginCtrl);
