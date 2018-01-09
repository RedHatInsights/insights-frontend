/*global require*/
'use strict';

const statesModule = require('../');

/**
 * @ngInject
 */
function SplashCtrl() {
    if (window.location.pathname.match(/\/insights.*?\/info.*/)) {
        if (window.insightsGlobal.isBeta) {
            window.location = '/insightsbeta/splash';
        } else {
            window.location = '/insights/splash';
        }
    }
}

statesModule.controller('SplashCtrl', SplashCtrl);
