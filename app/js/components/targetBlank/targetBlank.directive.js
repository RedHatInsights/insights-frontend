'use strict';

var componentsModule = require('../');

/**
 * @ngInject
 */
function targetBlank($timeout) {
    function addTargetBlank(element) {
        var anchors = element.querySelectorAll('a');

        // loop through anchors and add target _blank
        for (let i = 0; i < anchors.length; i++) {
            anchors[i].target = '_blank';
        }
    }

    return {
        link: function (scope, element) {
            // timeout to ensure html has been properly bound
            $timeout(function () {
                if (element && element[0]) {
                    addTargetBlank(element[0]);
                }
            }, 0, false);
        }
    };
}

componentsModule.directive('targetBlank', targetBlank);
