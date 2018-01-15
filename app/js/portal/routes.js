'use strict';

/**
 * @ngInject
 */
function Routes($stateProvider, $locationProvider, $urlRouterProvider,
                GettingStartedUrl, InviteUrl) {

    // App Routes

    // Rule routes
    $stateProvider
        .state('app.admin-rules', {
            url: '/rules/admin/?tags',
            templateUrl: 'js/states/rules/views/admin-rules.html',
            controller: 'AdminRuleCtrl',
            title: 'Rules Admin',
            hideGroup: true
        })
        .state('app.admin-rule-tags', {
            url: '/rules/admin/tags',
            templateUrl: 'js/states/rules/views/admin-rule-tags.html',
            controller: 'AdminRuleTagCtrl',
            title: 'Rule Tag Admin',
            hideGroup: true
        })
        .state('app.create-rule', {
            url: '/rules/new/',
            templateUrl: 'js/states/rules/views/create-rules.html',
            controller: 'NewRuleCtrl',
            scrollTop: true,
            hideGroup: true
        })
        .state('app.show-rule', {
            url: '/rules/:id/',
            templateUrl: 'js/states/rules/views/show-rules.html',
            controller: 'ShowRuleCtrl',
            scrollTop: true,
            hideGroup: true
        });

    // Page routes
    $stateProvider
        .state('app.forbidden', {
            url: '/403/',
            templateUrl: 'js/states/pages/views/403.html'
        });
    $stateProvider
        .state('app.paymentrequired', {
            url: '/402/',
            templateUrl: 'js/states/pages/views/402.html'
        });

    // Config routes
    $stateProvider
        .state('app.config-webhook-edit', {
            url: '/config/webhooks/:id',
            templateUrl: 'js/states/config/views/webhook-edit.html',
            controller: 'WebhookEditCtrl',
            title: 'Edit Webhook'
        })

        .state('app.config', {
            url: '/config/:tab',
            templateUrl: 'js/states/config/views/config.html',
            controller: 'ConfigCtrl',
            params: {
                tab: null
            },
            title: 'Configuration',
            hideGroup: true
        });

    // Announcement routes
    $stateProvider
        .state('app.new-announcement', {
            url: '/announcements/new/',
            templateUrl: 'js/states/announcements/new-announcement.html',
            controller: 'NewAnnouncementCtrl',
            permission: 'CREATE_ANNOUNCEMENT'
        })
        .state('app.edit-announcement', {
            url: '/announcements/:id/edit/',
            templateUrl: 'js/states/announcements/edit-announcement.html',
            controller: 'EditAnnouncementCtrl',
            permission: 'CREATE_ANNOUNCEMENT'
        });

    // Analytics routes
    $stateProvider
        .state('app.analytics', {
            url: '/__analytics',
            templateUrl: 'js/states/analytics/analytics.html',
            controller: 'AnalyticsCtrl'
        });

    $urlRouterProvider.when('/invite', function () {
        window.location = InviteUrl;
    });

    $stateProvider.state('info.security', {
            url: '/security/',
            templateUrl: 'js/states/security/security.html',
            controller: 'SecurityCtrl',
            title: 'Security',
            scrollTop: true,
            unauthenticated: true
        });

    $stateProvider.state('app.edit-topic', {
        url: '/topics/:id/edit/',
        templateUrl: 'js/states/topics/views/edit-topics.html',
        controller: 'EditTopicCtrl',
        hideGroup: true
    });
    $stateProvider.state('app.admin-topic', {
        url: '/topics/admin',
        templateUrl: 'js/states/topics/views/topic-admin.html',
        controller: 'TopicAdminCtrl',
        hideGroup: true
    });
    $stateProvider.state('invites', {
        url: '/invite',
        templateUrl: 'js/states/invites/invites.html',
        controller: 'InvitesCtrl'
    });
    $urlRouterProvider.when('/invite/', '/invite');
}

module.exports = Routes;
