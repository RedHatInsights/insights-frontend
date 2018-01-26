/*global require*/
'use strict';

const providersModule = require('./');

// This would have been cool to re-use in insights.js
// but in insights.js we need to have jwt before the Angular
// app is even built :( so we cant use this provider there
//
// This is used for the logout on primary nav though... I wonder if
// we should kill this component and just bake the stuff we want in
// that directive. I could go either way

/**
 * @ngInject
 */
function InsightsJwt() {
    const Jwt = require('jwt-redhat').default;

    // Add a little helper function
    Jwt.standardLogout = () => {
        Jwt.onInit(() => {
            if (Jwt.hack && Jwt.hack.cookies) {
                Jwt.hack.cookies.remove('rh_sso_sesssion');
            }

            Jwt.logout({ redirectUri: `${window.location.origin}/logout` });
        });
    };

    return {
        $get: function ($cookies) {
            // this only get got once
            Jwt.init({ clientId: 'customer-portal' }, { responseMode: 'query' });
            Jwt.hack = {};
            Jwt.hack.cookies = $cookies;
            return Jwt;
        }
    };
}

providersModule.provider('InsightsJwt', InsightsJwt);
