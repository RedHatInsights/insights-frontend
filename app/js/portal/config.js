/*global window*/
'use strict';

/**
 * @ngInject
 */
function Config(cfpLoadingBarProvider, InsightsConfigProvider) {
    cfpLoadingBarProvider.includeSpinner = false;
    cfpLoadingBarProvider.loadingBarTemplate =
        `<div id="loading-bar" class="ng-animate-enabled">
            <div class="bar">
                <div class="peg"></div>
            </div>
        </div>`;

    let apiPrefix = window.localStorage.getItem('insights:apiPrefix');
    if (apiPrefix) {
        InsightsConfigProvider.setApiPrefix(apiPrefix);
    }

    let apiVersion = window.localStorage.getItem('insights:apiVersion');
    if (apiVersion) {
        InsightsConfigProvider.setApiVersion(apiVersion);
    }

    InsightsConfigProvider.setAuthenticate(true);
    InsightsConfigProvider.setAllowExport(true);
    InsightsConfigProvider.setDoPaf(true);
    InsightsConfigProvider.setFetchRelatedSolution(true);
    let anHour = (60 * 60 * 1000);
    InsightsConfigProvider.setAutoRefresh(anHour);
    InsightsConfigProvider.setPortal(true);
    InsightsConfigProvider.setGettingStartedLink(
        'https://access.redhat.com/products/red-hat-insights#getstarted');

    /* Used for Satellite integration
    InsightsConfigProvider.setAnsibleRunner(function ($location, planId, button) {
        $location.url(`/runPlaybook?planId=${planId}&customize=${customize}`);
    });
    */
}

module.exports = Config;
