/*global module*/
'use strict';

/**
 * @ngInject
 */
function Redirects($stateProvider, $locationProvider, $urlRouterProvider,
                GettingStartedUrl) {

    function redirectGetStarted (from, to) {
        $urlRouterProvider.when(from,
            function () {
                window.location = (GettingStartedUrl + to);
            }
        );
    }

    redirectGetStarted('/getting-started/cloudforms/', '#cloudforms');
    redirectGetStarted('/getting-started/containers/', '#containers');
    redirectGetStarted('/getting-started/direct/', '#direct');
    redirectGetStarted('/getting-started/openshift/', '#openshift');
    redirectGetStarted('/getting-started/osp/', '#osp');
    redirectGetStarted('/getting-started/rhev/', '#rhv');
    redirectGetStarted('/getting-started/rhv/', '#rhv');
    redirectGetStarted('/getting-started/satellite/6/', '#satellite6');
    redirectGetStarted('/getting-started/satellite/5/', '#satellite5');
    redirectGetStarted('/getting-started', '#getstarted');
    redirectGetStarted('/getting-started/', '#getstarted');

    function redirectSplash(from) {
        $urlRouterProvider.when(from,
            function () {
                window.location = `/${window.insightsGlobal.appName}/`;
            }
        );
    }

    // there is no info state controller or jade
    // bounce to splash
    redirectSplash('/info');

    function devRedirectSplash(from) {
        $urlRouterProvider.when(from,
            function () {
                window.location = `/${window.insightsGlobal.appName}/overview/`;
            }
        );
    }

    if (window.location.hostname.indexOf('foo.redhat.com') !== -1) {
        // in development there is no Drupal splash page
        // we bounce to /overview in dev
        devRedirectSplash('/splash');
        devRedirectSplash('/info');
        devRedirectSplash('/');
    }
}

module.exports = Redirects;
