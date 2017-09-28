/*global require, module*/
'use strict';

const Jwt = require('jwt-redhat').default;

function scrollTop() {
    window.scrollTo(0, 0);
}

function stateScroll(from, next) {
    if (typeof next.scrollTop === 'function') {
        next.scrollTop(from, next, function (shouldScroll) {
            if (shouldScroll) {
                scrollTop();
            }
        });
    } else if (next.scrollTop) {
        scrollTop();
    }
}

/**
 * @ngInject
 */
function OnRun(
    $location,
    $timeout,
    $rootScope,
    $state,
    $urlRouter,
    InsightsConfig,
    User,
    $document,
    $anchorScroll,
    PermissionService,
    AnalyticsService,
    TitleService,
    Email) {

    // make sure the view can access the global isBeta
    $rootScope.isBeta = window.insightsGlobal.isBeta;

    // We want to tigger analytics on location changes, not state changes
    // with state changes we miss things
    // like the System Modal click when look at actions :(
    $rootScope.$on('$locationChangeSuccess', function () {
        AnalyticsService.pageLoad();
    });

    $rootScope.$on('$stateChangeSuccess', function (event, next, nextParams, from) {
        if (next && next.triggerComplete) {
            AnalyticsService.triggerEvent('InsightsCompletion');
        }

        TitleService.set(next.title);
        stateScroll(from, next);
    });

    AnalyticsService.triggerEvent('InsightsBegin');
    if (!InsightsConfig.authenticate) {
        return;
    }

    let firstStateChange = true;
    $rootScope.$on('$stateChangeStart', function (event, next, nextParams) {
        const nextState = next.name;
        if (nextState === 'evaluation') {
            firstStateChange = false;
        }

        if (firstStateChange && nextState.startsWith('app.')) {
            firstStateChange = false;
            event.preventDefault();
            $state.go('evaluation', {
                originalPath: window.location.toString()
            });
        }

        let hash = $location.hash();
        if (hash) {
            nextParams['#'] = hash;
        }

        if (!next.unauthenticated && InsightsConfig.authenticate) {
            User.init();
            Email.optUserIntoCampaigns();
        }

        let user = User.current;
        if (next.permission && !user.loaded) {
            event.preventDefault();
            User.asyncCurrent(function (user) {
                if (PermissionService.has(
                        user, PermissionService.PERMS[next.permission])) {

                    $urlRouter.sync();
                } else {
                    $state.go('app.forbidden');
                }
            });
        } else if (next.permission &&
                   !PermissionService.has(
                       user, PermissionService.PERMS[next.permission])) {
            $state.go('app.forbidden');
        }
    });

    $timeout(function () {
        $anchorScroll($location.hash());
    }, 1);

    Jwt.init({ clientId: 'customer-portal' }, { responseMode: 'query' });

    Jwt.onInit(() => {
        if (!Jwt.isAuthenticated()) {
            Jwt.login();
        }
    });
}

module.exports = OnRun;
