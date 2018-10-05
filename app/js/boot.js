/*global require, module*/
'use strict';

const routeCustomizer = require('./state_customizer');
const moment = require('moment');

// this is needed to make the locale available at runtime
require('moment/locale/ja');

/**
 * @ngInject
 */
function OnRun($rootScope, AlertService, gettextCatalog, $cookies,
               CoercionService,$state,InsightsConfig, BetaRedirectService) {

    $rootScope.$on('$stateChangeSuccess', function () {
        AlertService.clearHttpError();
    });

    // beta check
    BetaRedirectService.checkAndRedirect();

    // https://docs.angularjs.org/api/ngCookies/service/$cookies
    // Up until Angular 1.3, $cookies exposed properties that represented the current
    // browser cookie values. In version 1.4, this behavior has changed, and $cookies
    // now provides a standard api of getters, setters etc.
    let lang = CoercionService.coerce($cookies.get('rh_locale'));
    gettextCatalog.setCurrentLanguage(lang);

    // We only support moment in en or ja
    // We want to default to en in cases where its not en or ja
    // Case 02170402 had this issue. Customer set their lang
    // to de and got ja moment stuff
    if (lang && lang === 'ja') {
        moment.locale('ja');
    } else {
        moment.locale('en');
    }

    if ($cookies.get('locale_debug')) {
        gettextCatalog.debug = true;
    }

    if (lang && lang !== 'en') {
        gettextCatalog.loadRemote('translations/' + lang + '/' + lang + '.json');
    }

    routeCustomizer.process($state.get(), InsightsConfig);
}

module.exports = OnRun;
