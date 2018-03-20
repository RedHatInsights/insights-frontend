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
        replace: true,
        controller: machineLearningCtrl,
        scope: {}
    };
}

componentsModule.directive('machineLearning', machineLearning);
