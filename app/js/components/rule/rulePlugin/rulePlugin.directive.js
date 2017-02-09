'use strict';

var componentsModule = require('../../');

/**
 * @ngInject
 */
function rulePluginCtrl($scope, Rule) {
    $scope.plugins = [];
    $scope.config = {
        valueField: 'item',
        labelField: 'item',
        searchField: 'item',
        create: true
    };
    Rule.plugins().success(function (plugins) {
        $scope.plugins = plugins;
    });
}

function rulePlugin() {
    return {
        templateUrl: 'js/components/rule/rulePlugin/rulePlugin.html',
        restrict: 'E',
        controller: rulePluginCtrl
    };
}

componentsModule.directive('rulePlugin', rulePlugin);
