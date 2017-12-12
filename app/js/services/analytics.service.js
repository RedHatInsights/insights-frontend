/*global window, require*/
'use strict';

var servicesModule = require('./');
var priv = {};
var pub = {};

priv.sendable = function ignorable (accountNumber, IgnoreAccountList) {
    if (IgnoreAccountList.indexOf(accountNumber) === -1) {
        return true;
    }

    return false;
};

priv.doGoogleAnalytics = function doGoogleAnalytics ($location, User, IgnoreAccountList) {

    User.asyncCurrent(function doGoogleAnalyticsAfterUserLoad () {
        if (window.ga && priv.sendable(User.current.account_number, IgnoreAccountList)) {

            if (User.current && User.current.sso_username) {
                window.ga('set', 'dimension1', User.current.sso_username);
            }

            if (User.current && User.current.account_number) {
                window.ga('set', 'dimension2', User.current.account_number);
            }

            window.ga(
                'set',
                'page', '/' + window.insightsGlobal.appName + $location.path());

            window.ga('send', 'pageview');
        }
    });
};

function pendoBlob () { (function(p,e,n,d,o){var v,w,x,y,z;o=p[d]=p[d]||{};o._q=[];v=['initialize','identify','updateOptions','pageLoad'];for(w=0,x=v.length;w<x;++w)(function(m){o[m]=o[m]||function(){o._q[m===v[0]?'unshift':'push']([m].concat([].slice.call(arguments,0)));};})(v[w]);y=e.createElement(n);y.async=!0;y.src='https://cdn.pendo.io/agent/static/f210c485-387f-43ad-4eee-f55bab22507f/pendo.js';z=e.getElementsByTagName(n)[0];z.parentNode.insertBefore(y,z);})(window,document,'script','pendo') };

/**
 * @ngInject
 */
function AnalyticsService(InsightsConfig, $location, IgnoreAccountList, User) {
    pub.initPendo = function () {
        pendoBlob();
        User.asyncCurrent((user) => {
            if (typeof window.pendo !== 'undefined') {
                const pendoConf = {
                    apiKey: 'f210c485-387f-43ad-4eee-f55bab22507f',
                    visitor: {
                        id: user.sso_username,
                        internal: user.is_internal,
                        lang: user.locale
                    },
                    account: {
                        id: user.org_id,
                        account_number: user.account_number
                    }
                };
                window.pendo.initialize(pendoConf);
            }
        });
    };

    pub.pageLoad = function pageLoad () {
        if (InsightsConfig.doPaf) {
            // Send location updates to Google Analytics
            priv.doGoogleAnalytics($location, User, IgnoreAccountList);
        }
    };

    return pub;
}

servicesModule.service('AnalyticsService', AnalyticsService);
