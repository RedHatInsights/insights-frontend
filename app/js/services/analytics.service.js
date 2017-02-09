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

/**
 * @ngInject
 */
function AnalyticsService(InsightsConfig, $location, IgnoreAccountList, User) {

    pub.pageLoad = function pageLoad () {
        if (InsightsConfig.doPaf && window.chrometwo_require) {
            // Send location updates to Google Analytics
            priv.doGoogleAnalytics($location, User, IgnoreAccountList);

            window.chrometwo_require(['analytics/main', 'analytics/attributes'],
                function (paf, attrs) {
                    paf.init(['omniture']);
                    attrs.harvest();

                    // if we dont call wipe manually we will
                    // re-send e33 and e34s in some cases
                    paf.wipe('LabsBegin');
                    paf.wipe('InsightsBegin');
                    paf.wipe('LabsCompletion');
                    paf.wipe('InsightsCompletion');
                    paf.report();
                });
        }
    };

    pub.triggerEvent = function triggerEvent (eventName) {
        if (InsightsConfig.doPaf && window.chrometwo_require) {
            window.chrometwo_require(['analytics/main'], function (analytics) {
                analytics.trigger(eventName);
            });
        }
    };

    // if test set pub.priv = priv

    return pub;
}

servicesModule.service('AnalyticsService', AnalyticsService);
