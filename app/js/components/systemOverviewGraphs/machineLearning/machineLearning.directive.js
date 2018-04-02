'use strict';

const componentsModule = require('../../');

/**
 * @ngInject
 */
function machineLearningCtrl() {
}

function machineLearning() {
    return {
        templateUrl:
            'js/components/systemOverviewGraphs/machineLearning/machineLearning.html',
        restrict: 'E',
        replace: false,
        controller: machineLearningCtrl,
        scope: {
            system: '='
        }
    };
}

componentsModule.directive('machineLearning', machineLearning);
