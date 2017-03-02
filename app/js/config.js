'use strict';

var AuthInterceptor = require('./interceptors/auth');
var XomitInterceptor = require('./interceptors/xomit');
var ErrorInterceptor = require('./interceptors/error');

/**
 * @ngInject
 */
function Config(
    $stateProvider,
    $urlRouterProvider,
    $urlMatcherFactoryProvider,
    $locationProvider,
    $httpProvider,
    $compileProvider,
    $anchorScrollProvider,
    $animateProvider,
    $tooltipProvider,
    tagsInputConfigProvider,
    paginationConfig) {

    // strict mode requires a trailing slash
    $urlMatcherFactoryProvider.strictMode(false);

    // no hash bang
    $locationProvider.html5Mode(true).hashPrefix('!');

    // Default route
    $urlRouterProvider.otherwise('/');

    // Route redirects
    $urlRouterProvider.when('/error_infos', '/rules/admin/');
    $urlRouterProvider.when('/getting-started/',
        'https://access.redhat.com/products/red-hat-insights#getstarted');
    $urlRouterProvider.when('/info/security', '/security/');

    //https://github.com/angular-ui/ui-router/wiki/
    //Frequently-Asked-Questions#how-to-make-a-trailing-slash-optional-for-all-routes
    $urlRouterProvider.rule(function ($injector, $location) {
        var path = $location.url();

        // check to see if the path already has a slash where it should be
        if (path[path.length - 1] === '/' || path.indexOf('/?') > -1) {
            return;
        }

        if (path.indexOf('?') > -1) {
            return path.replace('?', '/?');
        }

        return path + '/';
    });

    // We are doing our own anchor scrolling, so disable angulars
    $anchorScrollProvider.disableAutoScrolling();

    // Prevents Basic Auth Popup
    $httpProvider.interceptors.push(XomitInterceptor);

    // Bounces to login if 401 is caught
    $httpProvider.interceptors.push(AuthInterceptor);

    // Adds a notification about http errors
    $httpProvider.interceptors.push(ErrorInterceptor);

    $animateProvider.classNameFilter(/ng-animate-enabled/);

    if (process.env.NODE_ENV === 'production') {
        $compileProvider.debugInfoEnabled(false);
    }

    $tooltipProvider.options({
        appendToBody: true,
        trigger: 'mouseenter',
        placement: 'top'
    });

    tagsInputConfigProvider.setDefaults('tagsInput', {
        allowedTagsPattern: /^[a-z0-9\.\-]+$/,
        keyProperty: 'name',
        displayProperty: 'name',
        minLength: '2',
        template: 'js/components/tag/tag.html'
    });
    tagsInputConfigProvider.setDefaults('autoComplete', {
        minLength: '0',
        loadOnFocus: 'true',
        loadOnEmpty: 'true',
        selectFirstMatch: 'false'
    });

    paginationConfig.maxSize = 5;
    paginationConfig.previousText = '«';
    paginationConfig.nextText = '»';

}

module.exports = Config;
