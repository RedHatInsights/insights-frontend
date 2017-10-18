'use strict';

var statesModule = require('../');

/**
 * @ngInject
 */
function SplashCtrl($scope, $state, InsightsConfig) {
    $scope.gettingStartedLink = InsightsConfig.gettingStartedLink;

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

    //var video = document.getElementById('landingVid');
    //video.addEventListener('click',function(){
    //    if (video.paused)
    //        video.play();
    //    else
    //        video.pause();
    //},false);
}

statesModule.controller('SplashCtrl', SplashCtrl);
