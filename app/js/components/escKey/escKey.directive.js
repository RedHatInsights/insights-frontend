'use strict';

var componentsModule = require('../');

/**
 * @ngInject
 */
function escKey($rootScope, $document) {
    return {
        restrict: 'AC',
        link: function () {
            $document.on('keydown', function (evt) {
                if (evt.keyCode === 27) {
                    $rootScope.$broadcast('telemetry:esc');
                }
            });
        }
    };
}

componentsModule.directive('escKey', escKey);
