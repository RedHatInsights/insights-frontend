/*global require*/
'use strict';

const statesModule = require('../');
const jQuery = window.jQuery;

/**
 * @ngInject
 */
function SplashCtrl($scope, $state) {
    $scope.logged_in = window.LOGGED_IN;
    if (window.LOGGED_IN && $state.current && $state.current.bounceLoggedin) {
        $state.go('app.initial', {}, {
            location: 'replace'
        });
    }

    jQuery('body').addClass('landing-page');

    $scope.$on('$destroy', function () {
        jQuery('body').removeClass('landing-page');
    });
}

statesModule.controller('SplashCtrl', SplashCtrl);
